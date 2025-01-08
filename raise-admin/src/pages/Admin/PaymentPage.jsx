import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";
import Pagination from "../../components/Common/Pagination";
import { getWallet, updateWallet } from "../../store/payment/actions";
import "../../assets/themes/colors.scss";

const PaymentPage = () => {
  document.title = "Wallet | Brandraise";

  const [selectedWallet, setSelectedWallet] = useState(null);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    transactionType: "deposit",
  });
  const [errors, setErrors] = useState({});
  
  const toggleAmountModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
    if (isUpdateModalOpen) {
      setErrors({}); 
    }
  };

  const dispatch = useDispatch();

  const { wallets, loading, error, totalWallets } = useSelector(
    (state) => state.Payment
  );
  
  const toggleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const handleUpdateWallet = (wallet) => {
    setFormData({
      amount: 0,
      transactionType: "deposit",
    });
    setSelectedWallet(wallet);
    toggleUpdateModal();
  };

  const columns = useMemo(
      () => [
        {
          Header: "Name",
          accessor: "influencerId.username",
        },
        {
          Header: "Email",
          accessor: "influencerId.email",
        },
        {
          Header: "Balance",
          accessor: "balance",
          Cell: ({ value }) => value.toFixed(2),
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
                onClick={() => handleUpdateWallet(original)}
              >
                <i className="bx bx-edit" style={{ color:"var(--secondary-yellow)" }}></i>
              </Button>
            </>
          ),
        },
      ],
      [handleUpdateWallet]
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTransactionTypeChange = (e) => {
    setFormData({ ...formData, transactionType: e.target.value });
  };

  const handleSubmit = () => {
    const validationErrors = {};
    if (!formData.amount || formData.amount < 0) {
      validationErrors.amount = "Please enter a valid amount.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    dispatch(
      updateWallet({
        id: selectedWallet._id,
        payload: {
          influencerId: selectedWallet.influencerId._id, 
          balance: formData.amount,
          transactionType: formData.transactionType
        },
      })
    );
    toggleAmountModal();
  };

  useEffect(() => {
    dispatch(
      getWallet({
        limit,
        pageCount,
        sortBy,
        sortOrder
      })
    );
  }, [dispatch, limit, pageCount, sortBy, sortOrder]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">
              Wallet
            </h4>
          </div>
          {loading ? (
            <div className="text-center space-top">
              <Spinner color="primary" />
            </div>
          ) : (
            <>
              <TableContainer
                columns={columns}
                data={wallets}
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
              <Pagination
                totalData={totalWallets}
                setLimit={setLimit}
                setPageCount={setPageCount}
                limit={limit}
                pageCount={pageCount}
                currentPage={pageCount}
              />
            </>
          )}
        </Container>
      </div>

      <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>Update Wallet</ModalHeader>
          <ModalBody>
          <FormGroup>
            <Label for="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
            />
            {errors.amount && <p className="text-danger">{errors.amount}</p>}
          </FormGroup>

          <FormGroup tag="fieldset" className="transaction-type-fieldset">
            <Label for="type">Transaction Type</Label>
            <div className="radio-container">
              <FormGroup check>
                <Label check className="radio-option">
                  <Input
                    type="radio"
                    name="transactionType"
                    value="withdraw"
                    checked={formData.transactionType === "withdraw"}
                    onChange={handleTransactionTypeChange}
                  />
                  Withdraw
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check className="radio-option">
                  <Input
                    type="radio"
                    name="transactionType"
                    value="deposit"
                    checked={formData.transactionType === "deposit"}
                    onChange={handleTransactionTypeChange}
                  />
                  Deposit
                </Label>
              </FormGroup>
            </div>
          </FormGroup>

          </ModalBody>
        
          <ModalFooter>
            <Button color="secondary" onClick={toggleAmountModal}>
              Cancel
            </Button>
            <Button
              className="border-none"
              style={{
                backgroundColor: "var(--primary-purple)",
                color: "var(--primary-white)",
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default PaymentPage;
