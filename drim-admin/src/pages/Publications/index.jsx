import React, { useMemo, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";

// Import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";

function Publications() {
  // State for managing data
  const [data, setData] = useState([
    { id: 1, firstName: "Jennifer", lastName: "Chang", email: "jennifer.chang@example.com" },
    { id: 2, firstName: "Gavin", lastName: "Joyce", email: "gavin.joyce@example.com" },
    { id: 3, firstName: "Angelica", lastName: "Ramos", email: "angelica.ramos@example.com" },
    { id: 4, firstName: "Doris", lastName: "Wilder", email: "doris.wilder@example.com" },
    { id: 5, firstName: "Caesar", lastName: "Vance", email: "caesar.vance@example.com" },
    // Add more data as needed
  ]);

  // State for modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Meta title
  document.title = "Publications | Drim - Vite React Admin & Dashboard Template";

  // Toggle modals
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);

  // Handle update
  const handleUpdateRecord = (record) => {
    setSelectedRecord(record);
    toggleUpdateModal();
  };

  // Handle delete
  const handleDeleteRecord = (record) => {
    setSelectedRecord(record);
    toggleDeleteModal();
  };

  // Confirm record update
  const confirmUpdateRecord = () => {
    if (selectedRecord.id) {
      const updatedData = data.map((item) =>
        item.id === selectedRecord.id ? { ...item, ...selectedRecord } : item
      );
      setData(updatedData);
    } else {
      const newRecord = { id: data.length + 1, ...selectedRecord };
      setData([...data, newRecord]);
    }
    toggleUpdateModal();
  };

  // Confirm record deletion
  const confirmDeleteRecord = () => {
    const updatedData = data.filter((item) => item.id !== selectedRecord.id);
    setData(updatedData);
    toggleDeleteModal();
  };

  // Handle input change for update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecord({ ...selectedRecord, [name]: value });
  };

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "First Name", accessor: "firstName" },
      { Header: "Last Name", accessor: "lastName" },
      { Header: "Email", accessor: "email" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => {
                setSelectedRecord(row.original);
                toggleViewModal();
              }}
            >
              <i className="bx bx-show" style={{ color: "blue" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleUpdateRecord(row.original)}
            >
              <i className="bx bx-edit" style={{ color: "orange" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleDeleteRecord(row.original)}
            >
              <i className="bx bx-trash" style={{ color: "red" }}></i>
            </Button>
          </>
        ),
      },
    ],
    [data]
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Publications" breadcrumbItem="Publications" />
        <div className="d-flex justify-content-end mb-3">
          <Button
            color="primary"
            onClick={() =>
              handleUpdateRecord({
                id: null,
                firstName: "",
                lastName: "",
                email: "",
              })
            }
          >
            Add Publication
          </Button>
        </div>
        <TableContainer
          columns={columns}
          data={data}
          isGlobalFilter={true}
          isAddOptions={false}
          customPageSize={10}
          className="custom-header-css"
        />

        {/* Update Modal */}
        <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
          <ModalHeader toggle={toggleUpdateModal}>Update Record</ModalHeader>
          <ModalBody>
            <Input
              name="firstName"
              value={selectedRecord?.firstName || ""}
              onChange={handleInputChange}
              placeholder="First Name"
              className="mb-3"
            />
            <Input
              name="lastName"
              value={selectedRecord?.lastName || ""}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="mb-3"
            />
            <Input
              name="email"
              value={selectedRecord?.email || ""}
              onChange={handleInputChange}
              placeholder="Email"
              className="mb-3"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={confirmUpdateRecord}>
              Save
            </Button>
            <Button color="secondary" onClick={toggleUpdateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
          <ModalHeader toggle={toggleDeleteModal}>Delete Record</ModalHeader>
          <ModalBody>Are you sure you want to delete this record?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={confirmDeleteRecord}>
              Delete
            </Button>
            <Button color="secondary" onClick={toggleDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* View Modal */}
        <Modal isOpen={isViewModalOpen} toggle={toggleViewModal}>
          <ModalHeader toggle={toggleViewModal}>View Record</ModalHeader>
          <ModalBody>
            <p>
              <strong>ID:</strong> {selectedRecord?.id}
            </p>
            <p>
              <strong>First Name:</strong> {selectedRecord?.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedRecord?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedRecord?.email}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleViewModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default Publications;
