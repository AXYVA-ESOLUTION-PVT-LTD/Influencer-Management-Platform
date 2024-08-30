import React from 'react';
import { Card, CardBody, CardText, Row, Col } from 'reactstrap';

const MetricListCard = ({ metrics }) => {
  return (
    <Card className="h-100">
      <CardBody>
        <Row>
          {metrics.map((metric, index) => (
            <Col xs="12" className="d-flex justify-content-between mb-2" key={index}>
              <CardText tag="h6">
                {metric.title}
              </CardText>
              <CardText tag="h6">
                {metric.value}
              </CardText>
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  );
};

export default MetricListCard;
