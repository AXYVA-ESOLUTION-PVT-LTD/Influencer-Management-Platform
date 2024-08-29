import * as Yup from "yup";
import React, { useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer"; // Adjust import path if necessary
import { addNewInfluencer } from "../../store/influencers/actions";
import { addNewClient } from "../../store/client/actions";
import { useFormik } from "formik";

const Client = (props) => {
  const dispatch = useDispatch();

  // State for managing influencers
  const [clients, setClients] = useState([
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@example.com",
    },
  ]);

  // State for modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Meta title
  document.title = "Influencer | Drim - React Admin & Dashboard Template";

  // Toggle modals
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleDetailsModal = () => setIsDetailsModalOpen(!isDetailsModalOpen);

  // Handle update
  const handleUpdateClient = (client) => {
    setSelectedClient(client);
    toggleUpdateModal();
  };

  // Handle delete
  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    toggleDeleteModal();
  };

  // Handle view details
  const handleViewDetails = (client) => {
    setSelectedClient(client);
    toggleDetailsModal();
  };

  // Confirm influencer update
  const confirmUpdateClient = () => {
    if (selectedClient.id) {
      // update client
    } else {
      dispatch(addNewClient(selectedClient));
    }
    toggleUpdateModal();
  };

  // Confirm influencer deletion
  const confirmDeleteClient = () => {
    const updatedInfluencers = clients.filter(
      (inf) => inf.id !== selectedClient.id
    );
    setInfluencers(updatedInfluencers);
    toggleDeleteModal();
  };

  // Handle input change for update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedClient({ ...selectedClient, [name]: value });
  };

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: "id",
        Cell: ({ cell: { value }, row: { index } }) => index + 1,
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
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleDeleteClient(original)}
            >
              <i className="bx bx-trash" style={{ color: "red" }}></i>
            </Button>
          </>
        ),
      },
    ],
    [handleUpdateClient, handleDeleteClient, handleViewDetails]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: selectedClient ? selectedClient.firstName : "",
      lastName: selectedClient ? selectedClient.lastName : "",
      email: selectedClient ? selectedClient.email : "",
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
      };
      if (selectedClient && selectedClient.id) {
        // Update  client
      } else {
        // Add new client
        dispatch(addNewClient(payload));
      }
      resetForm();
      toggleUpdateModal();
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Button to Add New Client */}
          <div className="d-flex justify-content-end mb-3">
            <Button
              color="primary"
              onClick={() =>
                handleUpdateClient({
                  firstName: "",
                  lastName: "",
                  email: "",
                })
              }
            >
              Add Client
            </Button>
          </div>

          {/* Client Table */}
          <TableContainer
            columns={columns}
            data={clients}
            isGlobalFilter={false} // Assuming you don't need global filtering here
            isAddOptions={false}
            customPageSize={10}
            className="custom-header-css"
          />
        </Container>
      </div>

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} toggle={toggleDetailsModal}>
        <ModalHeader toggle={toggleDetailsModal}>Clients Details</ModalHeader>
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

      {/* Update Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>
          {selectedClient && selectedClient.id ? "Update Client" : "Add Client"}
        </ModalHeader>
        <form onSubmit={validation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="firstName" className="block mb-1">
                First Name:
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.firstName}
                invalid={
                  validation.touched.firstName && validation.errors.firstName
                    ? true
                    : false
                }
              />
              {validation.touched.firstName && validation.errors.firstName ? (
                <div className="invalid-feedback">
                  {validation.errors.firstName}
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
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.lastName}
                invalid={
                  validation.touched.lastName && validation.errors.lastName
                    ? true
                    : false
                }
              />
              {validation.touched.lastName && validation.errors.lastName ? (
                <div className="invalid-feedback">
                  {validation.errors.lastName}
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
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.email}
                invalid={
                  validation.touched.email && validation.errors.email
                    ? true
                    : false
                }
              />
              {validation.touched.email && validation.errors.email ? (
                <div className="invalid-feedback">
                  {validation.errors.email}
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete Client</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the Client{" "}
          <strong>
            {selectedClient
              ? `${selectedClient.firstName} ${selectedClient.lastName}`
              : ""}
          </strong>
          ?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDeleteClient}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default withTranslation()(Client);
