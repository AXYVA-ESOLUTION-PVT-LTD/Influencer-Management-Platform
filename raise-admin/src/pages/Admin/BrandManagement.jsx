import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import * as Yup from "yup";
import BrandFiltering from "../../components/Common/BrandFiltering";
import Pagination from "../../components/Common/Pagination";
import TableContainer from "../../components/Common/TableContainer";
import ROLES from "../../constants/role";
import { addNewBrand, getBrand, updateBrand } from "../../store/brand/actions";
import "../../assets/themes/colors.scss";
const BrandManagement = (props) => {
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  // Meta title
  document.title = "Brand | Brandraise ";

  const dispatch = useDispatch();

  const { brands, loading, error, totalBrands } = useSelector(
    (state) => state.Brand
  );

  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [filterFields, setFilterFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    status: "",
  });
  const [isSearching, setIsSearching] = useState(false);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const createBrandValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      phoneNumber: "",
      city: "",
      country: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .matches(
          /^[A-Za-z\s]+$/,
          "First Name should not contain numbers or special characters"
        )
        .min(2, "First Name must be at least 2 characters long")
        .max(50, "First Name can't be longer than 50 characters")
        .required("First Name is required"),

      lastName: Yup.string()
        .matches(
          /^[A-Za-z\s]+$/,
          "Last Name should not contain numbers or special characters"
        )
        .min(2, "Last Name must be at least 2 characters long")
        .max(50, "Last Name can't be longer than 50 characters")
        .required("Last Name is required"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      companyName: Yup.string()
        .min(2, "Company Name must be at least 2 characters long")
        .max(100, "Company Name can't be longer than 100 characters")
        .required("Company Name is required"),

      phoneNumber: Yup.string()
              .transform((value) => {
                return value.replace(/[^\d\+\-]/g, ""); 
              })
              .matches(
                /^\+(\d{1,2})[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4}$/,
                "Phone number must start with a country code (e.g., +1 00000 00000) and contain only digits and dashes"
              )
              .required("Please enter your phone number"),

      city: Yup.string()
        .matches(
          /^[A-Za-z\s]+$/,
          "City should not contain numbers or special characters"
        )
        .min(2, "City must be at least 2 characters long")
        .max(50, "City can't be longer than 50 characters")
        .required("City is required"),

      country: Yup.string()
        .matches(
          /^[A-Za-z\s]+$/,
          "Country should not contain numbers or special characters"
        )
        .min(2, "Country must be at least 2 characters long")
        .max(50, "Country can't be longer than 50 characters")
        .required("Country is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        companyName: values.companyName.trim(),
        phoneNumber: values.phoneNumber.trim(),
        country: values.country.trim(),
        city: values.city.trim(),
        roleName: ROLES.BRAND,
        status: false,
      };
      setIsSubmitting(true);
      dispatch(addNewBrand(payload));
    },
  });

  useEffect(() => {
    if (!loading && isSubmitting) {
      if (!error) {
        createBrandValidation.resetForm();
        toggleCreateModal();
      } else {
        setSubmissionError(error);
        console.error("Error creating brand:", error);
      }
      setIsSubmitting(false);
    }
  }, [loading, error, isSubmitting]);

  const formatErrorMessage = (error) => {
    if (!error) return null;

    const errorMessage =
      typeof error === "string" ? error : JSON.stringify(error);

    if (errorMessage.includes("This")) {
      return errorMessage.split(/(?=This)/g).map((msg, index) => (
        <p key={index} className="text-danger m-0">
          {msg.trim()}
        </p>
      ));
    }

    return <p className="text-danger">{errorMessage}</p>;
  };

  const updateBrandValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: "Active",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        id: selectedBrand._id,
        status: values.status === "Inactive" ? false : true,
        roleName: ROLES.BRAND,
      };
      dispatch(updateBrand(payload));
      resetForm();
      toggleUpdateModal();
    },
  });

  // Get Influencer when Mount
  useEffect(() => {
    dispatch(
      getBrand({
        roleName: ROLES.BRAND,
        limit,
        pageCount,
        ...filterFields,
        sortBy,
        sortOrder,
        allrecord: false,
      })
    );
  }, [dispatch, limit, pageCount, isSearching, sortOrder, sortBy]);

  // Toggle modals
  const toggleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const toggleCreateModal = () => {
    if (isCreateModalOpen) {
      createBrandValidation.resetForm();
      setSubmissionError(null);
    }
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  const toggleDetailsModal = () => {
    setIsDetailsModalOpen(!isDetailsModalOpen);
  };
  // Handle update
  const handleUpdateBrand = (brand) => {
    setSelectedBrand(brand);
    toggleUpdateModal();
  };

  // Handle view details
  const handleViewDetails = (brand) => {
    setSelectedBrand(brand);
    toggleDetailsModal();
  };

  const columns = useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Company Name",
        accessor: "companyName",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "City",
        accessor: "city",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Country",
        accessor: "country",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`badge ${value ? "badge-active" : "badge-inactive"}`}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row: { original } }) => (
          <>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleViewDetails(original)}
            >
              <i
                className="bx bx-show"
                style={{ color: "var(--secondary-blue)" }}
              ></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleUpdateBrand(original)}
            >
              <i
                className="bx bx-edit"
                style={{ color: "var(--secondary-yellow)" }}
              ></i>
            </Button>
          </>
        ),
      },
    ],
    [handleUpdateBrand, handleViewDetails]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Button to Add New Influencer */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">Brands</h4>
            <div>
              <Button
                className="border-none"
                onClick={toggleCreateModal}
                style={{
                  backgroundColor: "var(--primary-purple)",
                  color: "var(--primary-white)",
                }}
              >
                Add Brand
              </Button>
            </div>
          </div>
          <BrandFiltering
            filterFields={filterFields}
            setFilterFields={setFilterFields}
            setIsSearching={setIsSearching}
          />

          {loading ? (
            <div className="text-center space-top">
              <Spinner style={{ color: "var(--primary-purple)" }} />
            </div>
          ) : (
            <>
              {/* Brand Table */}
              {brands.length ? (
                <>
                  <TableContainer
                    columns={columns}
                    data={brands}
                    isGlobalFilter={false}
                    isAddOptions={false}
                    customPageSize={10}
                    className="custom-header-css"
                    isPagination={false}
                    setSortBy={setSortBy}
                    sortBy={sortBy}
                    setSortOrder={setSortOrder}
                    sortOrder={sortOrder}
                  />

                  {/* Pagination */}
                  <Pagination
                    totalData={totalBrands}
                    setLimit={setLimit}
                    setPageCount={setPageCount}
                    limit={limit}
                    pageCount={pageCount}
                    currentPage={pageCount}
                  />
                </>
              ) : (
                <h1 className="text-center space-top">No Brand Found</h1>
              )}
            </>
          )}
        </Container>
      </div>

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} toggle={toggleDetailsModal}>
        <ModalHeader toggle={toggleDetailsModal}>Brand Details</ModalHeader>
        <ModalBody>
          {selectedBrand && (
            <div className="model-format">
              <strong>First Name</strong>
              <span>: {selectedBrand.firstName}</span>

              <strong>Last Name</strong>
              <span>: {selectedBrand.lastName}</span>

              <strong>Email</strong>
              <span>: {selectedBrand.email}</span>

              <strong>Company Name</strong>
              <span>
                :{selectedBrand.companyName ? selectedBrand.companyName : "-"}
              </span>

              <strong>Phone Number</strong>
              <span>
                :{selectedBrand.phoneNumber ? selectedBrand.phoneNumber : "-"}
              </span>

              <strong>City</strong>
              <span>: {selectedBrand.city ? selectedBrand.city : "-"}</span>

              <strong>Country</strong>
              <span>
                : {selectedBrand.country ? selectedBrand.country : "-"}
              </span>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggleDetailsModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen}>
        <ModalHeader toggle={toggleCreateModal}>Add Brand</ModalHeader>
        {submissionError && (
          <Alert color="danger" className="m-3">
            {formatErrorMessage(submissionError)}
          </Alert>
        )}
        <form onSubmit={createBrandValidation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="firstName" className="block mb-1">
                First Name:
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter First Name"
                onChange={createBrandValidation.handleChange}
                onBlur={createBrandValidation.handleBlur}
                value={createBrandValidation.values.firstName}
                invalid={
                  createBrandValidation.touched.firstName &&
                  createBrandValidation.errors.firstName
                    ? true
                    : false
                }
              />
              {createBrandValidation.touched.firstName &&
              createBrandValidation.errors.firstName ? (
                <div className="invalid-feedback">
                  {createBrandValidation.errors.firstName}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <Label htmlFor="lastName" className="block mb-1">
                Last Name:
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter Last Name"
                onChange={createBrandValidation.handleChange}
                onBlur={createBrandValidation.handleBlur}
                value={createBrandValidation.values.lastName}
                invalid={
                  createBrandValidation.touched.lastName &&
                  createBrandValidation.errors.lastName
                    ? true
                    : false
                }
              />
              {createBrandValidation.touched.lastName &&
              createBrandValidation.errors.lastName ? (
                <div className="invalid-feedback">
                  {createBrandValidation.errors.lastName}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <Label htmlFor="email" className="block mb-1">
                Email:
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email"
                onChange={createBrandValidation.handleChange}
                onBlur={createBrandValidation.handleBlur}
                value={createBrandValidation.values.email}
                invalid={
                  createBrandValidation.touched.email &&
                  createBrandValidation.errors.email
                    ? true
                    : false
                }
              />
              {createBrandValidation.touched.email &&
              createBrandValidation.errors.email ? (
                <div className="invalid-feedback">
                  {createBrandValidation.errors.email}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <Label htmlFor="companyName" className="block mb-1">
                Company Name:
              </Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Enter Company Name"
                onChange={createBrandValidation.handleChange}
                onBlur={createBrandValidation.handleBlur}
                value={createBrandValidation.values.companyName}
                invalid={
                  createBrandValidation.touched.companyName &&
                  createBrandValidation.errors.companyName
                    ? true
                    : false
                }
              />
              {createBrandValidation.touched.companyName &&
              createBrandValidation.errors.companyName ? (
                <div className="invalid-feedback">
                  {createBrandValidation.errors.companyName}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <Label htmlFor="phoneNumber" className="block mb-1">
                Phone Number:
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                placeholder="Enter Phone Number"
                onChange={createBrandValidation.handleChange}
                onBlur={createBrandValidation.handleBlur}
                value={createBrandValidation.values.phoneNumber}
                invalid={
                  createBrandValidation.touched.phoneNumber &&
                  createBrandValidation.errors.phoneNumber
                    ? true
                    : false
                }
              />
              {createBrandValidation.touched.phoneNumber &&
              createBrandValidation.errors.phoneNumber ? (
                <div className="invalid-feedback">
                  {createBrandValidation.errors.phoneNumber}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <Label htmlFor="city" className="block mb-1">
                City:
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Enter City"
                onChange={createBrandValidation.handleChange}
                onBlur={createBrandValidation.handleBlur}
                value={createBrandValidation.values.city}
                invalid={
                  createBrandValidation.touched.city &&
                  createBrandValidation.errors.city
                    ? true
                    : false
                }
              />
              {createBrandValidation.touched.city &&
              createBrandValidation.errors.city ? (
                <div className="invalid-feedback">
                  {createBrandValidation.errors.city}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <Label htmlFor="country" className="block mb-1">
                Country:
              </Label>
              <Input
                id="country"
                name="country"
                type="text"
                placeholder="Enter Country"
                onChange={createBrandValidation.handleChange}
                onBlur={createBrandValidation.handleBlur}
                value={createBrandValidation.values.country}
                invalid={
                  createBrandValidation.touched.country &&
                  createBrandValidation.errors.country
                    ? true
                    : false
                }
              />
              {createBrandValidation.touched.country &&
              createBrandValidation.errors.country ? (
                <div className="invalid-feedback">
                  {createBrandValidation.errors.country}
                </div>
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              style={{
                backgroundColor: "var(--primary-purple)",
                color: "var(--primary-white)",
              }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Save"}
            </Button>
            <Button color="secondary" onClick={toggleCreateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>Update Brand</ModalHeader>
        <form onSubmit={updateBrandValidation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="status" className="block mb-1">
                Status
              </Label>
              <Input
                name="status"
                type="select"
                onChange={updateBrandValidation.handleChange}
                onBlur={updateBrandValidation.handleBlur}
                value={updateBrandValidation.values.status}
                invalid={
                  updateBrandValidation.touched.status &&
                  updateBrandValidation.errors.status
                    ? true
                    : false
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </Input>
              {updateBrandValidation.touched.status &&
              updateBrandValidation.errors.status ? (
                <div className="invalid-feedback">
                  {updateBrandValidation.errors.status}
                </div>
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              style={{
                backgroundColor: "var(--primary-purple)",
                color: "var(--primary-white)",
              }}
              type="submit"
            >
              Save
            </Button>
            <Button color="secondary" onClick={toggleUpdateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default withTranslation()(BrandManagement);
