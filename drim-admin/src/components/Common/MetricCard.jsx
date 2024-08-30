import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';

const MetricCard = ({ title, value }) => {
  return (
    <Card className="text-left">
      <CardBody>
        <CardTitle tag="h6" className="mb-3">
          {title}
        </CardTitle>
        <CardText tag="h3">{value}</CardText>
      </CardBody>
    </Card>
  );
};

export default MetricCard;
