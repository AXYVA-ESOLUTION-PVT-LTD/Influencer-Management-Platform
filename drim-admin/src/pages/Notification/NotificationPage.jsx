
import React, { useState, useEffect } from "react";
import {
  Container,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { columns, data } from "../../data/notification";


const NotificationPage = () => {

  document.title = "Notifications | Raise";

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
            isPagination={true}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NotificationPage;
