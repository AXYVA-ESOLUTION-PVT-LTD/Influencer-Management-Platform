import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { data } from "../../data/notification";
import { useDispatch, useSelector } from "react-redux";
import {
  createNotification,
  getNotification,
  updateNotification,
} from "../../store/notification/actions";
import useLocalStorage from "../../hooks/useLocalStorage";

const TicketPage = () => {
  document.title = "Tickets | Raise";
  const dispatch = useDispatch();
  const { notifications, error, loading } = useSelector(
    (state) => state.notification
  );

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [role, setRole] = useState("");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
    };

    let isValid = true;

    if (newTicket.title.trim() === "") {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (newTicket.description.trim() === "") {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("user"));
    setRole(data.roleId.name);
  }, []);

  const columns = [
    {
      Header: "Time",
      accessor: "createdAt",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row: { original } }) => (
        <>
          {role === "Admin" && (
            <>
              <Button
                color="link"
                size="lg"
                className="p-0 me-2"
                onClick={() => handleViewTicket(original)}
              >
                <i className="bx bx-show" style={{ color: "blue" }}></i>
              </Button>
              <Button
                color="link"
                size="lg"
                className="p-0 me-2"
                onClick={() => handleEditTicket(original)}
              >
                <i className="bx bx-edit" style={{ color: "orange" }}></i>
              </Button>
              <Button
                color="link"
                size="lg"
                className="p-0"
                onClick={() => handleDeleteTicket(original)}
              >
                <i className="bx bx-trash" style={{ color: "red" }}></i>
              </Button>
            </>
          )}
          {role === "Client" || role === "Influencer" ? (
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleViewTicket(original)}
            >
              <i className="bx bx-show" style={{ color: "blue" }}></i>
            </Button>
          ) : null}
        </>
      ),
    },
  ];

  const handleViewTicket = (ticket) => {
    setCurrentTicket(ticket);
    setViewModal(true);
  };

  const handleEditTicket = (ticket) => {
    setCurrentTicket(ticket);
    setEditModal(true);
  };

  const handleDeleteTicket = (ticket) => {
    setCurrentTicket(ticket);
    setDeleteModal(true);
  };

  const handleCloseViewModal = () => setViewModal(false);
  const handleCloseEditModal = () => setEditModal(false);
  const handleCloseDeleteModal = () => setDeleteModal(false);
  const handleCloseCreateModal = () => setCreateModal(false);

  const handleDelete = () => {
    // // Add your delete logic here
    // console.log("Deleting ticket", currentTicket);
    handleCloseDeleteModal();
  };

  const handleSaveEdit = () => {
    dispatch(
      updateNotification({
        id: currentTicket._id,
        status: currentTicket.status,
      })
    );
    handleCloseEditModal();
  };

  const handleCreate = () => {
    if (validateForm()) {
      dispatch(createNotification(newTicket));
      setNewTicket({
        title: "",
        description: "",
      });
      handleCloseCreateModal();
    }
  };

  useEffect(() => {
    dispatch(getNotification());
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Notification" breadcrumbItem="Notification" />
          {role === "Influencer" && (
            <div className="d-flex justify-content-end mb-3">
              <Button color="primary" onClick={() => setCreateModal(true)}>
                Create Ticket
              </Button>
            </div>
          )}

          {loading ? (
            <div className="text-center" style={{ marginTop: 50 }}>
              <Spinner color="primary" />
            </div>
          ) : (
            <>
              {/* Client Table */}
              {notifications.length ? (
                <>
                  <TableContainer
                    columns={columns}
                    data={notifications}
                    isGlobalFilter={true}
                    isAddOptions={false}
                    customPageSize={10}
                    className="custom-header-css"
                    isPagination={true}
                  />
                </>
              ) : (
                <h1 className="text-center" style={{ marginTop: 50 }}>
                  No Notification Found
                </h1>
              )}
            </>
          )}
        </Container>
      </div>

      {/* View Modal */}
      <Modal isOpen={viewModal} toggle={handleCloseViewModal}>
        <ModalHeader toggle={handleCloseViewModal}>View Ticket</ModalHeader>
        <ModalBody>
          <p>
            <strong>Time:</strong> {currentTicket?.createdAt}
          </p>
          <p>
            <strong>Title:</strong> {currentTicket?.title}
          </p>
          <p>
            <strong>Description:</strong> {currentTicket?.description}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={handleCloseEditModal}>
        <ModalHeader toggle={handleCloseEditModal}>Edit Ticket</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="editStatus">Status</Label>
              <Input
                type="select"
                id="editStatus"
                value={currentTicket?.status || ""}
                onChange={(e) =>
                  setCurrentTicket({ ...currentTicket, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="read">Read</option>
                <option value="completed">Completed</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveEdit}>
            Save
          </Button>
          <Button color="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} toggle={handleCloseDeleteModal}>
        <ModalHeader toggle={handleCloseDeleteModal}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>Are you sure you want to delete this ticket?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create Modal */}
      <Modal isOpen={createModal} toggle={handleCloseCreateModal}>
        <ModalHeader toggle={handleCloseCreateModal}>Create Ticket</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="newTitle">Title</Label>
              <Input
                type="text"
                id="newTitle"
                value={newTicket.title}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, title: e.target.value })
                }
              />
              {errors.title && (
                <div className="text-danger">{errors.title}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="newDescription">Description</Label>
              <Input
                type="textarea"
                id="newDescription"
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
              />
              {errors.description && (
                <div className="text-danger">{errors.description}</div>
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCreate}>
            Create
          </Button>
          <Button color="secondary" onClick={handleCloseCreateModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default TicketPage;
