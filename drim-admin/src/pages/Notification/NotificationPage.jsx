import React, { useState, useEffect } from "react";
import { Button, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { data } from "../../data/notification";

const NotificationPage = () => {
  document.title = "Notifications | Raise";

  const columns = [
    {
      Header: "Time",
      accessor: "createdAt",
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
          <Button
            color="link"
            size="lg"
            className="p-0 me-2"
            // onClick={() => handleViewOpportunity(original)}
          >
            <i className="bx bx-show" style={{ color: "blue" }}></i>
          </Button>
          <Button
            color="link"
            size="lg"
            className="p-0 me-2"
            // onClick={() => handleUpdateOpportunity(original)}
          >
            <i className="bx bx-edit" style={{ color: "orange" }}></i>
          </Button>
          <Button
            color="link"
            size="lg"
            className="p-0"
            // onClick={() => handleDeleteOpportunity(original)}
          >
            <i className="bx bx-trash" style={{ color: "red" }}></i>
          </Button>
        </>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Notifications" breadcrumbItem="Notifications" />
          <TableContainer
            columns={columns}
            data={data}
            isGlobalFilter={true}
            isAddOptions={false}
            customPageSize={10}
            className="custom-header-css"
            isPagination={false}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NotificationPage;
