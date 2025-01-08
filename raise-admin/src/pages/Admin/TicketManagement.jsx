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
  Nav,
  NavItem,
  NavLink,
  Spinner,
  TabContent,
  TabPane,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import Pagination from "../../components/Common/Pagination";
import TableContainer from "../../components/Common/TableContainer";
import Chat from "../../components/Notification/Chat";
import ROLES from "../../constants/role";
import {
  createTicketNotification,
  getTicketNotification,
  updateTicketNotification,
} from "../../store/notification/actions";
import "../../assets/themes/colors.scss";
import TicketFiltering from "../../components/Common/TicketFiltering";
import classnames from "classnames";
import { getTransaction, updateTransaction } from "../../store/actions";

const TicketManagement = () => {
  document.title = "Tickets | Brandraise";
  const dispatch = useDispatch();
  const { notifications, error, loading, totalNotifications } = useSelector(
    (state) => state.Notification
  );
  const {
    transaction,
    loading: transactionLoading,
    walletAmount,
    totalTransactions,
  } = useSelector((state) => state.Payment);

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
  const [newLimit, setNewLimit] = useState(10);
  const [newPageCount, setNewPageCount] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isTransactionChatOpen, setIsTransactionChatOpen] = useState(false);
  const [editTransactionModal, setEditTransactionModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    transactionId: false,
    status: false,
  });

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
  });
  const [filterFields, setFilterFields] = useState({
    title: "",
    name: "",
    email: "",
    status: "",
  });
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

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
      Cell: ({ value }) => (
        <span
          className={`ticket-badge ticket-badge-${value
            .replace(" ", "-")
            .toLowerCase()}`}
        >
          {value}
        </span>
      ),
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
                <i
                  className="bx bx-show"
                  style={{ color: "var(--secondary-blue)" }}
                ></i>
              </Button>
              <Button
                color="link"
                size="lg"
                className="p-0 me-2"
                onClick={() => handleEditTicket(original)}
              >
                <i
                  className="bx bx-edit"
                  style={{ color: "var(--secondary-yellow)" }}
                ></i>
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
                <i
                  className="bx bx-message"
                  style={{ color: "var(--primary-purple)" }}
                ></i>
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
                <i
                  className="bx bx-show"
                  style={{ color: "var(--primary-purple)" }}
                ></i>
              </Button>
              <Button
                color="link"
                size="lg"
                className="p-0"
                onClick={() => handleOpenChat(original)}
              >
                <i
                  className="bx bx-message"
                  style={{ color: "var(--primary-purple)" }}
                ></i>
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
    handleCloseDeleteModal();
  };

  const handleSaveEdit = () => {
    dispatch(
      updateTicketNotification({
        id: currentTicket._id,
        status: currentTicket.status,
      })
    );
    handleCloseEditModal();
  };

  const handleCreate = () => {
    if (validateForm()) {
      dispatch(createTicketNotification(newTicket));
      setNewTicket({
        title: "",
        description: "",
      });
      handleCloseCreateModal();
    }
  };

  useEffect(() => {
    if (activeTab === "1") {
      dispatch(getTicketNotification({ limit, pageCount, ...filterFields }));
    }
  }, [dispatch, limit, pageCount, isSearching, activeTab]);

  const handleTransactionOpenChat = (transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionChatOpen(true);
  };

  const handleTransactionCloseChat = () => setIsTransactionChatOpen(false);

  const Transactioncolumns = () =>
    [
      {
        Header: "Transaction ID",
        accessor: (row) => row.transactionId || "-",
      },
      {
        Header: "Name",
        accessor: "influencerId.firstName",
        Cell: ({ value, row }) =>
          `${value} ${row.original.influencerId.lastName}`,
      },
      {
        Header: "Username",
        accessor: "influencerId.username",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => value.toFixed(2),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`ticket-badge ${
              value === "Pending"
                ? "ticket-badge-pending"
                : value === "Approved"
                ? "ticket-badge-approved"
                : "ticket-badge-declined"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row: { original } }) => {
          const isApproved = original.status == "Approved";
          return (
            <>
              <Button
                color="link"
                size="lg"
                className="p-0 me-2"
                onClick={() => handleEditTransaction(original)}
                disabled={isApproved}
              >
                <i
                  className="bx bx-edit"
                  style={{ color: "var(--secondary-yellow)" }}
                ></i>
              </Button>
              <Button
                color="link"
                size="lg"
                className="p-0"
                onClick={() => handleTransactionOpenChat(original)}
                disabled={isApproved}
              >
                <i
                  className="bx bx-message"
                  style={{ color: "var(--primary-purple)" }}
                ></i>
              </Button>
            </>
          );
        },
      },
    ].filter(Boolean);

  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setEditTransactionModal(true);
  };

  const handleTransactionSaveEdit = () => {
    const payload = {
      id: currentTransaction._id,
      transactionId: currentTransaction.transactionId,
      status: currentTransaction.status,
    };
    // Update transaction
    dispatch(updateTransaction(payload));
    // get Transaction
    dispatch(
      getTransaction({
        limit: newLimit,
        pageCount: newPageCount,
      })
    );

    setIsFormSubmitted(false);
    setValidationErrors({ transactionId: false, status: false });
    handleCloseEditTransactionModal();
  };

  const handleCloseEditTransactionModal = () => setEditTransactionModal(false);

  useEffect(() => {
    if (activeTab === "2") {
      dispatch(
        getTransaction({
          limit: newLimit,
          pageCount: newPageCount,
        })
      );
    }
  }, [dispatch, newLimit, newPageCount, activeTab]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="Ticket Management"
            breadcrumbItem="Ticket Management"
          />
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => {
                  toggle("1");
                }}
              >
                Ticket Management
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => {
                  toggle("2");
                }}
              >
                Transaction Management
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1" className="mt-3">
              <TicketFiltering
                setFilterFields={setFilterFields}
                filterFields={filterFields}
                setIsSearching={setIsSearching}
              />
              {loading ? (
                <div className="text-center space-top">
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
                    <h1 className="text-center space-top">No Ticket Found</h1>
                  )}
                </>
              )}
            </TabPane>
            <TabPane tabId="2" className="mt-3">
              {transactionLoading ? (
                <div className="text-center space-top mt-4">
                  <Spinner color="primary" />
                </div>
              ) : (
                <>
                  {transaction.length ? (
                    <>
                      <TableContainer
                        columns={Transactioncolumns()}
                        data={transaction}
                        isGlobalFilter={true}
                        isAddOptions={false}
                        customPageSize={10}
                        className="custom-header-css"
                        isPagination={false}
                      />
                      <Pagination
                        totalData={totalTransactions}
                        setLimit={setNewLimit}
                        setPageCount={setNewPageCount}
                        limit={newLimit}
                        pageCount={newPageCount}
                        currentPage={newPageCount}
                      />
                    </>
                  ) : (
                    <h1 className="text-center space-top">
                      No Transaction Found
                    </h1>
                  )}
                </>
              )}
            </TabPane>
          </TabContent>
        </Container>
      </div>

      {/* View Modal */}
      <Modal isOpen={viewModal} toggle={handleCloseViewModal}>
        <ModalHeader toggle={handleCloseViewModal}>View Ticket</ModalHeader>
        <ModalBody>
          <div className="model-format">
            <strong>Time</strong>
            <span>: {currentTicket?.createdAt}</span>

            <strong>Title</strong>
            <span>: {currentTicket?.title}</span>

            <strong>Description</strong>
            <span>: {currentTicket?.description}</span>
          </div>
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
                <option value="On Hold">On Hold</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "var(--primary-purple)",
              color: "var(--primary-white)",
            }}
            onClick={handleSaveEdit}
          >
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

      {isChatOpen && (
        <Chat type="Ticket" ticket={selectedTicket} onClose={handleCloseChat} />
      )}

      {isTransactionChatOpen && (
        <Chat
          type="Transaction"
          ticket={selectedTransaction}
          onClose={handleTransactionCloseChat}
        />
      )}

      {/* Edit Transaction Modal */}
      <Modal
        isOpen={editTransactionModal}
        toggle={handleCloseEditTransactionModal}
      >
        <ModalHeader toggle={handleCloseEditTransactionModal}>
          Edit Transaction
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="editTransactionId">Transaction ID</Label>
              <Input
                type="text"
                id="editTransactionId"
                value={currentTransaction?.transactionId || ""}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    transactionId: e.target.value,
                  })
                }
                placeholder="Enter transaction ID"
                invalid={!currentTransaction?.transactionId}
              />
              {isFormSubmitted && validationErrors.transactionId && (
                <div className="text-danger mt-1">
                  Transaction ID is required.
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="editStatus">Status</Label>
              <Input
                type="select"
                id="editStatus"
                value={currentTransaction?.status}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    status: e.target.value,
                  })
                }
                invalid={!currentTransaction?.status}
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Declined">Declined</option>
                <option value="Approved">Approved</option>
              </Input>
              {!currentTransaction?.status && (
                <div className="text-danger">Status is required.</div>
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "var(--primary-purple)",
              color: "var(--primary-white)",
            }}
            onClick={() => {
              const errors = {
                transactionId: !currentTransaction?.transactionId?.trim(),
                status: !currentTransaction?.status,
              };
              setIsFormSubmitted(true);
              setValidationErrors(errors);

              // If there are no errors, proceed
              if (!errors.transactionId && !errors.status) {
                handleTransactionSaveEdit();
              }
            }}
          >
            Save
          </Button>
          <Button color="secondary" onClick={handleCloseEditTransactionModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default TicketManagement;
