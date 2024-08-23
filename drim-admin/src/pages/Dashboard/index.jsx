import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// i18n
import { withTranslation } from "react-i18next";

const Dashboard = (props) => {
  // Meta title
  document.title = "Dashboard | Drim";

  // State for filters
  const [filters, setFilters] = useState({
    category: "all",
    dateRange: "thisMonth",
  });

  // Sample statistics data
  const statistics = [
    { title: "Posts", count: 200, icon: "bx bx-news", filter: "all" },
    { title: "Influencers", count: 50, icon: "bx bxs-star", filter: "all" },
  ];

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Filtered statistics
  const filteredStatistics = statistics.filter((stat) => {
    if (filters.category === "all") return true;
    return stat.filter === filters.category;
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboard")}
            breadcrumbItem={props.t("Dashboard")}
          />
          {/* Filters */}
          <Form className="mb-4">
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="categorySelect">Category</Label>
                  <Input
                    type="select"
                    name="category"
                    id="categorySelect"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="users">Users</option>
                    <option value="posts">Posts</option>
                    <option value="influencers">Influencers</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="dateRangeSelect">Date Range</Label>
                  <Input
                    type="select"
                    name="dateRange"
                    id="dateRangeSelect"
                    value={filters.dateRange}
                    onChange={handleFilterChange}
                  >
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="thisYear">This Year</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </Form>

          {/* Statistics Cards */}
          <Row>
            {filteredStatistics.map((stat, index) => (
              <Col md={4} key={index}>
                <Card className="mt-4" style={{ height: "200px" }}>
                  <CardBody className="d-flex flex-column justify-content-center align-items-center">
                    <div className="d-flex align-items-center mb-3">
                      <i
                        className={stat.icon}
                        style={{ fontSize: "2rem", color: "#5a5c69", marginRight: "0.5rem" }}
                      ></i>
                      <CardTitle tag="h5">{stat.title}</CardTitle>
                    </div>
                    <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stat.count}</p>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(Dashboard);
