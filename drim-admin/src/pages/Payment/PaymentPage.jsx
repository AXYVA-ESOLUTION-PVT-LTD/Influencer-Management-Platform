import React, { useEffect, useState } from "react";
import { Badge, Button, Container, Spinner } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import ROLES from "../../constants/role";
import { staticPayments } from "../../data/PaymentData";


// Column definitions inside the same file
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
          {/* <Button color="link" size="sm" onClick={() => handleDelete(original)}>
          <i className="bx bx-trash" style={{ color: "red" }}></i>
        </Button> */}
        </>
      ),
    },
  ].filter(Boolean); // Filter out null/undefined columns for non-admin roles

const PaymentPage = () => {
  document.title = "Payments | Management";

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false); // Control loading state manually

  // Get the role from local storage or set a default
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setRole(data?.roleId?.name || "User"); // Set role, default to "User" if not found
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Payments" breadcrumbItem="Payment Management" />
          {loading ? (
            <div className="text-center" style={{ marginTop: 50 }}>
              <Spinner color="primary" />
            </div>
          ) : (
            <TableContainer
              columns={columns(role)} // Pass role to the column generator
              data={staticPayments} // Use static payments data
              isGlobalFilter={true}
              isAddOptions={false}
              customPageSize={10}
              className="custom-header-css"
              isPagination={true}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PaymentPage;
