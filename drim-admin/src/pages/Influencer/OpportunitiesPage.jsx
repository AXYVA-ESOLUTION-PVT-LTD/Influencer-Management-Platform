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

// Sample opportunities data with image URLs
const opportunitiesData = [
  {
    id: 1,
    name: "Brand Partnership",
    company: "Company A",
    deadline: "2024-09-15",
    compensation: "$1,000",
    imageUrl: "https://via.placeholder.com/400x200?text=Content+Creation",
  },
  {
    id: 2,
    name: "Social Media Campaign",
    company: "Company B",
    deadline: "2024-08-25",
    compensation: "$500",
    imageUrl: "https://via.placeholder.com/400x200?text=Social+Media+Campaign",
  },
  {
    id: 3,
    name: "Content Collaboration",
    company: "Company C",
    deadline: "2024-10-10",
    compensation: "$750",
    imageUrl: "https://via.placeholder.com/400x200?text=Content+Collaboration",
  },
  {
    id: 4,
    name: "Product Launch",
    company: "Company D",
    deadline: "2024-09-05",
    compensation: "$1,200",
    imageUrl: "https://via.placeholder.com/400x200?text=Product+Launch",
  },
  {
    id: 5,
    name: "Influencer Event",
    company: "Company E",
    deadline: "2024-09-20",
    compensation: "$1,500",
    imageUrl: "https://via.placeholder.com/400x200?text=Influencer+Event",
  },
  {
    id: 6,
    name: "Giveaway Promotion",
    company: "Company F",
    deadline: "2024-08-30",
    compensation: "$300",
    imageUrl: "https://via.placeholder.com/400x200?text=Giveaway+Promotion",
  },
  {
    id: 7,
    name: "Affiliate Program",
    company: "Company G",
    deadline: "2024-09-10",
    compensation: "$400",
    imageUrl: "https://via.placeholder.com/400x200?text=Affiliate+Program",
  },
  {
    id: 8,
    name: "Brand Ambassador",
    company: "Company H",
    deadline: "2024-10-01",
    compensation: "$1,800",
    imageUrl: "https://via.placeholder.com/400x200?text=Brand+Ambassador",
  },
  {
    id: 9,
    name: "Content Creation",
    company: "Company I",
    deadline: "2024-09-25",
    compensation: "$600",
    imageUrl: "https://via.placeholder.com/400x200?text=Content+Creation",
  },
  {
    id: 10,
    name: "Video Sponsorship",
    company: "Company J",
    deadline: "2024-09-30",
    compensation: "$900",
    imageUrl: "https://via.placeholder.com/400x200?text=Content+Creation",
  },
];

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
