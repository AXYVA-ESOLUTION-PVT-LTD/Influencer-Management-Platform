import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';

const MetricCard = ({ title, value }) => {
  return (
    <Card className="text-left margin-bottom-metric-card">
      <CardBody>
        <CardTitle tag="h6">
          {title}
        </CardTitle>
        <CardText tag="h3">{value}</CardText>
      </CardBody>
    </Card>
  );
};

export default MetricCard;