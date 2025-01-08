import React, { useEffect, useState } from "react";
import {
  Alert,
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
  Row,
  Spinner,
} from "reactstrap";
import Pagination from "../../components/Common/Pagination";
import TableContainer from "../../components/Common/TableContainer";
import "../../assets/themes/colors.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  createTransaction,
  getTransaction,
  getWalletAmount,
  removeTransactionById,
  createNotification,
} from "../../store/actions";
import Chat from "../../components/Notification/Chat";
import { useNavigate } from "react-router-dom";

const InfluencersPayment = () => {
  document.title = "Wallet | Brandraise";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transaction, loading, walletAmount, totalTransactions } = useSelector(
    (state) => state.Payment
  );

  const [role, setRole] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const isBankVerified = user?.isBankVerified;

  const toggleModal = () => {
    if (!isBankVerified) {
      setShowAlert(true);
      return;
    }
    setIsModalOpen(!isModalOpen);
    setWithdrawAmount("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleWithdrawSubmit = () => {
    if (parseFloat(withdrawAmount) > walletAmount) {
      setErrorMessage("Amount cannot be greater than wallet balance!");
      setSuccessMessage("");
    } else if (withdrawAmount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      setSuccessMessage("");
    } else {
      setSuccessMessage(`Withdrawal of $${withdrawAmount} successful!`);
      setErrorMessage("");

      const transactionData = {
        amount: withdrawAmount,
        type: "withdraw",
      };

      // Create Transaction
      dispatch(createTransaction(transactionData));

      // Get user Details
      let data = JSON.parse(localStorage.getItem("user"));
      // userId: "6719f9714d317f459da508d7", //server
      const newNotification = {
        userId: "67334a52373c3328068f9157", //local server
        title: `${data.firstName} applied for a withdrawal request`,
        message: `${data.firstName} has requested to withdraw an amount of ${withdrawAmount}.`,
      };

      dispatch(createNotification(newNotification));
      // get transaction
      dispatch(getTransaction({ limit, pageCount }));
      // Get Wallet Amount
      dispatch(getWalletAmount(userId));

      toggleModal();
    }
  };

  const handleOpenChat = (transaction) => {
    setSelectedTransaction(transaction);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => setIsChatOpen(false);

  useEffect(() => {
    // Get all Transaction History
    dispatch(getTransaction({ limit, pageCount }));
    // Get wallet amount
    dispatch(getWalletAmount(userId));
  }, [dispatch, limit, pageCount]);

  const handleCloseDeleteModal = () => setDeleteModal(false);

  const handleDeleteTicket = (transaction) => {
    setCurrentTransaction(transaction);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    dispatch(removeTransactionById(currentTransaction._id));
    // Get Latest transaction
    dispatch(getWalletAmount(userId));
    handleCloseDeleteModal();
  };

  const columns = () =>
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
                className="p-0"
                onClick={() => handleDeleteTicket(original)}
                disabled={isApproved}
              >
                <i
                  className="bx bx-trash"
                  style={{ color: "var(--secondary-red)" }}
                ></i>
              </Button>
              <Button
                color="link"
                size="lg"
                className="p-0"
                onClick={() => handleOpenChat(original)}
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

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setRole(data?.roleId?.name || "User");
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* <Breadcrumb title="Payments" breadcrumbItem="Payment Management" /> */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">Wallet</h4>
          </div>

          <div className="d-flex flex-column align-items-center justify-content-center mb-3">
            <h6>Current Balance</h6>
            <h1>
              $
              {walletAmount != null && !isNaN(walletAmount)
                ? Number(walletAmount).toFixed(2)
                : "0.00"}
            </h1>
            <Button color="primary" onClick={toggleModal}>
              Withdraw
            </Button>
          </div>

          {showAlert && (
              <Alert color="danger" className="mt-3 d-flex justify-content-between">
                No Bank Account Added.{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/profile"); 
                  }}
                  className="text-primary"
                >
                  Add
                </a>
              </Alert>
            )}

          {loading ? (
            <div className="text-center space-top">
              <Spinner color="primary" />
            </div>
          ) : (
            <>
              {transaction.length ? (
                <>
                  <TableContainer
                    columns={columns(role)}
                    data={transaction}
                    isGlobalFilter={true}
                    isAddOptions={false}
                    customPageSize={10}
                    className="custom-header-css"
                    isPagination={false}
                    setSortBy={setSortBy}
                    sortBy={sortBy}
                    setSortOrder={setSortOrder}
                    sortOrder={sortOrder}
                  />
                  <Pagination
                    totalData={totalTransactions}
                    setLimit={setLimit}
                    setPageCount={setPageCount}
                    limit={limit}
                    pageCount={pageCount}
                    currentPage={pageCount}
                  />
                </>
              ) : (
                <h1 className="text-center space-top">No Transaction Found</h1>
              )}
            </>
          )}
        </Container>

        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <div className="modal-header">
            <h5 className="modal-title">Enter Withdrawal Amount</h5>
            <Button close onClick={toggleModal} />
          </div>
          <div className="modal-body">
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            {successMessage && <Alert color="success">{successMessage}</Alert>}

            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleWithdrawSubmit();
              }}
            >
              <FormGroup>
                <Label for="withdrawAmount">Amount to Withdraw</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </FormGroup>

              <div className="d-flex justify-content-end gap-2">
                <Button color="secondary" onClick={toggleModal}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={handleWithdrawSubmit}
                  className="ml-2"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <Modal isOpen={deleteModal} toggle={handleCloseDeleteModal}>
          <ModalHeader toggle={handleCloseDeleteModal}>
            Confirm Delete
          </ModalHeader>
          <ModalBody>
            Are you sure you want to delete this Transaction?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button color="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {isChatOpen && (
        <Chat
          type="Transaction"
          ticket={selectedTransaction}
          onClose={handleCloseChat}
        />
      )}
    </React.Fragment>
  );
};

export default InfluencersPayment;
