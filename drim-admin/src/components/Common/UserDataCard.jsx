// UserDataCard.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Col, Row } from 'reactstrap';

const UserDataCard = ({ imageUrl, name, profileUrl, publication, subscribers, subscriptions }) => {
  return (
    <Card className="h-100 shadow-sm border-light rounded">
      <CardBody className="d-flex align-items-center">
        <Row className="w-100">
          {/* Image Section */}
          <Col md="4" className="text-center d-flex align-items-start justify-content-center">
            <img
              src={imageUrl}
              alt={name}
              className="img-fluid rounded-circle border border-primary"
              style={{
                height: '150px',
                width: '150px',
                objectFit: 'cover',
              }}
            />
          </Col>
          {/* Info Section */}
          <Col md="8" className="d-flex flex-column justify-content-center">
            <CardTitle tag="h4" className="font-weight-bold mb-2">
              {name}
            </CardTitle>
            <CardText>
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                Visit Profile
              </a>
            </CardText>
            <CardText tag="h5" className="mb-2 text-muted">
              Publication: <span className="font-weight-bold">{publication}</span>
            </CardText>
            <CardText tag="p" className="mb-2 text-muted">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, ipsam? Consequatur nesciunt impedit ullam aspernatur, numquam laboriosam exercitationem autem assumenda!
            </CardText>
            <CardText tag="h5" className="mb-2 text-muted">
              Subscribers: <span className="font-weight-bold">{subscribers}</span>
            </CardText>
            <CardText tag="p" className="mb-2 text-muted">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, ipsam? Consequatur nesciunt impedit ullam aspernatur, numquam laboriosam exercitationem autem assumenda!
            </CardText>
            <CardText tag="h5" className="mb-2 text-muted">
              Subscriptions: <span className="font-weight-bold">{subscriptions}</span>
            </CardText>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default UserDataCard;
