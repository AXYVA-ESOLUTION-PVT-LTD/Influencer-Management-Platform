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
} from "reactstrap";
import * as Yup from "yup";
import TableContainer from "../../components/Common/TableContainer"; // Adjust import path if necessary
import ROLES from "../../constants/role";
import {
  addNewClient,
  getClient,
  updateClient,
} from "../../store/client/actions";
import Pagination from "../../components/Common/Pagination";
import ClientFiltering from "../../components/Common/ClientFiltering";

const ClientManagement = (props) => {
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Meta title
  document.title = "Influencer | Drim - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const { clients, loading, error, totalClients } = useSelector(
    (state) => state.client
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

  const createClientValidation = useFormik({
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
        roleName: ROLES.CLIENT,
      };
      dispatch(addNewClient(payload));
      resetForm();
      toggleCreateModal();
    },
  });
  const updateClientValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: "Active",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        id: selectedClient._id,
        status: values.status === "Inactive" ? false : true,
        roleName: ROLES.CLIENT,
      };
      dispatch(updateClient(payload));
      resetForm();
      toggleUpdateModal();
    },
  });

  // Get Influencer when Mount
  useEffect(() => {
    dispatch(
      getClient({
        roleName: ROLES.CLIENT,
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
  const handleUpdateClient = (client) => {
    setSelectedClient(client);
    toggleUpdateModal();
  };

  // Handle view details
  const handleViewDetails = (client) => {
    setSelectedClient(client);
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
              onClick={() => handleUpdateClient(original)}
            >
              <i className="bx bx-edit" style={{ color: "orange" }}></i>
            </Button>
          </>
        ),
      },
    ],
    [handleUpdateClient, handleViewDetails]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Button to Add New Influencer */}
          <div className="d-flex justify-content-end mb-3">
            <Button color="primary" onClick={toggleCreateModal}>
              Add Client
            </Button>
          </div>

          <ClientFiltering
            filterFields={filterFields}
            setFilterFields={setFilterFields}
            setIsSearching={setIsSearching}
          />

          {/* Client Table */}
          {clients.length ? (
            <TableContainer
              columns={columns}
              data={clients}
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
          ) : (
            <h1 className="text-center" style={{ marginTop: 50 }}>
              No Client Found
            </h1>
          )}

          {clients.length ? (
            <Pagination
              totalData={totalClients}
              setLimit={setLimit}
              setPageCount={setPageCount}
              limit={limit}
              pageCount={pageCount}
              currentPage={pageCount}
            />
          ) : null}
        </Container>
      </div>

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} toggle={toggleDetailsModal}>
        <ModalHeader toggle={toggleDetailsModal}>Client Details</ModalHeader>
        <ModalBody>
          {selectedClient && (
            <>
              <p>
                <strong>First Name:</strong> {selectedClient.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedClient.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedClient.email}
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
        <ModalHeader toggle={toggleCreateModal}>Add Client</ModalHeader>
        <form onSubmit={createClientValidation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="firstName" className="block mb-1">
                First Name:
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                onChange={createClientValidation.handleChange}
                onBlur={createClientValidation.handleBlur}
                value={createClientValidation.values.firstName}
                invalid={
                  createClientValidation.touched.firstName &&
                  createClientValidation.errors.firstName
                    ? true
                    : false
                }
              />
              {createClientValidation.touched.firstName &&
              createClientValidation.errors.firstName ? (
                <div className="invalid-feedback">
                  {createClientValidation.errors.firstName}
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
                onChange={createClientValidation.handleChange}
                onBlur={createClientValidation.handleBlur}
                value={createClientValidation.values.lastName}
                invalid={
                  createClientValidation.touched.lastName &&
                  createClientValidation.errors.lastName
                    ? true
                    : false
                }
              />
              {createClientValidation.touched.lastName &&
              createClientValidation.errors.lastName ? (
                <div className="invalid-feedback">
                  {createClientValidation.errors.lastName}
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
                onChange={createClientValidation.handleChange}
                onBlur={createClientValidation.handleBlur}
                value={createClientValidation.values.email}
                invalid={
                  createClientValidation.touched.email &&
                  createClientValidation.errors.email
                    ? true
                    : false
                }
              />
              {createClientValidation.touched.email &&
              createClientValidation.errors.email ? (
                <div className="invalid-feedback">
                  {createClientValidation.errors.email}
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
        <ModalHeader toggle={toggleUpdateModal}>Update Client</ModalHeader>
        <form onSubmit={updateClientValidation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="status" className="block mb-1">
                Status
              </Label>
              <Input
                name="status"
                type="select"
                onChange={updateClientValidation.handleChange}
                onBlur={updateClientValidation.handleBlur}
                value={updateClientValidation.values.status}
                invalid={
                  updateClientValidation.touched.status &&
                  updateClientValidation.errors.status
                    ? true
                    : false
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </Input>
              {updateClientValidation.touched.status &&
              updateClientValidation.errors.status ? (
                <div className="invalid-feedback">
                  {updateClientValidation.errors.status}
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

export default withTranslation()(ClientManagement);
