
import React from 'react';
import { Card, CardBody, CardTitle, CardImg, CardText, Row, Col } from 'reactstrap';
import './CardComponent.css';

const CardComponent = ({ image, title, uploadTime, views, likes, comments }) => {
  return (
    <Col md="2" className="mb-4">
      <Card className="h-100">
        <CardImg top width="100%" src={image} style={{ borderRadius: '8px', overflow: 'hidden' }}  alt="Card image cap" />
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <CardText className="text-muted">{uploadTime}</CardText>
          <Row>
            <Col className="d-flex align-items-center">
            <i className="bx bxs-eye icon"></i> 
              {views}
            </Col>
            <Col className="d-flex align-items-center">
            <i class='bx bxs-like'></i>{likes}
            </Col>
            <Col className="d-flex align-items-center">
            <i class='bx bxs-comment'></i>{comments}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CardComponent;
