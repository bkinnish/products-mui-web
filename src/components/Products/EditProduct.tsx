import React, { FunctionComponent, useState } from "react";
import Product from "../../api/ProductApi/product";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./editProduct.css";
import ValidationError from "../../common/validation";
import { isNullOrUndefined } from "../../common/utils/valueCheck";

interface EditProductProps {
  initialProduct: Product;
  onSaveChanges: (product: Product) => void;
  onCancelChanges: () => void;
}

interface IErrorObject {
  name?: String;
  price?: String;
  type?: String;
}

const validateData = (product: Product): IErrorObject => {
  let errorObject: IErrorObject = {};
  if (product.name.length === 0) {
    errorObject.name = "Name must be entered";
  }
  if (isNaN(product.price) || product.price <= 0) {
    errorObject.price = "A price must be greater than 0";
  }
  if (product.type === "") {
    errorObject.type = "Type must be selected";
  }
  return errorObject;
};

const EditProduct: FunctionComponent<EditProductProps> = ({
  initialProduct,
  onSaveChanges,
  onCancelChanges,
}) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [errorObject, setErrorObject] = useState<IErrorObject | null>(null);
  const [warningMessage, setWarningMessage] = useState<String>("");

  // const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setProduct({ ...product, name: event.target.value });
  // };

  // const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setProduct({
  //     ...product,
  //     price: parseFloat(parseFloat(event.target.value).toFixed(2)),
  //   });
  // };

  // const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setProduct({ ...product, type: event.target.value });
  // };

  // const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setProduct({ ...product, active: !product.active });
  // };

  const handleValidateData = (): IErrorObject => {
    const errorObject = validateData(product);
    setErrorObject(errorObject);
    return errorObject;
  };

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationObject = handleValidateData();
    if (
      isNullOrUndefined(validationObject?.name) &&
      isNullOrUndefined(validationObject?.price) &&
      isNullOrUndefined(validationObject?.type) // Product Type
    ) {
      onSaveChanges(product);
    } else {
      setWarningMessage("Fix validation messages before saving");
    }
  };

  const handleValidationDialogClose = () => {
    setWarningMessage("");
  };

  return (
    <div className="editProductPage">
      <form onSubmit={(e) => handleSaveChanges(e)}>
        <h2>{product.id === 0 ? "Add Product" : "Edit Product"}</h2>
        <br />
        <label htmlFor="productName" className="productLabel">
          Product Name:
        </label>
        <input
          id="productName"
          type="text"
          className="productInputElement"
          value={product.name}
          onChange={(event) =>
            setProduct({ ...product, name: event.target.value })
          }
          onBlur={handleValidateData}
        />
        {errorObject?.name !== null && (
          <ValidationError message={errorObject?.name} />
        )}

        <label htmlFor="productPrice" className="productLabel">
          Product Price:
        </label>
        <input
          id="productPrice"
          type="number"
          step=".01"
          className="productInputElement"
          placeholder="0.00"
          value={product.price}
          onChange={(event) =>
            setProduct({
              ...product,
              price: parseFloat(parseFloat(event.target.value).toFixed(2)),
            })
          }
          onBlur={handleValidateData}
        />
        {errorObject?.price !== null && (
          <ValidationError message={errorObject?.price} />
        )}

        <label htmlFor="productType" className="productLabel">
          Product Type:
        </label>
        <select
          id="productType"
          className="productInputElement"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setProduct({ ...product, type: event.target.value })
          }
          onBlur={handleValidateData}
          value={product.type}
        >
          <option value="fruit">Fruit</option>
          <option value="vegetable">Vegetable</option>
          <option value="dairy">Dairy</option>
        </select>
        {errorObject?.type !== null && (
          <ValidationError message={errorObject?.type} />
        )}
        <br />
        <div className="form-check">
          <label htmlFor="productActive" className="form-check-label">
            Active
          </label>
          <input
            id="productActive"
            type="checkbox"
            className="form-check-input"
            checked={product.active === true}
            onChange={() => {
              setProduct({ ...product, active: !product.active });
            }}
          />
        </div>
        <br />
        <Button variant="primary" className="productButton" type="submit">
          Save
        </Button>
        <Button
          variant="secondary"
          className="productButton"
          onClick={() => onCancelChanges()}
        >
          Cancel
        </Button>
      </form>

      <Modal
        show={warningMessage.length > 0}
        onHide={handleValidationDialogClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Invalid Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>{warningMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleValidationDialogClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditProduct;
