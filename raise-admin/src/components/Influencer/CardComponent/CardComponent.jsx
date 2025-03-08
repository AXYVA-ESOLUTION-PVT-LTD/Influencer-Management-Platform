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
    <Col md="2" className="mb-4 video-card-container">
      <Card className="video-card">
       <div className="video-card-img">
       <CardImg top width="100%" src={image} className="video-card-image" alt="Card image cap" />
       </div>
        <CardBody>
          <CardTitle tag="h5" className="video-card-title">{title}</CardTitle>
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
