import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  Col,
  Container,
  Row,
} from "reactstrap";

import { withTranslation } from "react-i18next";
import { opportunitiesData } from "../../data/opportunitiesData";

const OpportunitiesPage = (props) => {
  document.title = "Dashboard | Raise ";

  const handleCreateTicket = (opportunity) => {
    alert(`Creating a request for ${opportunity.name}`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Influencer Opportunities")}
            breadcrumbItem={props.t("Opportunities")}
          /> */}

          {/* Opportunities Grid */}
          <Row>
            {opportunitiesData.map((opportunity) => (
              <Col sm="6" md="4" lg="3" key={opportunity.id} className="mb-4">
                <Card className="overflow-hidden">
                  <div className="bg-primary bg-soft">
                    <Row>
                      <Col xs="12" className="p-3">
                        <h5 className="text-primary ps-3">
                          {opportunity.name}
                        </h5>
                        <p className="text-primary ps-3">
                          Company: {opportunity.company}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <Row className="align-items-center">
                      <Col xs="6">
                        <CardImg
                          className="img-fluid"
                          src="https://img.freepik.com/free-vector/girl-standing-growing-arrows-looking-through-binoculars-woman-searching-opportunity-job-flat-vector-illustration-business-strategy-goal-pathway-career-concept_74855-25996.jpg"
                          alt={`Image for ${opportunity.name}`}
                        />
                      </Col>
                      <Col xs="6">
                        <div className="pt-3">
                          <CardText>
                            <strong>Deadline:</strong> {opportunity.deadline}
                          </CardText>
                          <CardText>
                            <strong>Compensation:</strong>{" "}
                            {opportunity.compensation}
                          </CardText>
                        </div>
                      </Col>
                    </Row>
                    <Button
                      color="primary"
                      className="mt-3"
                      // onClick={() => handleCreateTicket(opportunity)}
                    >
                      Apply
                    </Button>
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

export default withTranslation()(OpportunitiesPage);
