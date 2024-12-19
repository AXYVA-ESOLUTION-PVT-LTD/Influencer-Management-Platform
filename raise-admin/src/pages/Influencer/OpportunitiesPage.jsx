import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Nav,
  NavItem,
  Row,
  TabContent,
  TabPane,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Spinner,
} from "reactstrap";
import Pagination from "../../components/Common/Pagination";
import classnames from "classnames";
import { withTranslation } from "react-i18next";
import "../../assets/themes/colors.scss";
import { FaCopy, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ROLES from "../../constants/role";
import { useDispatch, useSelector } from "react-redux";
import {
  createTicketRequest,
  fetchTicketsRequest,
  getOpportunity,
} from "../../store/opportunity/actions";
import {
  createNotification,
  createTicketNotification,
} from "../../store/actions";

const OpportunitiesPage = (props) => {
  const dispatch = useDispatch();
  const {
    opportunities,
    opportunitiesData,
    error,
    loading,
    totalOpportunities,
    currentPage,
    totalRecords,
  } = useSelector((state) => state.opportunity);
  // const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [influencer, setInfluencer] = useState(null);
  const [description, setDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [copiedState, setCopiedState] = useState({});
  const [role, setRole] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsOpportunity, setDetailsOpportunity] = useState(null);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  document.title = "Opportunity | Brandraise ";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setInfluencer(user._id);
    setRole(user?.roleId?.name || "User");
  }, []);

  useEffect(() => {
    dispatch(
      getOpportunity({
        limit,
        pageCount,
      })
    );
  }, [dispatch, limit, pageCount, activeTab]);

  const handleTicketCreation = () => {
    dispatch(
      createTicketRequest({
        influencerId: influencer,
        opportunityId: selectedOpportunity._id,
        description,
      })
    );

    const newTicket = {
      title: `Applied for ${selectedOpportunity.title}`,
      description: description,
    };

    dispatch(createTicketNotification(newTicket));

    const newNotification = {
      userId: "67334a52373c3328068f9157",
      title: `Applied for ${selectedOpportunity.title}`,
      message: description,
    };

    dispatch(createNotification(newNotification));

    setAppliedOpportunities((prevApplied) => [
      ...prevApplied,
      selectedOpportunity._id,
    ]);

    dispatch(
      getOpportunity({
        limit,
        pageCount,
      })
    );

    setModalOpen(false);
  };

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);

      if (tab === "2" && influencer) {
        dispatch(
          fetchTicketsRequest({
            limit: itemsPerPage,
            pageCount: currentPageIndex,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (activeTab === "2" && influencer) {
      dispatch(
        fetchTicketsRequest({
          limit: itemsPerPage,
          pageCount: currentPageIndex,
        })
      );
    }
  }, [itemsPerPage, currentPageIndex]);

  const filteredOpportunities = opportunities.filter(
    (opportunity) => !appliedOpportunities.includes(opportunity._id)
  );

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedState((prev) => ({ ...prev, [id]: true }));
    toast.success("Coupon Code copied!");
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const handleDetailsView = (opportunity) => {
    setDetailsOpportunity(opportunity);
    setDetailsModalOpen(true);
  };

  const handleCreateTicket = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setModalOpen(true);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Influencer Opportunities")}
            breadcrumbItem={props.t("Opportunities")}
          /> */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">Opportunities</h4>
          </div>
          <Row>
            <Col sm="12">
              <Nav tabs className="mb-3">
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggle("1");
                    }}
                  >
                    All Opportunity
                  </NavLink>
                </NavItem>
                {role === ROLES.INFLUENCER && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        toggle("2");
                      }}
                    >
                      Applied
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
              <TabContent activeTab={activeTab}>
                {/* All Opportunities */}
                <TabPane tabId="1">
                  {filteredOpportunities.length > 0 ? (
                    <>
                      <Row className="d-flex flex-wrap">
                        {filteredOpportunities.map((opportunity) => (
                          <Col
                            xs="12"
                            sm="6"
                            md="4"
                            lg="3"
                            key={opportunity._id}
                            className="mb-4"
                          >
                            <Card className="overflow-hidden d-flex flex-column h-100">
                              {/* Image Section */}
                              <div>
                                <Row>
                                  <Col xs="12">
                                    <CardImg
                                      className="img-fluid opportunity-card-image"
                                      src={`${
                                        import.meta.env.VITE_APP_BASE_URL
                                      }/uploads/opportunityImage/${
                                        opportunity.imageUrl
                                      }`}
                                      alt={`Image for ${opportunity.title}`}
                                    />
                                  </Col>
                                </Row>
                              </div>

                              <CardBody className="p-3">
                                <Row>
                                  <Col xs="12">
                                    <h5
                                      style={{ color: "var(--primary-purple)" }}
                                      className="mt-2 ellipsis-text"
                                    >
                                      {opportunity.title}
                                    </h5>
                                    <p className="ellipsis-text">
                                      <strong>Brand:</strong>{" "}
                                      {opportunity.brand}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>Description:</strong>{" "}
                                      {opportunity.description}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>Type:</strong> {opportunity.type}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>Location:</strong>{" "}
                                      {opportunity.location}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>End Date:</strong>{" "}
                                      {new Date(
                                        opportunity.endDate
                                      ).toLocaleDateString()}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>Status:</strong>{" "}
                                      <span
                                        className={`badge ${
                                          opportunity?.status === "Active"
                                            ? "badge-active"
                                            : "badge-inactive"
                                        }`}
                                      >
                                        {opportunity?.status}
                                      </span>
                                    </p>
                                  </Col>
                                </Row>

                                {role === ROLES.INFLUENCER && (
                                  <Row className="mt-3">
                                    <Col xs="12">
                                      <Button
                                        style={{
                                          backgroundColor:
                                            "var(--primary-purple)",
                                          color: "var(--primary-white)",
                                          width: "100%",
                                        }}
                                        onClick={() =>
                                          handleCreateTicket(opportunity)
                                        }
                                        disabled={
                                          opportunity.status === "Inactive"
                                        }
                                      >
                                        Apply
                                      </Button>
                                    </Col>
                                  </Row>
                                )}
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      <Pagination
                        totalData={totalOpportunities}
                        setLimit={setLimit}
                        setPageCount={setPageCount}
                        limit={limit}
                        pageCount={pageCount}
                        currentPage={currentPage}
                      />
                    </>
                  ) : (
                    <h1 className="no-opportunities-heading">
                      No opportunities found.
                    </h1>
                  )}
                </TabPane>

                {/* Applied Opportunities */}
                <TabPane tabId="2">
                  <Row>
                    {loading ? (
                      <div className="no-opportunities-heading">
                        <Spinner style={{ color: "var(--primary-purple)" }} />
                      </div>
                    ) : opportunitiesData.length > 0 ? (
                      <>
                        {opportunitiesData.map((ticket) => (
                          <Col
                            sm="6"
                            md="4"
                            lg="3"
                            key={ticket._id}
                            className="mb-4"
                          >
                            <Card className="overflow-hidden d-flex flex-column h-100">
                              {/* Image Section */}
                              <div>
                                <Row>
                                  <Col xs="12">
                                    <CardImg
                                      className="img-fluid opportunity-card-image"
                                      src={`${
                                        import.meta.env.VITE_APP_BASE_URL
                                      }/uploads/opportunityImage/${
                                        ticket.opportunity.imageUrl
                                      }`}
                                      alt={`Image for ${ticket.opportunity.title}`}
                                    />
                                  </Col>
                                </Row>
                              </div>

                              {/* Card Body with Flexbox Layout */}
                              <CardBody className="p-3 d-flex flex-column">
                                <Row>
                                  <Col xs="12">
                                    <h5
                                      style={{ color: "var(--primary-purple)" }}
                                      className="mt-2 ellipsis-text"
                                    >
                                      {ticket.opportunity.title}
                                    </h5>
                                    <p className="ellipsis-text">
                                      <strong>Brand:</strong>{" "}
                                      {ticket.opportunity.brand}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>Description:</strong>{" "}
                                      {ticket.opportunity.description}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>Type:</strong>{" "}
                                      {ticket.opportunity.type}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>Location:</strong>{" "}
                                      {ticket.opportunity.location}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>End Date:</strong>{" "}
                                      {new Date(
                                        ticket.opportunity.endDate
                                      ).toLocaleDateString()}
                                    </p>
                                    <p className="ellipsis-text">
                                      <strong>Status:</strong>{" "}
                                      <span
                                        className={`badge ${
                                          ticket.opportunity?.status ===
                                          "Active"
                                            ? "badge-active"
                                            : "badge-inactive"
                                        }`}
                                      >
                                        {ticket.opportunity.status}
                                      </span>
                                    </p>
                                  </Col>
                                </Row>
                                <div className="coupon-box-wrapper">
                                  <div className="coupon-code-container">
                                    <span className="me-2">
                                      {ticket.couponCode || "N/A"}
                                    </span>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        copyToClipboard(
                                          ticket.couponCode,
                                          ticket._id
                                        )
                                      }
                                    >
                                      {copiedState[ticket._id] ? (
                                        <FaCheckCircle color="white" />
                                      ) : (
                                        <FaCopy />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                <Button
                                  color="primary"
                                  className="mt-3"
                                  onClick={() => handleDetailsView(ticket)}
                                >
                                  View More
                                </Button>
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                        <Pagination
                        totalData={totalRecords}
                        setLimit={setItemsPerPage}
                        setPageCount={setCurrentPageIndex}
                        limit={itemsPerPage}
                        pageCount={currentPageIndex}
                        currentPage={currentPageIndex}
                      />
                      </>
                    ) : (
                      <h1 className="no-opportunities-heading">
                        No applied opportunities found.
                      </h1>
                    )}
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>

          <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
            <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
              Apply for {selectedOpportunity ? selectedOpportunity.title : ""}
            </ModalHeader>
            <ModalBody>
              <Input
                type="textarea"
                placeholder="Enter description for your ticket"
                value={description}
                onChange={handleDescriptionChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleTicketCreation}>
                Confirm
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={detailsModalOpen}
            toggle={() => setDetailsModalOpen(!detailsModalOpen)}
            size="lg"
          >
            <ModalHeader toggle={() => setDetailsModalOpen(!detailsModalOpen)}>
              {detailsOpportunity?.opportunity?.title || "Opportunity Details"}
            </ModalHeader>
            <ModalBody>
              {/* Image Section */}
              {detailsOpportunity?.opportunity?.imageUrl && (
                <div className="text-center mb-3">
                  <img
                    src={`${
                      import.meta.env.VITE_APP_BASE_URL
                    }/uploads/opportunityImage/${
                      detailsOpportunity.opportunity.imageUrl
                    }`}
                    alt={`Image for ${detailsOpportunity.opportunity.title}`}
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "200px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                </div>
              )}

              {/* Opportunity Details */}
              <Row>
                <Col xs="12">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "100px auto",
                      gap: "10px",
                    }}
                  >
                    <p>
                      <strong>Brand</strong>
                    </p>
                    <p>: {detailsOpportunity?.opportunity?.brand}</p>

                    <p>
                      <strong>Description</strong>
                    </p>
                    <p>: {detailsOpportunity?.opportunity?.description}</p>

                    <p>
                      <strong>Type</strong>
                    </p>
                    <p>: {detailsOpportunity?.opportunity?.type}</p>

                    <p>
                      <strong>Location</strong>
                    </p>
                    <p>: {detailsOpportunity?.opportunity?.location}</p>

                    <p>
                      <strong>End Date</strong>
                    </p>
                    <p>
                      :{" "}
                      {new Date(
                        detailsOpportunity?.opportunity?.endDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>Status:</strong>
                    </p>
                    <p>
                      :{" "}
                      <span
                        className={`badge ${
                          detailsOpportunity?.opportunity?.status === "Active"
                            ? "badge-active"
                            : "badge-inactive"
                        }`}
                      >
                        {detailsOpportunity?.opportunity?.status}
                      </span>
                    </p>
                  </div>

                  <div className="coupon-box-wrapper">
                    <div className="coupon-code-container">
                      <span className="me-2">
                        {detailsOpportunity?.couponCode || "N/A"}
                      </span>
                      <Button
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            detailsOpportunity?.couponCode,
                            detailsOpportunity?._id
                          )
                        }
                      >
                        {copiedState[detailsOpportunity?._id] ? (
                          <FaCheckCircle color="white" />
                        ) : (
                          <FaCopy />
                        )}
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onClick={() => setDetailsModalOpen(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(OpportunitiesPage);
