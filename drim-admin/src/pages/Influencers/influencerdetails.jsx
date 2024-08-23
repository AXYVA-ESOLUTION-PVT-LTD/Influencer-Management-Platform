import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Table,
  Progress,
  Button,
  Modal,
  ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";

function InfluencerDetails() {
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Dummy data for influencer
  const influencer = {
    name: "Jane Doe",
    profileUrl: "https://example.com/jane-doe",
    photo: "https://via.placeholder.com/150",
    reach: "1.5M",
    publication: 200,
    subscribers: "500K",
    subscriptions: 50,
    accountActivity: "High",
    audienceQuality: "Excellent",
    audienceReachability: "80%",
  };

  const topPublications = [
    { id: 1, image: "https://via.placeholder.com/100", title: "Top Publication 1" },
    { id: 2, image: "https://via.placeholder.com/100", title: "Top Publication 2" },
    { id: 3, image: "https://via.placeholder.com/100", title: "Top Publication 3" },
  ];

  const publications = [
    { id: 1, title: "Sample Publication Title 1", date: "2024-08-20" },
    { id: 2, title: "Sample Publication Title 2", date: "2024-08-19" },
  ];

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleViewClick = (publication) => {
    setSelectedPublication(publication);
    toggleModal();
  };
  return (
    <React.Fragment>
      <div className="page-content">
    <Container fluid >
      <Breadcrumbs title="Influencers" breadcrumbItem="Influencer Details" />

      {/* Basic Profile Section */}
      <Card className="mb-4 mt-1">
        <CardBody>
          <Row>
            <Col md="3">
              <img
                src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2100"
                alt="Influencer"
                className="img-fluid rounded-circle"
                style={{ height: "200px", width: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col md="9">
              <CardTitle tag="h5">{influencer.name}</CardTitle>
              <CardText>
                <a href={influencer.profileUrl} target="_blank" rel="noopener noreferrer">
                  Visit Profile
                </a>
              </CardText>
              <CardText>Reach: {influencer.reach}</CardText>
              <CardText>Publication: {influencer.publication}</CardText>
              <CardText>Subscribers: {influencer.subscribers}</CardText>
              <CardText>Subscriptions: {influencer.subscriptions}</CardText>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Engagement Rate Section */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5">Engagement Rate</CardTitle>
          <Row>
            <Col md="6">
              <CardText>Account Activity: {influencer.accountActivity}</CardText>
              <CardText>Audience Quality: {influencer.audienceQuality}</CardText>
              <CardText>Audience Reachability: {influencer.audienceReachability}</CardText>
            </Col>
            <Col md="6">
              <div>
                <CardTitle tag="h6">Engagement Rate</CardTitle>
                <Progress value="75" className="mb-2">75%</Progress>
                <CardTitle tag="h6">Account Activity</CardTitle>
                <Progress value="60" className="mb-2">60%</Progress>
                <CardTitle tag="h6">Audience Quality</CardTitle>
                <Progress value="90">90%</Progress>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Audience Section */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5">Audience</CardTitle>
          <Row>
            <Col md="4">
              <CardTitle tag="h6">Gender</CardTitle>
              <Progress multi>
                <Progress bar value="60">Male: 60%</Progress>
                <Progress bar color="danger" value="40">Female: 40%</Progress>
              </Progress>
            </Col>
            <Col md="4">
              <CardTitle tag="h6">Age by Category</CardTitle>
              <Progress multi>
                <Progress bar color="success" value="30">18-24: 30%</Progress>
                <Progress bar color="info" value="50">25-34: 50%</Progress>
                <Progress bar color="warning" value="20">35-44: 20%</Progress>
              </Progress>
            </Col>
            <Col md="4">
              <CardTitle tag="h6">Language</CardTitle>
              <Progress multi>
                <Progress bar color="primary" value="70">English: 70%</Progress>
                <Progress bar color="secondary" value="20">Spanish: 20%</Progress>
                <Progress bar color="danger" value="10">Other: 10%</Progress>
              </Progress>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Advertising Section */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5">Advertising</CardTitle>
          <CardText>Details about the influencer's advertising methods, strategies, and effectiveness.</CardText>
          <Button color="primary">View More</Button>
        </CardBody>
      </Card>

      {/* Top Publication Section */}
      <Card className="mb-4">
  <CardBody>
    <CardTitle tag="h5">Top Publications</CardTitle>
    <div className="d-flex overflow-auto" style={{ gap: "10px" }}>
      {topPublications.map((publication) => (
        <div key={publication.id} className="p-2">
          <img
            src={publication.image}
            alt="Publication"
            className="img-fluid"
            style={{ borderRadius: "5px" }} // Optional: Add some rounding to the image corners
          />
          <div className="mt-2 d-flex justify-content-start">
            <i className="bx bx-like" style={{ color: "gray", fontSize: "18px", borderRadius: "50%", padding: "5px" }}></i>
            <i className="bx bx-dislike" style={{ color: "gray", fontSize: "18px",  borderRadius: "50%", padding: "5px" }}></i>
          </div>
        </div>
      ))}
    </div>
  </CardBody>
</Card>


      {/* Publication Table Section */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5">Publications</CardTitle>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((publication) => (
                <tr key={publication.id}>
                  <th scope="row">{publication.id}</th>
                  <td>{publication.title}</td>
                  <td>{publication.date}</td>
                  <td>
                  <Button color="primary" size="sm" onClick={() => handleViewClick(publication)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Publication Details</ModalHeader>
        <ModalBody>
          {selectedPublication && (
            <>
              <p><strong>Title:</strong> {selectedPublication.title}</p>
              <p><strong>Date:</strong> {selectedPublication.date}</p>
              <p><strong>Content:</strong> {selectedPublication.content}</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </Container>
    </div>
    </React.Fragment>
  );
}

export default InfluencerDetails;
