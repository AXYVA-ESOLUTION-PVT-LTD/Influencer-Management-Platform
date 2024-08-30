import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";

const InfluencerGrowth = (props) => {
  // Meta title
  document.title = "Influencer Growth | Drim";

  // Sample statistics data
  const statistics = [
    { title: "Total Followers", count: 20000, icon: "bx bx-user", filter: "followers" },
    { title: "Engagement Rate", count: "3.5%", icon: "bx bx-bar-chart-alt", filter: "engagement" },
    { title: "Posts", count: 150, icon: "bx bx-news", filter: "posts" },
    { title: "Influencers", count: 80, icon: "bx bxs-star", filter: "influencers" },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Influencer Growth")}
            breadcrumbItem={props.t("Statistics")}
          /> */}

          {/* Import/Export Buttons */}
          <div className="d-flex justify-content-end mb-4">
            <Button color="primary" className="me-2">
              Import CSV
            </Button>
            <Button color="primary">
              Export CSV
            </Button>
          </div>

          {/* Statistics Cards */}
          <Row>
            {statistics.map((stat, index) => (
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

export default withTranslation()(InfluencerGrowth);
