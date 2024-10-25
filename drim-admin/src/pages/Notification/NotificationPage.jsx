import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import Pagination from "../../components/Common/Pagination";
import TableContainer from "../../components/Common/TableContainer";
import Chat from "../../components/Notification/Chat";
import ROLES from "../../constants/role";
import {
  createNotification,
  getNotification,
  updateNotification,
} from "../../store/notification/actions";
import '../../assets/themes/colors.scss';
const TicketPage = () => {
  document.title = "Tickets | Raise";
  const dispatch = useDispatch();
  const { notifications, error, loading, totalNotifications } = useSelector(
    (state) => state.notification
  );
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [role, setRole] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
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

  const handleOpenChat = (ticket) => {
    setSelectedTicket(ticket);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => setIsChatOpen(false);

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
      Header: "First Name",
      accessor: "from.firstName",
    },
    {
      Header: "Email",
      accessor: "from.email",
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
                <i className="bx bx-show" style={{ color: "var(--secondary-blue)" }}></i>
              </Button>
              <Button
                color="link"
                size="lg"
                className="p-0 me-2"
                onClick={() => handleEditTicket(original)}
              >
                <i className="bx bx-edit" style={{ color:"var(--secondary-yellow)" }}></i>
              </Button>
              {/* <Button
                color="link"
                size="lg"
                className="p-0"
                onClick={() => handleDeleteTicket(original)}
              >
                <i className="bx bx-trash" style={{ color: "red" }}></i>
              </Button> */}
              <Button
                color="link"
                size="lg"
                className="p-0"
                onClick={() => handleOpenChat(original)}
              >
                <i className="bx bx-message" style={{ color: "var(--primary-purple)" }}></i>
              </Button>
            </>
          )}
          {role === ROLES.BRAND || role === ROLES.INFLUENCER ? (
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
                className="p-0"
                onClick={() => handleOpenChat(original)}
              >
                <i className="bx bx-message" style={{ color: "blue" }}></i>
              </Button>
            </>
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
              {/* notifications Table */}
              {notifications.length ? (
                <>
                  <TableContainer
                    columns={columns}
                    data={notifications}
                    isGlobalFilter={true}
                    isAddOptions={false}
                    customPageSize={10}
                    className="custom-header-css"
                    isPagination={false}
                  />
                  <Pagination
                    totalData={totalNotifications}
                    limit={limit}
                    pageCount={pageCount}
                    setLimit={setLimit}
                    setPageCount={setPageCount}
                    currentPage={pageCount}
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
          <Button style={{ backgroundColor: "var(--primary-purple)", color: "var(--primary-white)" }} onClick={handleSaveEdit}>
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

      {isChatOpen && <Chat ticket={selectedTicket} onClose={handleCloseChat} />}
    </React.Fragment>
  );
};

export default TicketPage;
