import React, { useEffect, useState } from "react";
import {
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  Alert,
  InputGroup,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addPaymentDetail,
  deletePaymentDetails,
  fetchAllPaymentDetails,
  fetchAllSecurePaymentDetails,
  getPaymentDetail,
  getPaymentMethod,
  updatePaymentDetail,
} from "../../store/actions";

const BankDetails = () => {
  const {
    paymentMethods,
    // fieldValue,
    // fieldNames,
    updatedField,
    successMessages,
    errorMessages,
    paymentDetail,
    loading,
    isPaymentDeleted,
    paymentSecureDetails,
    paymentMethodsloading
  } = useSelector((state) => state.Payment);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("Bank");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [viewPaymentMethod, setViewPaymentMethod] = useState("");
  const [visibleField, setVisibleField] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [updatePaymentForm, setUpdatePaymentForm] = useState(false);
  const [isPaymentDetailsFetched, setIsPaymentDetailsFetched] = useState(false);
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    upiId: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    upiId: "",
    phoneNumber: "",
  });

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setFormData({
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
      upiId: "",
      phoneNumber: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  const getPaymentMethodApi = async () => {
    dispatch(getPaymentMethod());
  };

  useEffect(() => {
    if (paymentMethods && !paymentMethodsloading ) {
      setViewPaymentMethod(paymentMethods);
    }
  }, [paymentMethods ,paymentMethodsloading]);

  useEffect(()=>{
    getAllSecurePaymentDetail(viewPaymentMethod);
  },[viewPaymentMethod]);

  const validateField = (name, value) => {
    let formErrors = { ...errors };

    switch (name) {
      case "accountHolderName":
        if (!value.trim()) {
          formErrors.accountHolderName = "Account holder name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          formErrors.accountHolderName =
            "Account holder name must contain only letters and spaces.";
        } else {
          delete formErrors.accountHolderName;
        }
        break;

      case "accountNumber":
        if (!value.trim()) {
          formErrors.accountNumber = "Account number is required.";
        } else if (!/^\d{9,18}$/.test(value)) {
          formErrors.accountNumber = "Account number must be 9-18 digits long.";
        } else {
          delete formErrors.accountNumber;
        }
        break;

      case "ifscCode":
        if (!value.trim()) {
          formErrors.ifscCode = "IFSC code is required.";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
          formErrors.ifscCode =
            "Invalid IFSC code. Format: 4 letters, 0, 6 alphanumeric characters.";
        } else {
          delete formErrors.ifscCode;
        }
        break;

      case "bankName":
        if (!value.trim()) {
          formErrors.bankName = "Bank name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          formErrors.bankName =
            "Bank name must contain only letters and spaces.";
        } else {
          delete formErrors.bankName;
        }
        break;

      case "branchName":
        if (!value.trim()) {
          formErrors.branchName = "Branch name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          formErrors.branchName =
            "Branch name must contain only letters and spaces.";
        } else {
          delete formErrors.branchName;
        }
        break;

      case "upiId":
        if (!value.trim()) {
          formErrors.upiId = "UPI ID is required.";
        } else if (!/^[\w.-]+@[\w.-]+$/.test(value)) {
          formErrors.upiId = "Invalid UPI ID. Format: username@bankname.";
        } else {
          delete formErrors.upiId;
        }
        break;

      case "phoneNumber":
        if (!value.trim()) {
          formErrors.phoneNumber = "Phone number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          formErrors.phoneNumber =
            "Phone number must be a valid 10-digit number.";
        } else {
          delete formErrors.phoneNumber;
        }
        break;

      default:
        break;
    }

    setErrors(formErrors);
  };

  const validateForm = () => {
    let formErrors = {};

    if (paymentMethod === "Bank") {
      if (!formData.accountHolderName)
        formErrors.accountHolderName = "Account holder name is required.";
      if (!formData.accountNumber)
        formErrors.accountNumber = "Account number is required.";
      if (!formData.ifscCode) formErrors.ifscCode = "IFSC code is required.";
      if (!formData.bankName) formErrors.bankName = "Bank name is required.";
      if (!formData.branchName)
        formErrors.branchName = "Branch name is required.";
    } else if (paymentMethod === "GPay") {
      if (!formData.upiId) formErrors.upiId = "UPI ID is required.";
    } else if (paymentMethod === "PayPal") {
      if (!formData.phoneNumber)
        formErrors.phoneNumber = "Phone number is required.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = { ...formData, paymentMethod };
      dispatch(addPaymentDetail(data));
      setViewPaymentMethod(paymentMethod);
      dispatch(getPaymentMethod());
    }
  };

  useEffect(() => {
    if (
      successMessages == "Payment details added successfully!" ||
      successMessages == "Payment details updated successfully!"
    ) {
      // setSuccessMessage(successMessages);
      // setTimeout(() => {
        setSuccessMessage("");
        setShowPaymentForm(false);
        setUpdatePaymentForm(false);
        setFormData({
          accountHolderName: "",
          accountNumber: "",
          ifscCode: "",
          bankName: "",
          branchName: "",
          upiId: "",
          phoneNumber: "",
        });
        setPaymentDetails(true);
        getAllSecurePaymentDetail(viewPaymentMethod);
      // }, 2000);
    }
    if (errorMessages) {
      console.log(errorMessages);
      // setErrorMessage(errorMessages);
      // setTimeout(() => setErrorMessage(""), 2000);
    }
  }, [successMessages, errorMessages]);

  useEffect(() => {
    const getBankVerified = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const isBankVerified = user.isBankVerified;
      if (isBankVerified) {
        setShowPaymentForm(false);
        setUpdatePaymentForm(false);
        getPaymentMethodApi();
        setPaymentDetails(true);
      } else {
        setShowPaymentForm(true);
        setPaymentDetails(false);
        setUpdatePaymentForm(false);
      }
    };

    getBankVerified();
  }, []);

  const toggleFieldVisibility = (fieldName) => {
    if (visibleField === fieldName) {
      setVisibleField(null);
      getAllSecurePaymentDetail(viewPaymentMethod);
    } else {
      setVisibleField(fieldName);
      dispatch(getPaymentDetail(fieldName));
    }
  };

  useEffect(() => {
    setFieldValues((prev) => ({
      ...prev,
      [updatedField?.fieldNames]: updatedField?.fieldValue,
    }));
  }, [updatedField]);

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const confirmDelete = () => {
    dispatch(deletePaymentDetails());
    // setFormData({
    //   accountHolderName: "",
    //   accountNumber: "",
    //   ifscCode: "",
    //   bankName: "",
    //   branchName: "",
    //   upiId: "",
    //   phoneNumber: "",
    // });
  };

  useEffect(() => {
    if (isPaymentDeleted) {
      setFormData({
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branchName: "",
        upiId: "",
        phoneNumber: "",
      });
      setShowPaymentForm(true);
      setPaymentDetails(false);

    }
    setIsDeleteModalOpen(false);
  }, [isPaymentDeleted]);

  const getAllSecurePaymentDetail = (paymentMethods) => {
    dispatch(fetchAllSecurePaymentDetails(paymentMethods));
  };

  const renderField = (label, fieldName, error) => {
    const isSensitiveField =
      fieldName === "accountHolderName" ||
      fieldName === "accountNumber" ||
      fieldName === "upiId" ||
      fieldName === "phoneNumber";
    return (
      <FormGroup>
        <Label for={fieldName}>{label}</Label>
        <InputGroup>
          <Input
            type="text"
            id={fieldName}
            value={fieldValues[fieldName]}
            readOnly
          />
          {isSensitiveField && (
            <InputGroupText
              onClick={(e) => {
                toggleFieldVisibility(fieldName);
              }}
            >
              {visibleField === fieldName ? <FaEyeSlash /> : <FaEye />}
            </InputGroupText>
          )}
        </InputGroup>
        <FormFeedback>{error}</FormFeedback>
      </FormGroup>
    );
  };

  const openUpdateForm = () => {
    dispatch(fetchAllPaymentDetails());
  };

  useEffect(() => {
    if (paymentDetail && !loading) {
      setFormData(paymentDetail);
    }
  }, [paymentDetail ,loading]);

  useEffect(() => {
    if (paymentSecureDetails) {
      setFieldValues(paymentSecureDetails);
    }
  }, [paymentSecureDetails]);

  const toggleUpdateForm = () => {
    setUpdatePaymentForm(true);
    setPaymentDetails(false);
    openUpdateForm();
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, paymentMethod };
    dispatch(updatePaymentDetail(data));
  };

  const renderUpdateField = (label, fieldName, value) => (
    <FormGroup>
      <Label for={fieldName}>{label}</Label>
      <Input
        type="text"
        id={fieldName}
        name={fieldName}
        value={loading ? "Loading..." : value || ""}
        readOnly={loading}
        onChange={!loading ? handleUpdateChange : undefined}
      />
      {errors[fieldName] && <FormFeedback>{errors[fieldName]}</FormFeedback>}
    </FormGroup>
  );

  return (
    <>
      {/* Add Form */}
      {showPaymentForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {/* {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )} */}

          <FormGroup tag="fieldset" className="transaction-type-fieldset">
            <Label for="paymentMethod">Payment Method</Label>
            <div className="radio-container">
              <FormGroup check>
                <Label check className="radio-option">
                  <Input
                    type="radio"
                    name="paymentMethod"
                    value="Bank"
                    checked={paymentMethod === "Bank"}
                    onChange={() => handlePaymentMethodChange("Bank")}
                  />
                  Bank
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check className="radio-option">
                  <Input
                    type="radio"
                    name="paymentMethod"
                    value="GPay"
                    checked={paymentMethod === "GPay"}
                    onChange={() => handlePaymentMethodChange("GPay")}
                  />
                  GPay
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check className="radio-option">
                  <Input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={() => handlePaymentMethodChange("PayPal")}
                  />
                  PayPal
                </Label>
              </FormGroup>
            </div>
          </FormGroup>

          {/* Bank Payment Option */}
          {paymentMethod === "Bank" && (
            <>
              <FormGroup>
                <Label for="accountHolderName">Account Holder Name</Label>
                <Input
                  type="text"
                  name="accountHolderName"
                  id="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  invalid={!!errors.accountHolderName}
                />
                <FormFeedback>{errors.accountHolderName}</FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for="accountNumber">Account Number</Label>
                <Input
                  type="text"
                  name="accountNumber"
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  invalid={!!errors.accountNumber}
                />
                <FormFeedback>{errors.accountNumber}</FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for="ifscCode">IFSC Code</Label>
                <Input
                  type="text"
                  name="ifscCode"
                  id="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  invalid={!!errors.ifscCode}
                />
                <FormFeedback>{errors.ifscCode}</FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for="bankName">Bank Name</Label>
                <Input
                  type="text"
                  name="bankName"
                  id="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  invalid={!!errors.bankName}
                />
                <FormFeedback>{errors.bankName}</FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for="branchName">Branch Name</Label>
                <Input
                  type="text"
                  name="branchName"
                  id="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  invalid={!!errors.branchName}
                />
                <FormFeedback>{errors.branchName}</FormFeedback>
              </FormGroup>
            </>
          )}

          {/* GPay Payment Option */}
          {paymentMethod === "GPay" && (
            <FormGroup>
              <Label for="upiId">UPI ID</Label>
              <Input
                type="text"
                name="upiId"
                id="upiId"
                value={formData.upiId}
                onChange={handleChange}
                invalid={!!errors.upiId}
              />
              <FormFeedback>{errors.upiId}</FormFeedback>
            </FormGroup>
          )}

          {/* PayPal Payment Option */}
          {paymentMethod === "PayPal" && (
            <FormGroup>
              <Label for="phoneNumber">Phone Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                invalid={!!errors.phoneNumber}
              />
              <FormFeedback>{errors.phoneNumber}</FormFeedback>
            </FormGroup>
          )}

          <Button type="submit">Submit</Button>
        </form>
      )}

      {/* Display Data */}
      {paymentMethodsloading ? (
        <div className="text-center mt-3">
          <Spinner />
        </div>
      ) : (
        paymentDetails && (
          <div className="mt-3">
            <h5>Payment Details</h5>
            {viewPaymentMethod === "Bank" && (
              <>
                {renderField(
                  "Account Holder Name",
                  "accountHolderName",
                  errors.accountHolderName
                )}
                {renderField(
                  "Account Number",
                  "accountNumber",
                  errors.accountNumber
                )}
                {renderField("IFSC Code", "ifscCode", errors.ifscCode)}
                {renderField("Bank Name", "bankName", errors.bankName)}
                {renderField("Branch Name", "branchName", errors.branchName)}
              </>
            )}
            {viewPaymentMethod === "GPay" &&
              renderField("UPI ID", "upiId", errors.upiId)}

            {viewPaymentMethod === "PayPal" &&
              renderField("Phone Number", "phoneNumber", errors.phoneNumber)}

            <div className="d-flex gap-2">
              <Button type="submit" onClick={toggleUpdateForm}>
                Update Payment Details
              </Button>
              <Button type="submit" color="danger" onClick={toggleDeleteModal}>
                Remove Payment Details
              </Button>
            </div>
          </div>
        )
      )}

      {/* Update From */}
      {loading ? (
        <div className="text-center mt-3">
          <Spinner />
        </div>
      ) : (
        updatePaymentForm &&
        !paymentDetails && (
          <>
            <div className="mt-3">
              <h5>Update Payment Details</h5>

              {/* Alert Messages */}
              {successMessage && (
                <Alert color="success" className="mt-3">
                  {successMessage}
                </Alert>
              )}
              {errorMessage && (
                <Alert color="danger" className="mt-3">
                  {errorMessage}
                </Alert>
              )}

              <form onSubmit={handleUpdateSubmit}>
                {viewPaymentMethod === "Bank" && (
                  <>
                    {renderUpdateField(
                      "Account Holder Name",
                      "accountHolderName",
                      formData.accountHolderName
                    )}
                    {renderUpdateField(
                      "Account Number",
                      "accountNumber",
                      formData.accountNumber
                    )}
                    {renderUpdateField(
                      "IFSC Code",
                      "ifscCode",
                      formData.ifscCode
                    )}
                    {renderUpdateField(
                      "Bank Name",
                      "bankName",
                      formData.bankName
                    )}
                    {renderUpdateField(
                      "Branch Name",
                      "branchName",
                      formData.branchName
                    )}
                  </>
                )}
                {viewPaymentMethod === "GPay" &&
                  renderUpdateField("UPI ID", "upiId", formData.upiId)}

                {viewPaymentMethod === "PayPal" &&
                  renderUpdateField(
                    "Phone Number",
                    "phoneNumber",
                    formData.phoneNumber
                  )}

                {/* Buttons */}
                <div className="button-container d-flex gap-2">
                  <Button type="submit" color="primary">
                    Update Payment Details
                  </Button>
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setPaymentDetails(true);
                      setShowPaymentForm(false);
                      setUpdatePaymentForm(false);
                      getAllSecurePaymentDetail(viewPaymentMethod);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </>
        )
      )}

      {/* Delete Model */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>
          Delete Bank Details
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete your bank details?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default BankDetails;
