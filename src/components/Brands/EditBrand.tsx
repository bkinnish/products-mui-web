import React, { FunctionComponent, useState } from "react";
import Brand from "../../api/BrandApi/brand";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ValidationError from "../../common/validation";
import { isNullOrUndefined } from "../../common/utils/isNullOrUndefined";
import styles from "./editBrand.module.scss";

interface EditBrandProps {
  initialBrand: Brand;
  onSaveChanges: (brand: Brand) => void;
  onCancelChanges: () => void;
}

interface IErrorObject {
  name?: String;
}

const validateData = (brand: Brand): IErrorObject => {
  let errorObject: IErrorObject = {};
  if (brand.name.length === 0) {
    errorObject.name = "Name must be entered";
  }
  return errorObject;
};

const EditBrand: FunctionComponent<EditBrandProps> = ({
  initialBrand,
  onSaveChanges,
  onCancelChanges,
}) => {
  const [brand, setBrand] = useState<Brand>(initialBrand);
  const [errorObject, setErrorObject] = useState<IErrorObject | null>(null);
  const [warningMessage, setWarningMessage] = useState<String>("");

  const handleValidateData = (): IErrorObject => {
    const errorObject = validateData(brand);
    setErrorObject(errorObject);
    return errorObject;
  };

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationObject = handleValidateData();
    if (isNullOrUndefined(validationObject?.name)) {
      onSaveChanges(brand);
    } else {
      setWarningMessage("Fix validation messages before saving");
    }
  };

  const handleValidationDialogClose = () => {
    setWarningMessage("");
  };

  return (
    <div className={styles.editBrandPage}>
      <form onSubmit={(e) => handleSaveChanges(e)}>
        <h2>{brand.id === null ? "Add Brand" : "Edit Brand"}</h2>
        <br />
        <label htmlFor="brandName" className={styles.brandLabel}>
          Brand Name:
        </label>
        <input
          id="brandName"
          type="text"
          className={styles.brandInputElement}
          value={brand.name}
          onChange={(event) => setBrand({ ...brand, name: event.target.value })}
          onBlur={handleValidateData}
        />
        {errorObject?.name !== null && (
          <ValidationError message={errorObject?.name} />
        )}

        <br />
        <div className="form-check">
          <label htmlFor="brandActive" className="form-check-label">
            Active
          </label>
          <input
            id="brandActive"
            type="checkbox"
            className="form-check-input"
            checked={brand.active === true}
            onChange={() => {
              setBrand({ ...brand, active: !brand.active });
            }}
          />
        </div>
        <br />
        <Button variant="primary" className={styles.brandButton} type="submit">
          Save
        </Button>
        <Button
          variant="secondary"
          className={styles.brandButton}
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

export default EditBrand;
