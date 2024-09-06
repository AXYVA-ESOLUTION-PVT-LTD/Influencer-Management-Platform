import React, { useState } from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  FormGroup,
  Input,
  Row,
  Col,
  CardImg,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// i18n
import { withTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const InfluencerListPage = (props) => {
  // Meta title
  document.title = "Influencers | Raise ";

  const sampleInfluencers = [
    {
      id: 1,
      name: "Alice Johnson",
      status: "approved",
      followers: 15000,
      image: "https://via.placeholder.com/150?text=Alice+Johnson",
    },
    {
      id: 2,
      name: "Bob Brown",
      status: "pending",
      followers: 12000,
      image: "https://via.placeholder.com/150?text=Bob+Brown",
    },
    {
      id: 3,
      name: "Catherine Lee",
      status: "approved",
      followers: 15000,
      image: "https://via.placeholder.com/150?text=Catherine+Lee",
    },
    {
      id: 4,
      name: "David Wilson",
      status: "pending",
      followers: 12000,
      image: "https://via.placeholder.com/150?text=David+Wilson",
    },
    {
      id: 5,
      name: "Emily Davis",
      status: "approved",
      followers: 15000,
      image: "https://via.placeholder.com/150?text=Emily+Davis",
    },
    {
      id: 6,
      name: "Frank Miller",
      status: "pending",
      followers: 12000,
      image: "https://via.placeholder.com/150?text=Frank+Miller",
    },
    {
      id: 7,
      name: "Grace Martinez",
      status: "approved",
      followers: 15000,
      image: "https://via.placeholder.com/150?text=Grace+Martinez",
    },
    {
      id: 8,
      name: "Henry Thompson",
      status: "pending",
      followers: 12000,
      image: "https://via.placeholder.com/150?text=Henry+Thompson",
    },
    {
      id: 9,
      name: "Ivy Harris",
      status: "approved",
      followers: 15000,
      image: "https://via.placeholder.com/150?text=Ivy+Harris",
    },
    {
      id: 10,
      name: "Jack Scott",
      status: "pending",
      followers: 12000,
      image: "https://via.placeholder.com/150?text=Jack+Scott",
    },
    {
      id: 11,
      name: "Karen Lewis",
      status: "approved",
      followers: 15000,
      image: "https://via.placeholder.com/150?text=Karen+Lewis",
    },
    {
      id: 12,
      name: "Larry Young",
      status: "pending",
      followers: 12000,
      image: "https://via.placeholder.com/150?text=Larry+Young",
    },
    {
      id: 13,
      name: "Mia Walker",
      status: "approved",
      followers: 15000,
      image: "https://via.placeholder.com/150?text=Mia+Walker",
    },
    {
      id: 14,
      name: "Nate Allen",
      status: "pending",
      followers: 12000,
      image: "https://via.placeholder.com/150?text=Nate+Allen",
    },
    {
      id: 15,
      name: "Olivia King",
      status: "approved",
      followers: 15000,
      image: "https://via.placeholder.com/150?text=Olivia+King",
    },
    {
      id: 16,
      name: "Paul Wright",
      status: "pending",
      followers: 12000,
      image: "https://via.placeholder.com/150?text=Paul+Wright",
    },
    {
      id: 17,
      name: "Quinn Adams",
      status: "approved",
      followers: 15000,
      image: "https://via.placeholder.com/150?text=Quinn+Adams",
    },
    {
      id: 18,
      name: "Riley Green",
      status: "pending",
      followers: 12000,
      image: "https://via.placeholder.com/150?text=Riley+Green",
    },
  ];

  // State for influencers, filters, and pagination
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const influencersPerPage = 8;

  // Filter and sort influencers
  const filteredInfluencers = sampleInfluencers
    .filter((inf) => filter === "all" || inf.status === filter)
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  // Pagination logic
  const indexOfLastInfluencer = currentPage * influencersPerPage;
  const indexOfFirstInfluencer = indexOfLastInfluencer - influencersPerPage;
  const currentInfluencers = filteredInfluencers.slice(
    indexOfFirstInfluencer,
    indexOfLastInfluencer
  );

  const totalPages = Math.ceil(filteredInfluencers.length / influencersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewProfile = (id) => {
    navigate(`/influencers/${id}`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Influencers")}
            breadcrumbItem={props.t("Influencers")}
          /> */}

          {/* Filters */}
          <FormGroup className="d-flex mb-3">
            <Input
              type="select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: "150px", marginRight: "10px" }}
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </Input>
            <Button
              onClick={() =>
                setSortOrder((prevSortOrder) =>
                  prevSortOrder === "asc" ? "desc" : "asc"
                )
              }
            >
              Sort by Name {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </FormGroup>

          {/* Influencers Grid */}
          <Row>
            {currentInfluencers.map((influencer) => (
              <Col md={6} xl={3} key={influencer.id} className="mb-4">
                <Card className="h-100">
                  <CardBody>
                    <Row className="align-items-center">
                      <Col xs={6}>
                        <CardImg
                          className="img-fluid"
                          src={influencer.image}
                          alt={influencer.name}
                          style={{
                            height: "140px",
                            width: "140px",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                      <Col xs={6}>
                        <CardTitle className="mt-0">
                          {influencer.name}
                        </CardTitle>
                        <CardText>Status: {influencer.status}</CardText>
                        <CardText>
                          Followers: {influencer.followers.toLocaleString()}
                        </CardText>
                        <Button
                          color="primary"
                          onClick={() => handleViewProfile(influencer.id)}
                        >
                          View Profile
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <Pagination aria-label="Page navigation example">
            {[...Array(totalPages).keys()].map((page) => (
              <PaginationItem key={page + 1} active={page + 1 === currentPage}>
                <PaginationLink onClick={() => handlePageChange(page + 1)}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </Pagination>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(InfluencerListPage);
