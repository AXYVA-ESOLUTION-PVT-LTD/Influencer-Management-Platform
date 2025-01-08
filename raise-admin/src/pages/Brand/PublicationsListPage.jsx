import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";

// Import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import '../../assets/themes/colors.scss';
function PublicationsListPage() {
  document.title =
  "Publications | Brandraise";

  const data = [
    { id: 1, title: "Research on AI", author: "Jennifer Chang", publicationDate: "2023/01/15", journal: "AI Journal", volume: "15", pages: "45-67" },
    { id: 2, title: "Advances in Robotics", author: "Gavin Joyce", publicationDate: "2023/02/20", journal: "Robotics Today", volume: "22", pages: "78-89" },
    { id: 3, title: "Machine Learning Trends", author: "Angelica Ramos", publicationDate: "2023/03/05", journal: "Tech Review", volume: "10", pages: "123-135" },
    { id: 4, title: "Data Science Overview", author: "Doris Wilder", publicationDate: "2023/04/12", journal: "Data Science Monthly", volume: "8", pages: "10-25" },
    { id: 5, title: "Quantum Computing Basics", author: "Caesar Vance", publicationDate: "2023/05/28", journal: "Quantum Tech", volume: "4", pages: "50-60" },
    { id: 6, title: "Cloud Computing", author: "Yuri Berry", publicationDate: "2023/06/15", journal: "Cloud Tech Today", volume: "12", pages: "30-40" },
    { id: 7, title: "Cybersecurity Trends", author: "Jenette Caldwell", publicationDate: "2023/07/10", journal: "Security Weekly", volume: "5", pages: "95-105" },
    { id: 8, title: "Blockchain Innovations", author: "Dai Rios", publicationDate: "2023/08/25", journal: "Blockchain Review", volume: "7", pages: "12-22" },
    { id: 9, title: "Big Data Analytics", author: "Bradley Greer", publicationDate: "2023/09/30", journal: "Big Data Journal", volume: "14", pages: "65-80" },
    { id: 10, title: "Artificial Intelligence Ethics", author: "Gloria Little", publicationDate: "2023/10/22", journal: "Ethics in AI", volume: "9", pages: "33-47" },
    { id: 11, title: "Natural Language Processing", author: "Paul Byrd", publicationDate: "2023/11/19", journal: "NLP Weekly", volume: "6", pages: "55-70" },
    { id: 12, title: "Digital Transformation", author: "Michael Silva", publicationDate: "2024/01/04", journal: "Tech Innovations", volume: "11", pages: "88-102" },
    { id: 13, title: "Robotics and Automation", author: "Tatyana Fitzpatrick", publicationDate: "2024/02/12", journal: "Automation Today", volume: "13", pages: "22-35" },
    { id: 14, title: "AI in Healthcare", author: "Haley Kennedy", publicationDate: "2024/03/30", journal: "Healthcare Tech", volume: "17", pages: "44-58" },
    { id: 15, title: "Fintech Innovations", author: "Charde Marshall", publicationDate: "2024/04/15", journal: "Fintech Monthly", volume: "18", pages: "60-75" },
    { id: 16, title: "Internet of Things", author: "Quinn Flynn", publicationDate: "2024/05/20", journal: "IoT Journal", volume: "20", pages: "80-90" },
    { id: 17, title: "Augmented Reality", author: "Jena Gaines", publicationDate: "2024/06/25", journal: "AR Today", volume: "16", pages: "22-40" },
    { id: 18, title: "Tech and Society", author: "Sonya Frost", publicationDate: "2024/07/30", journal: "Tech and Society Review", volume: "23", pages: "110-125" },
    { id: 19, title: "Emerging Technologies", author: "Colleen Hurst", publicationDate: "2024/08/12", journal: "Emerging Tech Journal", volume: "19", pages: "77-89" },
    { id: 20, title: "Data Privacy", author: "Rhona Davidson", publicationDate: "2024/09/18", journal: "Privacy Tech", volume: "15", pages: "65-80" },
  ];

  // State for search, filter, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const publicationsPerPage = 5;

  // Filter and search logic
  const filteredData = data
    .filter((publication) => {
      // Filter by year
      if (yearFilter !== "all") {
        const publicationYear = publication.publicationDate.split("/")[0];
        if (publicationYear !== yearFilter) {
          return false;
        }
      }
      // Search by title, author, or journal
      return (
        publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publication.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publication.journal.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  // Pagination logic
  const indexOfLastPublication = currentPage * publicationsPerPage;
  const indexOfFirstPublication = indexOfLastPublication - publicationsPerPage;
  const currentPublications = filteredData.slice(
    indexOfFirstPublication,
    indexOfLastPublication
  );

  const totalPages = Math.ceil(filteredData.length / publicationsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleViewMore = (publication) => {
    setSelectedPublication(publication);
    toggleModal();
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* <Breadcrumbs title="Publications" breadcrumbItem="Publications" /> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">
            Publications
            </h4>
          </div>
        {/* Search and Filter */}
        <Row>
          <Col md={6} className="mb-3 mb-md-0">
            <Input
              type="text"
              placeholder="Search by title, author, or journal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <FormGroup>
              <Input
                type="select"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="all">All Years</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          {currentPublications.map((publication) => (
            <Col lg={6} key={publication.id}>
              <Card className="mb-4">
                <Row className="no-gutters align-items-center">
                  <Col md={4}>
                    <CardImg
                      className="img-fluid"
                      src="https://media.istockphoto.com/id/482783107/photo/world-of-books.jpg?s=612x612&w=0&k=20&c=9WgP-LFqYrOZKWOCwHvA7tXmDpeNVS7x7b-GZ1yW7xM="
                      alt={publication.title}
                    />
                  </Col>
                  <Col md={8}>
                    <CardBody>
                      <CardTitle>{publication.title}</CardTitle>
                      <CardText>
                        <strong>Author:</strong> {publication.author}
                      </CardText>
                      <CardText>
                        <strong>Publication Date:</strong>{" "}
                        {publication.publicationDate}
                      </CardText>
                      <CardText>
                        <strong>Journal:</strong> {publication.journal}
                      </CardText>
                      <CardText>
                        <strong>Volume:</strong> {publication.volume}
                      </CardText>
                      <CardText>
                        <strong>Pages:</strong> {publication.pages}
                      </CardText>
                      <Button style={{ backgroundColor: "var(--primary-purple)", color: "var(--primary-white)" }} onClick={() => handleViewMore(publication)}>
                        View More Details
                      </Button>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        <Pagination aria-label="Page navigation example">
          {[...Array(totalPages).keys()].map((page) => (
            <PaginationItem key={page + 1} active={page + 1 === currentPage}>
              <PaginationLink onClick={() => handlePageChange(page + 1)} style={page + 1 === currentPage ? { backgroundColor: "var(--primary-purple)", color: "var(--primary-white)"}:{}}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </Pagination>

         {/* Modal for Publication Details */}
         <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader
           toggle={toggleModal}>
            {selectedPublication ? selectedPublication.title : ""}
          </ModalHeader>
          <ModalBody>
            {selectedPublication && (
              <div>
                <p><strong>Author:</strong> {selectedPublication.author}</p>
                <p><strong>Publication Date:</strong> {selectedPublication.publicationDate}</p>
                <p><strong>Journal:</strong> {selectedPublication.journal}</p>
                <p><strong>Volume:</strong> {selectedPublication.volume}</p>
                <p><strong>Pages:</strong> {selectedPublication.pages}</p>
                <a
                  href={`https://dummyurl.com/${selectedPublication.id}`} 
                  target="_blank"
                  rel="demo"
                >
                  View Full Publication
                </a>
              </div>
            )}
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}

PublicationsListPage.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default PublicationsListPage;
