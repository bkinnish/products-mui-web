import React, { FunctionComponent, useState, useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditBrand from "./EditBrand";
import { getBrands, saveBrand, deleteBrand } from "../../api/BrandApi/brandApi";
import Brand from "../../api/BrandApi/brand";
import { BrandSortOrder } from "../../api/BrandApi/brandSortOrder";
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
import styles from "./Brands.module.scss";

const Brands: FunctionComponent = () => {
  const [brandData, setBrandData] = useState<Brand[]>([]);
  const [search, setSearch] = useState<string>("");
  const filteredBrandData = brandData?.filter((brand) =>
    brand?.name.toLowerCase().includes(search)
  );
  const [maxPagesCount, setMaxPagesCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<BrandSortOrder>(
    BrandSortOrder.name
  );
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deleteBrandId, setDeleteBrandId] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadData(1);
  }, []);

  const loadData = (
    pageNo: number,
    sortOrder: BrandSortOrder = BrandSortOrder.name,
    sortAsc: boolean = true
  ) => {
    setIsLoading(true);
    getBrands(pageNo, sortOrder, sortAsc)
      .then(
        (response) => {
          setBrandData(response?.items || []);
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

  const handleSortBrands = (newSortOrder: BrandSortOrder) => {
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

  const handleAddBrand = () => {
    setEditingBrand({
      id: "",
      name: "",
      active: true,
    });
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand({ ...brand });
  };

  const handleSaveChanges = (brand: Brand) => {
    saveBrand(brand).then((response) => {
      setEditingBrand(null);
      loadData(currentPage, sortOrder, sortAsc);
    });
  };

  const handleCancelChanges = () => {
    setEditingBrand(null);
  };

  const handleDeleteDialogShow = (id: string) => {
    setShowDeleteDialog(true);
    setDeleteBrandId(id);
  };
  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
    setDeleteBrandId(null);
  };

  const handleDeleteBrand = () => {
    if (deleteBrandId !== null && deleteBrandId !== "") {
      deleteBrand(deleteBrandId)
        .then((respone) => {
          setShowDeleteDialog(false);
          setDeleteBrandId(null);
          loadData(currentPage, sortOrder, sortAsc);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const lookupBrandName = (id: string): string => {
    const brand = brandData.find((p) => p.id === deleteBrandId);
    if (brand !== undefined) {
      return brand.name;
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

  let tableColumnMetadata: ColumnMetadata<Brand>[] = [
    {
      propertyName: "id",
      heading: "Id",
      align: CellAlignment.Right,
      padding: true,
      width: 60,
    },
    {
      propertyName: "name",
      heading: "Brand",
      align: CellAlignment.Left,
      padding: false,
    },
    {
      propertyName: "active",
      heading: "Is Active",
      align: CellAlignment.Left,
      padding: false,
      isCustomColumn: true,
      customComponent: (data: Brand) => <div>{data.active ? "Yes" : "No"}</div>,
    },
    {
      propertyName: "id",
      heading: "Actions",
      align: CellAlignment.Center,
      padding: true,
      width: 100,
      isSortColumn: false,
      isCustomColumn: true,
      customComponent: (data: Brand) => (
        <Stack direction="row" spacing={1}>
          <OutlinedButton
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditBrand(data)}
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

  const BrandsTable = InfiniteScrollTable<Brand>;

  const isDataLoaded = !isLoading && !errorMessage && brandData?.length > 0;

  return (
    <div className={styles.brandsPage}>
      <h2>Retail Brands</h2>

      <div className={styles.brandsButtonWrapper}>
        <div className={styles.addBrandButton}>
          <ContainedButton onClick={() => handleAddBrand()}>
            Add Brand
          </ContainedButton>
        </div>
      </div>

      <LoadingAndErrorMessages
        isLoading={isLoading}
        loadingErrorMessage={errorMessage}
        isAnyData={isDataLoaded}
      />
      {!isLoading && !errorMessage && editingBrand !== null && (
        <EditBrand
          initialBrand={editingBrand}
          onSaveChanges={handleSaveChanges}
          onCancelChanges={handleCancelChanges}
        />
      )}

      {isDataLoaded && editingBrand === null && (
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
              InputProps={{
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
          <BrandsTable
            tableHeading="Brands"
            data={filteredBrandData ?? []}
            columnMetadata={tableColumnMetadata}
            showSelectedColumn={false}
          ></BrandsTable>
        </div>
      )}

      <Modal
        show={showDeleteDialog}
        onHide={handleDeleteDialogClose}
        aria-labelledby="contained-modal-delete-brand"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Delete Product ({lookupBrandName(deleteBrandId as string)})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the brand?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleDeleteBrand}>
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

export default Brands;
