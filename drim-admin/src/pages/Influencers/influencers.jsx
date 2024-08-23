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

const Influencers = (props) => {
  // Meta title
  document.title = "Dashboard | Drim - React Admin & Dashboard Template";

  // Updated sample influencer data with 20 entries
  const sampleInfluencers = Array.from({ length: 20 }, (v, i) => ({
    id: i + 1,
    name: `Influencer ${i + 1}`,
    status: i % 2 === 0 ? "approved" : "pending",
    followers: Math.floor(Math.random() * 20000) + 1000,
    image: `https://via.placeholder.com/150?text=Profile+${i + 1}`, // Placeholder image URL
  }));

  // State for influencers, filters, and pagination
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const influencersPerPage = 6;

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

  const handleViewProfile = () => {
    navigate('/influencer-details'); 
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Influencers")}
            breadcrumbItem={props.t("Influencers")}
          />

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
                      src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2100"
                      alt={influencer.name}
                      style={{ height: "140px", width: "140px", objectFit: "cover" }}
                    />
                  </Col>
                  <Col xs={6}>
                    <CardTitle className="mt-0">{influencer.name}</CardTitle>
                    <CardText>Status: {influencer.status}</CardText>
                    <CardText>Followers: {influencer.followers.toLocaleString()}</CardText>
                    <Button color="primary" onClick={handleViewProfile}>
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

export default withTranslation()(Influencers);
