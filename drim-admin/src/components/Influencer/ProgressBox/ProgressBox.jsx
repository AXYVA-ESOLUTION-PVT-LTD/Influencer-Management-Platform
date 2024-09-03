import React from 'react';
import { Card, CardBody, CardTitle, Progress } from 'reactstrap';
import './ProgressBox.css'; // Adjust the path as needed

const ProgressBox = ({ title, data }) => (
  <Card className="h-100">
    <CardBody>
      <CardTitle tag="h6" className="card-title-main mb-3">{title}</CardTitle>
      {data.map((item, index) => (
        <div key={index} className="mb-3">
          <CardTitle tag="p" className="card-title-item">{item.title}</CardTitle>
          <Progress value={item.progress} />
        </div>
      ))}
    </CardBody>
  </Card>
);

export default ProgressBox;
