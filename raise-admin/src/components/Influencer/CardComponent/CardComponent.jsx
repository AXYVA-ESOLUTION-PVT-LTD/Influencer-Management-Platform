import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardText,
  Row,
  Col,
} from "reactstrap";
import "./CardComponent.css";

const CardComponent = ({
  image,
  title,
  uploadTime,
  views,
  likes,
  comments,
  share_url,
}) => {
  return (
    <Col md="2" className="mb-4">
      <Card className="h-100">
        <CardImg top width="100%" src={image} style={{ borderRadius: '8px', overflow: 'hidden' }}  alt="Card image cap" />
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <CardText className="text-muted">{uploadTime}</CardText>
          <Row>
            <Col className="d-flex align-items-center">
              <i class="bx bx-show"></i>&nbsp;{views}
            </Col>
            <Col className="d-flex align-items-center">
              <i class="bx bxs-like"></i>&nbsp;{likes}
            </Col>
            <Col className="d-flex align-items-center">
              <i class="bx bxs-comment"></i>&nbsp;{comments}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <a
                href={share_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Watch Video
              </a>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CardComponent;
