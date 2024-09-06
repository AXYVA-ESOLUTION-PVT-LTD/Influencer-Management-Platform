import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
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
import TableContainer from "../../components/Common/TableContainer"; // Adjust import path if necessary
import ROLES from "../../constants/role";
import { addNewBrand, getBrand, updateBrand } from "../../store/brand/actions";

const BrandManagement = (props) => {
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Meta title
  document.title = "Brand | Raise ";

  const dispatch = useDispatch();

  const { brands, loading, error, totalBrands } = useSelector(
    (state) => state.brand
  );

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

  const createBrandValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        roleName: ROLES.BRAND,
      };
      dispatch(addNewBrand(payload));
      resetForm();
      toggleCreateModal();
    },
  });
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
      })
    );
  }, [dispatch, limit, pageCount, isSearching, sortOrder, sortBy]);

  // Toggle modals
  const toggleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };
  const toggleCreateModal = () => {
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
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span style={{ color: value ? "green" : "red" }}>
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
              <i className="bx bx-show" style={{ color: "blue" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleUpdateBrand(original)}
            >
              <i className="bx bx-edit" style={{ color: "orange" }}></i>
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
          <div className="d-flex justify-content-end mb-3">
            <Button color="primary" onClick={toggleCreateModal}>
              Add Brand
            </Button>
          </div>

          <BrandFiltering
            filterFields={filterFields}
            setFilterFields={setFilterFields}
            setIsSearching={setIsSearching}
          />

          {loading ? (
            <div className="text-center" style={{ marginTop: 50 }}>
              <Spinner color="primary" />
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
                <h1 className="text-center" style={{ marginTop: 50 }}>
                  No Brand Found
                </h1>
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
            <>
              <p>
                <strong>First Name:</strong> {selectedBrand.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedBrand.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedBrand.email}
              </p>
            </>
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
        <ModalHeader toggle={toggleCreateModal}>Add Brand</ModalHeader>
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
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Save
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
            <Button color="primary" type="submit">
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
