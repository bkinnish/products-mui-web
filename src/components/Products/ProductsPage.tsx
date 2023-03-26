import React, { FunctionComponent, useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
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
import "./productsPage.css";

const ProductPage: FunctionComponent = () => {
  const [productApiVersion, setProductApiVersion] = useState<string | null>(
    null
  );
  const [productData, setProductData] = useState<Product[]>([]);
  const [maxPagesCount, setMaxPagesCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<ProductSortOrder>(
    ProductSortOrder.name
  );
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deleteProductId, setDeleteProductId] = useState<number>(0);
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
        },
        (err) => {
          setErrorMessage(err.message);
        }
      )
      .catch((err) => {
        // Handle network errors.
        setErrorMessage(err.message || "Network Connect Timeout Error");
      })
      .finally(() => {
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

  const handleAddProduct = () => {
    // The default selection is fruit.
    setEditingProduct({
      id: 0,
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

  const handleDeleteDialogShow = (id: number) => {
    setShowDeleteDialog(true);
    setDeleteProductId(id);
  };
  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
    setDeleteProductId(0);
  };

  const handleDeleteProduct = () => {
    if (deleteProductId !== 0) {
      deleteProduct(deleteProductId)
        .then((respone) => {
          setShowDeleteDialog(false);
          setDeleteProductId(0);
          loadData(currentPage, sortOrder, sortAsc);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const lookupProductName = (id: number): string => {
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
      {/* {isLoading && <div className="spinner-border m-5" role="status" />}
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show">
          <strong>Error</strong> {errorMessage}
        </div>
      )} */}
      {!isLoading && !errorMessage && editingProduct !== null && (
        <EditProduct
          initialProduct={editingProduct}
          onSaveChanges={handleSaveChanges}
          onCancelChanges={handleCancelChanges}
        />
      )}
      {isDataLoaded && editingProduct === null && (
        <React.Fragment>
          <div className="productsButtonWrapper">
            <div className="addProductButton">
              <Button variant="success" onClick={() => handleAddProduct()}>
                Add Product
              </Button>
            </div>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th
                  className="productSortHeader"
                  onClick={() => handleSortProducts(ProductSortOrder.name)}
                >
                  Name
                </th>
                <th
                  className="productSortHeader"
                  onClick={() => handleSortProducts(ProductSortOrder.price)}
                >
                  Price
                </th>
                <th
                  className="productSortHeader"
                  onClick={() => handleSortProducts(ProductSortOrder.type)}
                >
                  Type
                </th>
                <th
                  className="productSortHeader"
                  onClick={() => handleSortProducts(ProductSortOrder.active)}
                >
                  Active
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {productData.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.type}</td>
                  <td>{product.active ? "Yes" : "No"}</td>
                  <td className="tableRecordButtonWrapper">
                    <Button
                      variant="success"
                      className="tableRecordButton"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="tableRecordButton"
                      onClick={() => handleDeleteDialogShow(product.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>{pagingItems}</Pagination>
        </React.Fragment>
      )}

      <Modal show={showDeleteDialog} onHide={handleDeleteDialogClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Delete Product ({lookupProductName(deleteProductId)})
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
