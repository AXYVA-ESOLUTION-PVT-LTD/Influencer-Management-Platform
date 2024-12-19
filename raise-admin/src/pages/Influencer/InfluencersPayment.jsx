import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Container,
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
import TableContainer from "../../components/Common/TableContainer";
import ROLES from "../../constants/role";
import { staticPayments } from "../../data/PaymentData";
import "../../assets/themes/colors.scss";

const InfluencersPayment = () => {
  document.title = "Payments | Brandraise";

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("");

  const toggleModal = () => setModalOpen(!modalOpen);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };
  const columns = (role) =>
    [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Commission",
        accessor: "commission",
      },
      {
        Header: "Deduction",
        accessor: "deduction",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`status-badge ${
              value === "Completed"
                ? "status-badge-completed"
                : "status-badge-pending"
            }`}
          >
            {value}
          </span>
        ),
      },
    ].filter(Boolean);

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setStatus(payment.status);
    toggleModal();
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSave = () => {
    const updatedPayments = staticPayments.map((payment) =>
      payment.id === selectedPayment.id ? { ...payment, status } : payment
    );
    toggleModal();
  };

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
            <h4 className="font-size-18" style={{ textTransform: "uppercase" }}>
              Payments
            </h4>
          </div>
          {loading ? (
            <div className="text-center" style={{ marginTop: 50 }}>
              <Spinner color="primary" />
            </div>
          ) : (
            <TableContainer
              columns={columns(role)}
              data={staticPayments}
              isGlobalFilter={true}
              isAddOptions={false}
              customPageSize={10}
              className="custom-header-css"
              isPagination={true}
            />
          )}
        </Container>
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Edit Payment Status</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="paymentStatus">Status</Label>
            <Input
              type="select"
              name="status"
              id="paymentStatus"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "var(--primary-purple)",
              color: "var(--primary-white)",
            }}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default InfluencersPayment;
