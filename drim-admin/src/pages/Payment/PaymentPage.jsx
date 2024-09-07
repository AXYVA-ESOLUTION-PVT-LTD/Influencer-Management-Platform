import React, { useEffect, useState } from "react";
import { Badge, Button, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import ROLES from "../../constants/role";
import { staticPayments } from "../../data/PaymentData";




const PaymentPage = () => {
  document.title = "Payments | Management";

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
          style={{
            backgroundColor: value === "Completed" ? "#d4edda" : "#f5cd8c",
            color: value === "Completed" ? "#155724" : "#8a4500",
            borderRadius: "8px",
            padding: "5px 10px",
            fontSize: "0.7rem",
            fontWeight: 500,
          }}
        >
          {value}
        </span>
      ),
    },
    //   {
    //     Header: "Created At",
    //     accessor: "createdAt",
    //     Cell: ({ value }) => formatDate(value),
    //   },
    role === ROLES.ADMIN && {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row: { original } }) => (
        <>
        <Button color="link" size="lg" onClick={() => handleEdit(original)}>
            <i className="bx bx-edit" style={{ color: "orange" }}></i>
          </Button>
        </>
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
     const updatedPayments = staticPayments.map(payment =>
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
            <Button color="primary" onClick={handleSave}>Save</Button>
            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
    </React.Fragment>
  );
};

export default PaymentPage;
