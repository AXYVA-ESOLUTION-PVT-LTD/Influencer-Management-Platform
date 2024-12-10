import React from 'react';
import { Card, CardBody, CardTitle, CardText, Badge, Col, Row } from 'reactstrap';

// Function to get badge color based on the tag
const getBadgeColor = (tag) => {
  switch (tag) {
    case 'High':
      return 'success';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'danger';
    default:
      return 'secondary';
  }
};

const DataCard = ({ title, desc, data, tag }) => {
  return (
    <Col md="3" className="mb-4">
      <Card className="h-100 d-flex flex-column">
        <CardBody className="d-flex flex-column justify-content-between">
          <div>
            <CardTitle tag="h6" className="mb-2">
              {title}
            </CardTitle>
            <CardText className="mb-2">{desc}</CardText>
          </div>
          <Row className="mt-auto d-flex flex-row justify-content-between">
            <Col xs="6" className="text-left">
              <CardText tag="h4" className="mb-0">
                {data}
              </CardText>
            </Col>
            <Col xs="6" className="text-right d-flex flex-row justify-content-end align-items-center">
              <Badge color={getBadgeColor(tag)}>
                {tag}
              </Badge>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default DataCard;
