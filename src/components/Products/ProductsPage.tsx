import React, { FunctionComponent, useState, useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditProduct from "./EditProduct";
import {
  getProductApiVersion,
  getProducts,
  saveProduct,
  deleteProduct,
} from "../../api/ProductApi/productApi";
import Product from "../../api/ProductApi/product";
import { ProductSortOrder } from "../../api/ProductApi/productSortOrder";
import { formatCurrency } from "../../common/utils/numbers";
import LoadingAndErrorMessages from "../../common/Messages/LoadingAndErrorMessages";
import InfiniteScrollTable, {
  CellAlignment,
  ColumnMetadata,
} from "../../common/table/useInfiniteScrollTable";
import OutlinedButton from "../../common/buttons/OutLinedButton";
import ContainedButton from "../../common/buttons/ContainedButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "./productsPage.css";

const ProductPage: FunctionComponent = () => {
  const [productApiVersion, setProductApiVersion] = useState<string | null>(
    null
  );
  const [productData, setProductData] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const filteredProductData = productData?.filter((product) =>
    product?.name.toLowerCase().includes(search)
  );
  const [maxPagesCount, setMaxPagesCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<ProductSortOrder>(
    ProductSortOrder.name
  );
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      loadVersion();
    }
    loadData(1);
  }, []);

  const loadVersion = () => {
    getProductApiVersion().then((response) => {
      setProductApiVersion(response);
    });
  };

  const loadData = (
    pageNo: number,
    sortOrder: ProductSortOrder = ProductSortOrder.name,
    sortAsc: boolean = true
  ) => {
    setIsLoading(true);
    getProducts(pageNo, sortOrder, sortAsc)
      .then(
        (response) => {
          setProductData(response?.items || []);
          setCurrentPage(response?.currentPage || 1);
          setMaxPagesCount(response?.totalPages || 0);
          setErrorMessage(undefined);
          if (response && (response as any)?.status !== 499) {
            setIsLoading(false);
          }
        },
        (err) => {
          setErrorMessage(err.message);
          setIsLoading(false);
        }
      )
      .catch((err) => {
        // Handle network errors.
        setErrorMessage(err.message || "Network Connect Timeout Error");
        setIsLoading(false);
      });
  };

  const handleSortProducts = (newSortOrder: ProductSortOrder) => {
    setSortOrder(newSortOrder);
    var newSortAsc = sortOrder === newSortOrder ? !sortAsc : sortAsc;
    setSortAsc(newSortAsc);
    loadData(1, newSortOrder, newSortAsc);
  };

  const handleChangePage = (pageNo: number) => {
    loadData(pageNo, sortOrder, sortAsc);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddProduct = () => {
    // The default selection is fruit.
    setEditingProduct({
      id: "",
      name: "",
      price: 0.0,
      type: "fruit",
      active: true,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveChanges = (product: Product) => {
    saveProduct(product).then((response) => {
      setEditingProduct(null);
      loadData(currentPage, sortOrder, sortAsc);
    });
  };

  const handleCancelChanges = () => {
    setEditingProduct(null);
  };

  const handleDeleteDialogShow = (id: string) => {
    setShowDeleteDialog(true);
    setDeleteProductId(id);
  };
  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
    setDeleteProductId(null);
  };

  const handleDeleteProduct = () => {
    if (deleteProductId !== null && deleteProductId !== "") {
      deleteProduct(deleteProductId)
        .then((respone) => {
          setShowDeleteDialog(false);
          setDeleteProductId(null);
          loadData(currentPage, sortOrder, sortAsc);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const lookupProductName = (id: string): string => {
    const product = productData.find((p) => p.id === deleteProductId);
    if (product !== undefined) {
      return product.name;
    } else {
      return "";
    }
  };

  let pagingItems = [];
  for (let page = 1; page <= maxPagesCount; page++) {
    const pageNo = page;
    pagingItems.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => handleChangePage(pageNo)}
      >
        {page}
      </Pagination.Item>
    );
  }

  let tableColumnMetadata: ColumnMetadata<Product>[] = [
    {
      propertyName: "id",
      heading: "Id",
      align: CellAlignment.Right,
      padding: true,
      width: 60,
    },
    {
      propertyName: "name",
      heading: "Product",
      align: CellAlignment.Left,
      padding: false,
    },
    {
      propertyName: "price",
      heading: "Price",
      align: CellAlignment.Left,
      padding: false,
      isCustomColumn: true,
      customComponent: (data: Product) => (
        <div>{formatCurrency(data.price)}</div>
      ),
    },
    {
      propertyName: "type",
      heading: "Type",
      align: CellAlignment.Left,
      padding: false,
    },
    {
      propertyName: "active",
      heading: "Is Active",
      align: CellAlignment.Left,
      padding: false,
      isCustomColumn: true,
      customComponent: (data: Product) => (
        <div>{data.active ? "Yes" : "No"}</div>
      ),
    },
    {
      propertyName: "id",
      heading: "Actions",
      align: CellAlignment.Center,
      padding: true,
      width: 100,
      isSortColumn: false,
      isCustomColumn: true,
      customComponent: (data: Product) => (
        <Stack direction="row" spacing={1}>
          <OutlinedButton
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditProduct(data)}
          >
            Edit
          </OutlinedButton>
          <OutlinedButton
            size="small"
            startIcon={<DeleteIcon />}
            disabled={false}
            onClick={() => handleDeleteDialogShow(data.id)}
          >
            Delete
          </OutlinedButton>
        </Stack>
      ),
    },
  ];

  const ProductsTable = InfiniteScrollTable<Product>;

  const isDataLoaded = !isLoading && !errorMessage && productData?.length > 0;

  return (
    <div className="productPage">
      <h2>Retail Products</h2>
      {productApiVersion && <div>Product: {productApiVersion}</div>}
      <LoadingAndErrorMessages
        isLoading={isLoading}
        loadingErrorMessage={errorMessage}
        isAnyData={isDataLoaded}
      />
      {!isLoading && !errorMessage && editingProduct !== null && (
        <EditProduct
          initialProduct={editingProduct}
          onSaveChanges={handleSaveChanges}
          onCancelChanges={handleCancelChanges}
        />
      )}

      {isDataLoaded && editingProduct === null && (
        <div style={{ paddingLeft: 10, paddingRight: 10, maxWidth: 1100 }}>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="centre"
            spacing={2}
            style={{ marginLeft: 10, maxWidth: 1000, marginRight: 50 }}
          >
            <TextField
              label="search..."
              onChange={handleSearch}
              size="small"
              inputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </Stack>
          <div className="productsButtonWrapper">
            <div className="addProductButton">
              <ContainedButton onClick={() => handleAddProduct()}>
                Add Product
              </ContainedButton>
            </div>
          </div>
          <ProductsTable
            tableHeading="Products"
            data={filteredProductData ?? []}
            columnMetadata={tableColumnMetadata}
            showSelectedColumn={false}
          ></ProductsTable>
        </div>
      )}

      <Modal show={showDeleteDialog} onHide={handleDeleteDialogClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Delete Product ({lookupProductName(deleteProductId as string)})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the product?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleDeleteProduct}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleDeleteDialogClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductPage;
