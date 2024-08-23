import React, { useState, useMemo } from "react";
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer"; // Adjust import path if necessary

const Influencer = (props) => {
  // State for managing influencers
  const [influencers, setInfluencers] = useState([
    { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com" },
    { id: 3, firstName: "Alice", lastName: "Johnson", email: "alice.johnson@example.com" },
  ]);

  // State for modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  // Meta title
  document.title = "Influencer | Drim - React Admin & Dashboard Template";

  // Toggle modals
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleDetailsModal = () => setIsDetailsModalOpen(!isDetailsModalOpen);

  // Handle update
  const handleUpdateInfluencer = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleUpdateModal();
  };

  // Handle delete
  const handleDeleteInfluencer = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleDeleteModal();
  };

  // Handle view details
  const handleViewDetails = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleDetailsModal();
  };

  // Confirm influencer update
  const confirmUpdateInfluencer = () => {
    if (selectedInfluencer.id) {
      const updatedInfluencers = influencers.map((inf) =>
        inf.id === selectedInfluencer.id ? { ...inf, ...selectedInfluencer } : inf
      );
      setInfluencers(updatedInfluencers);
    } else {
      const newInfluencer = { id: influencers.length + 1, ...selectedInfluencer };
      setInfluencers([...influencers, newInfluencer]);
    }
    toggleUpdateModal();
  };

  // Confirm influencer deletion
  const confirmDeleteInfluencer = () => {
    const updatedInfluencers = influencers.filter((inf) => inf.id !== selectedInfluencer.id);
    setInfluencers(updatedInfluencers);
    toggleDeleteModal();
  };

  // Handle input change for update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInfluencer({ ...selectedInfluencer, [name]: value });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'No.',
        accessor: 'id',
        Cell: ({ cell: { value }, row: { index } }) => index + 1,
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
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
              onClick={() => handleUpdateInfluencer(original)}
            >
              <i className="bx bx-edit" style={{ color: "orange" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleDeleteInfluencer(original)}
            >
              <i className="bx bx-trash" style={{ color: "red" }}></i>
            </Button>
          </>
        ),
      },
    ],
    [handleUpdateInfluencer, handleDeleteInfluencer, handleViewDetails]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Influencer")}
            breadcrumbItem={props.t("Influencer")}
          />

          {/* Button to Add New Influencer */}
          <div className="d-flex justify-content-end mb-3">
            <Button color="primary" onClick={() => handleUpdateInfluencer({ id: null, firstName: "", lastName: "", email: "" })}>
              Add Influencer
            </Button>
          </div>

          {/* Influencers Table */}
          <TableContainer
            columns={columns}
            data={influencers}
            isGlobalFilter={false} // Assuming you don't need global filtering here
            isAddOptions={false}
            customPageSize={10}
            className="custom-header-css"
          />
        </Container>
      </div>

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} toggle={toggleDetailsModal}>
        <ModalHeader toggle={toggleDetailsModal}>Influencer Details</ModalHeader>
        <ModalBody>
          {selectedInfluencer && (
            <>
              <p><strong>First Name:</strong> {selectedInfluencer.firstName}</p>
              <p><strong>Last Name:</strong> {selectedInfluencer.lastName}</p>
              <p><strong>Email:</strong> {selectedInfluencer.email}</p>
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
          {selectedInfluencer && selectedInfluencer.id ? "Update Influencer" : "Add Influencer"}
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            name="firstName"
            value={selectedInfluencer ? selectedInfluencer.firstName : ""}
            onChange={handleInputChange}
            placeholder="Enter first name"
            className="mb-2"
          />
          <Input
            type="text"
            name="lastName"
            value={selectedInfluencer ? selectedInfluencer.lastName : ""}
            onChange={handleInputChange}
            placeholder="Enter last name"
            className="mb-2"
          />
          <Input
            type="email"
            name="email"
            value={selectedInfluencer ? selectedInfluencer.email : ""}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirmUpdateInfluencer}>
            Save
          </Button>
          <Button color="secondary" onClick={toggleUpdateModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete Influencer</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the influencer{" "}
          <strong>{selectedInfluencer ? `${selectedInfluencer.firstName} ${selectedInfluencer.lastName}` : ""}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDeleteInfluencer}>
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

export default withTranslation()(Influencer);
