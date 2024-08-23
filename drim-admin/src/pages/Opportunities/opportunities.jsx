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

const Opportunity = (props) => {
  // State for managing opportunities
  const [opportunities, setOpportunities] = useState([
    { id: 1, title: "Brand Partnership", type: "Partnership" },
    { id: 2, title: "Social Media Campaign", type: "Campaign" },
    { id: 3, title: "Content Collaboration", type: "Collaboration" },
    { id: 4, title: "Product Launch", type: "Launch" },
    { id: 5, title: "Influencer Event", type: "Event" },
    { id: 6, title: "Giveaway Promotion", type: "Promotion" },
    { id: 7, title: "Affiliate Program", type: "Program" },
    { id: 8, title: "Brand Ambassador", type: "Ambassador" }
  ]);

  // State for modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Meta title
  document.title = "Opportunity | Drim - React Admin & Dashboard Template";

  // Toggle modals
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);

  // Handle view
  const handleViewOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    toggleViewModal();
  };

  // Handle update
  const handleUpdateOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    toggleUpdateModal();
  };

  // Handle delete
  const handleDeleteOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    toggleDeleteModal();
  };

  // Confirm opportunity update
  const confirmUpdateOpportunity = () => {
    if (selectedOpportunity.id) {
      const updatedOpportunities = opportunities.map((opp) =>
        opp.id === selectedOpportunity.id ? { ...opp, ...selectedOpportunity } : opp
      );
      setOpportunities(updatedOpportunities);
    } else {
      const newOpportunity = { id: opportunities.length + 1, ...selectedOpportunity };
      setOpportunities([...opportunities, newOpportunity]);
    }
    toggleUpdateModal();
  };

  // Confirm opportunity deletion
  const confirmDeleteOpportunity = () => {
    const updatedOpportunities = opportunities.filter((opp) => opp.id !== selectedOpportunity.id);
    setOpportunities(updatedOpportunities);
    toggleDeleteModal();
  };

  // Handle input change for update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOpportunity({ ...selectedOpportunity, [name]: value });
  };

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: "id",
        Cell: ({ cell: { value }, row: { index } }) => index + 1,
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Type",
        accessor: "type",
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
              onClick={() => handleViewOpportunity(original)}
            >
              <i className="bx bx-show" style={{ color: "blue" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleUpdateOpportunity(original)}
            >
              <i className="bx bx-edit" style={{ color: "orange" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleDeleteOpportunity(original)}
            >
              <i className="bx bx-trash" style={{ color: "red" }}></i>
            </Button>
          </>
        ),
      },
    ],
    [handleViewOpportunity, handleUpdateOpportunity, handleDeleteOpportunity]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Opportunity")}
            breadcrumbItem={props.t("Opportunity")}
          />

          {/* Button to Add New Opportunity */}
          <div className="d-flex justify-content-end mb-3">
            <Button
              color="primary"
              onClick={() =>
                handleUpdateOpportunity({
                  id: null,
                  title: "",
                  type: "",
                })
              }
            >
              Add Opportunity
            </Button>
          </div>

          {/* Opportunities Table */}
          <TableContainer
            columns={columns}
            data={opportunities}
            isGlobalFilter={false}
            isAddOptions={false}
            customPageSize={10}
            className="custom-header-css"
          />
        </Container>
      </div>

      {/* Update Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>
          {selectedOpportunity && selectedOpportunity.id
            ? "Update Opportunity"
            : "Add Opportunity"}
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            name="title"
            value={selectedOpportunity ? selectedOpportunity.title : ""}
            onChange={handleInputChange}
            placeholder="Enter opportunity title"
            className="mb-2"
          />
          <Input
            type="text"
            name="type"
            value={selectedOpportunity ? selectedOpportunity.type : ""}
            onChange={handleInputChange}
            placeholder="Enter opportunity type"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirmUpdateOpportunity}>
            Save
          </Button>
          <Button color="secondary" onClick={toggleUpdateModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>
          Delete Opportunity
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete the opportunity{" "}
          <strong>{selectedOpportunity ? selectedOpportunity.title : ""}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDeleteOpportunity}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} toggle={toggleViewModal}>
        <ModalHeader toggle={toggleViewModal}>Opportunity Details</ModalHeader>
        <ModalBody>
          {selectedOpportunity && (
            <>
              <p>
                <strong>Title:</strong> {selectedOpportunity.title}
              </p>
              <p>
                <strong>Type:</strong> {selectedOpportunity.type}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleViewModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default withTranslation()(Opportunity);
