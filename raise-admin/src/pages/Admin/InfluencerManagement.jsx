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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer"; // Adjust import path if necessary
import {
  addNewInfluencer,
  getInfluencers,
  updateInfluencer,
} from "../../store/influencers/actions";
import ROLES from "../../constants/role";
import Pagination from "../../components/Common/Pagination";
import InfluencerFiltering from "../../components/Common/InfluencerFiltering";
import "../../assets/themes/colors.scss";
import { Link } from "react-router-dom";
const InfluencerManagement = (props) => {
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [filterFields, setFilterFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "",
  });
  const [isSearching, setIsSearching] = useState(false);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Meta title
  document.title = "Influencer | Brandraise ";

  const dispatch = useDispatch();

  const { influencers, loading, error, totalInfluencers, addInfluencerLoading, currentPage } =
    useSelector((state) => state.Influencer);

  const createInfluncerValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      city: "",
      country: "",
      platform: "",
      username: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .matches(
          /^[A-Za-z\s]+$/,
          "First Name should only contain letters and spaces"
        )
        .min(2, "First Name must be at least 2 characters long")
        .max(50, "First Name can't be longer than 50 characters")
        .required("First Name is required"),

      lastName: Yup.string()
        .matches(
          /^[A-Za-z\s]+$/,
          "Last Name should only contain letters and spaces"
        )
        .min(2, "Last Name must be at least 2 characters long")
        .max(50, "Last Name can't be longer than 50 characters")
        .required("Last Name is required"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      city: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "City should only contain letters and spaces")
        .min(2, "City must be at least 2 characters long")
        .max(50, "City can't be longer than 50 characters")
        .required("City is required"),

      country: Yup.string()
        .matches(
          /^[A-Za-z\s]+$/,
          "Country should only contain letters and spaces"
        )
        .min(2, "Country must be at least 2 characters long")
        .max(50, "Country can't be longer than 50 characters")
        .required("Country is required"),

      phoneNumber: Yup.string()
              .transform((value) => {
                return value.replace(/[^\d\+\-]/g, ""); 
              })
              .matches(
                /^\+(\d{1,2})[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4}$/,
                "Phone number must start with a country code (e.g., +1 00000 00000) and contain only digits and dashes"
              )
              .required("Please enter your phone number"),

      platform: Yup.string()
        .oneOf(
          ["Facebook", "Instagram", "Tiktok", "YouTube"],
          "Platform must be one of: Facebook, Instagram, Tiktok, YouTube"
        )
        .required("Platform is required"),

        username: Yup.string()
        .matches(
          /^[A-Za-z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores"
        )
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username can't be longer than 20 characters")
        .required("Username is required"),
    }),

    onSubmit: (values, { resetForm }) => {
      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        city: values.city.trim(),
        country: values.country.trim(),
        phoneNumber: values.phoneNumber.trim(),
        platform: values.platform.trim(),
        username: values.username.trim(),
        roleName: ROLES.INFLUENCER,
        status: false,
      };
      setIsSubmitting(true);
      dispatch(addNewInfluencer(payload));
    },
  });

  useEffect(() => {
    if (!addInfluencerLoading && isSubmitting) {
      if (!error) {
        createInfluncerValidation.resetForm();
        toggleCreateModal();
      } else {
        setSubmissionError(error);
        console.error("Error creating brand:", error);
      }
      setIsSubmitting(false);
    }
  }, [addInfluencerLoading, error, isSubmitting]);

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

  const updateInfluncerValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: selectedInfluencer
        ? selectedInfluencer.status
          ? "Active"
          : "Inactive"
        : "Active",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        id: selectedInfluencer._id,
        status: values.status === "Inactive" ? false : true,
        roleName: ROLES.INFLUENCER,
      };
      dispatch(updateInfluencer(payload));
      resetForm();
      toggleUpdateModal();
    },
  });

  // Get Influencer when Mount
  useEffect(() => {
    dispatch(
      getInfluencers({
        roleName: ROLES.INFLUENCER,
        limit,
        pageCount,
        ...filterFields,
        sortBy,
        sortOrder,
        allrecord: false,
      })
    );
  }, [dispatch, limit, pageCount, isSearching, sortOrder, sortBy ]);

  // Toggle modals
  const toggleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const toggleCreateModal = () => {
    if (isCreateModalOpen) {
      createInfluncerValidation.resetForm();
      setSubmissionError(null);
    }
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  const toggleDetailsModal = () => {
    setIsDetailsModalOpen(!isDetailsModalOpen);
  };
  // Handle update
  const handleUpdateInfluencer = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleUpdateModal();
  };

  // Handle view details
  const handleViewDetails = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleDetailsModal();
  };

  const columns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
        Cell: ({ row }) => (
          <Link
            to={`/influencers/${row.original._id}`}
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {row.original.username}
          </Link>
        ),
      },
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
              onClick={() => handleUpdateInfluencer(original)}
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
    [handleUpdateInfluencer, handleViewDetails]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">Influencers</h4>
            <div>
              <Button
                className="border-none"
                onClick={toggleCreateModal}
                style={{
                  backgroundColor: "var(--primary-purple)",
                  color: "var(--primary-white)",
                }}
              >
                Add Influencer
              </Button>
            </div>
          </div>
          {/* filtering */}
          <InfluencerFiltering
            filterFields={filterFields}
            setFilterFields={setFilterFields}
            setIsSearching={setIsSearching}
          />

          {loading ? (
            <div className="text-center space-top">
              <Spinner style={{ color: "var(--primary-purple)" }} />{" "}
            </div>
          ) : (
            <>
              {influencers.length ? (
                <>
                  <TableContainer
                    columns={columns}
                    data={influencers}
                    isGlobalFilter={false} // Assuming you don't need global filtering here
                    isAddOptions={false}
                    customPageSize={10}
                    className="custom-header-css"
                    isPagination={false}
                    isSorting={false}
                    setSortBy={setSortBy}
                    sortBy={sortBy}
                    setSortOrder={setSortOrder}
                    sortOrder={sortOrder}
                  />
                  <Pagination
                    totalData={totalInfluencers}
                    setLimit={setLimit}
                    setPageCount={setPageCount}
                    limit={limit}
                    pageCount={pageCount}
                    currentPage={pageCount}
                  />
                </>
              ) : (
                <h1 className="text-center space-top">No Influencer Found</h1>
              )}
            </>
          )}
        </Container>
      </div>

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} toggle={toggleDetailsModal}>
        <ModalHeader toggle={toggleDetailsModal}>
          Influencer Details
        </ModalHeader>
        <ModalBody>
          {selectedInfluencer && (
            <div className="model-format">
              <strong>First Name</strong>
              <span>: {selectedInfluencer.firstName}</span>

              <strong>Last Name</strong>
              <span>: {selectedInfluencer.lastName}</span>

              <strong>Email</strong>
              <span>: {selectedInfluencer.email}</span>

              <strong>Phone Number</strong>
              <span>
                :{" "}
                {selectedInfluencer.phoneNumber
                  ? selectedInfluencer.phoneNumber
                  : "-"}
              </span>

              <strong>City</strong>
              <span>
                : {selectedInfluencer.city ? selectedInfluencer.city : "-"}
              </span>

              <strong>Country</strong>
              <span>
                :{" "}
                {selectedInfluencer.country ? selectedInfluencer.country : "-"}
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
      <Modal isOpen={isCreateModalOpen} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}>Add Influencer</ModalHeader>

        {submissionError && (
          <Alert color="danger" className="m-3">
            {formatErrorMessage(submissionError)}
          </Alert>
        )}
        <form onSubmit={createInfluncerValidation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="firstName" className="block mb-1">
                First Name:
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.firstName}
                invalid={
                  createInfluncerValidation.touched.firstName &&
                  createInfluncerValidation.errors.firstName
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.firstName &&
              createInfluncerValidation.errors.firstName ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.firstName}
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
                placeholder="Enter last name"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.lastName}
                invalid={
                  createInfluncerValidation.touched.lastName &&
                  createInfluncerValidation.errors.lastName
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.lastName &&
              createInfluncerValidation.errors.lastName ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.lastName}
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
                placeholder="Enter email address"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.email}
                invalid={
                  createInfluncerValidation.touched.email &&
                  createInfluncerValidation.errors.email
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.email &&
              createInfluncerValidation.errors.email ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.email}
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
                placeholder="Enter phone number"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.phoneNumber}
                invalid={
                  createInfluncerValidation.touched.phoneNumber &&
                  createInfluncerValidation.errors.phoneNumber
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.phoneNumber &&
              createInfluncerValidation.errors.phoneNumber ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.phoneNumber}
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
                placeholder="Enter city"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.city}
                invalid={
                  createInfluncerValidation.touched.city &&
                  createInfluncerValidation.errors.city
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.city &&
              createInfluncerValidation.errors.city ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.city}
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
                placeholder="Enter country"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.country}
                invalid={
                  createInfluncerValidation.touched.country &&
                  createInfluncerValidation.errors.country
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.country &&
              createInfluncerValidation.errors.country ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.country}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <Label htmlFor="platform" className="block mb-1">
                Platform:
              </Label>
              <select
                id="platform"
                name="platform"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.platform}
                className={`form-select ${
                  createInfluncerValidation.touched.platform &&
                  createInfluncerValidation.errors.platform
                    ? "is-invalid"
                    : ""
                }`}
              >
                <option value="">Select a platform</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Tiktok">Tiktok</option>
                <option value="YouTube">YouTube</option>
              </select>
              {createInfluncerValidation.touched.platform &&
              createInfluncerValidation.errors.platform ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.platform}
                </div>
              ) : null}
            </div>

            {/* Username */}
            <div className="mb-2">
              <Label htmlFor="username" className="block mb-1">
                Username:
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.username}
                invalid={
                  createInfluncerValidation.touched.username &&
                  createInfluncerValidation.errors.username
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.username &&
              createInfluncerValidation.errors.username ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.username}
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
        <form onSubmit={updateInfluncerValidation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="status" className="block mb-1">
                Status
              </Label>
              <Input
                name="status"
                type="select"
                onChange={updateInfluncerValidation.handleChange}
                onBlur={updateInfluncerValidation.handleBlur}
                value={updateInfluncerValidation.values.status}
                invalid={
                  updateInfluncerValidation.touched.status &&
                  updateInfluncerValidation.errors.status
                    ? true
                    : false
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </Input>
              {updateInfluncerValidation.touched.status &&
              updateInfluncerValidation.errors.status ? (
                <div className="invalid-feedback">
                  {updateInfluncerValidation.errors.status}
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

export default withTranslation()(InfluencerManagement);
