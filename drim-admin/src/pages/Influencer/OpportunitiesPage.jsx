import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
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
} from "reactstrap";
import classnames from "classnames";
import { withTranslation } from "react-i18next";
import "../../assets/themes/colors.scss";
import { FaCopy, FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ROLES from "../../constants/role";
import { useDispatch, useSelector } from "react-redux";
import {
  createTicketRequest,
  fetchTicketsRequest,
  getOpportunity,
} from "../../store/opportunity/actions";
import { createNotification } from "../../store/actions";

const OpportunitiesPage = (props) => {
  const dispatch = useDispatch();
  const {
    opportunities,
    opportunitiesData,
    error,
    loading,
    totalOpportunities,
    currentPage,
  } = useSelector((state) => state.opportunity);
  // const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [influencer, setInfluencer] = useState(null);
  const [description, setDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [copiedState, setCopiedState] = useState({});
  const [role, setRole] = useState("");
  const [filterFields, setFilterFields] = useState({
    title: "",
    type: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

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
        ...filterFields,
        sortBy: sortBy.toLowerCase(),
        sortOrder,
      })
    );
  }, [dispatch, limit, pageCount, sortBy, isSearching, sortOrder, sortBy]);

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

    dispatch(createNotification(newTicket));

    setModalOpen(false);
  };

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);

      if (tab === "2" && influencer) {
        dispatch(
          fetchTicketsRequest({
            limit: 10,
            pageCount: 0,
          })
        );
      }
    }
  };

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedState((prev) => ({ ...prev, [id]: true }));
    toast.success("Coupon Code copied!");
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [id]: false }));
    }, 1000);
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
            <h4 className="font-size-18" style={{ textTransform: "uppercase" }}>
              Opportunities
            </h4>
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
                  <Row className="d-flex flex-wrap">
                    {opportunities.length > 0 ? (
                      opportunities.map((opportunity) => (
                        <Col
                          sm="6"
                          md="4"
                          lg="3"
                          key={opportunity._id}
                          className="mb-4"
                        >
                          <Card className="overflow-hidden d-flex flex-column h-100">
                            {/* Image Section */}
                            <div
                              style={{
                                backgroundColor: "var(--primary-purple)",
                              }}
                            >
                              <Row>
                                <Col xs="12" className="p-3">
                                  <CardImg
                                    className="img-fluid"
                                    src={`${
                                      import.meta.env.VITE_APP_BASE_URL
                                    }/uploads/opportunityImage/${
                                      opportunity.imageUrl
                                    }`}
                                    alt={`Image for ${opportunity.title}`}
                                    style={{
                                      height: "100px",
                                      objectFit: "contain",
                                    }}
                                  />
                                </Col>
                              </Row>
                            </div>

                            <CardBody className="pt-0">
                              <Row>
                                <Col xs="12">
                                  <h5
                                    style={{ color: "var(--primary-purple)" }}
                                    className="mt-2"
                                  >
                                    {opportunity.title}
                                  </h5>
                                  <p>
                                    <strong>Brand:</strong> {opportunity.brand}
                                  </p>
                                  <p>
                                    <strong>Description:</strong>{" "}
                                    {opportunity.description}
                                  </p>
                                  <p>
                                    <strong>Type:</strong> {opportunity.type}
                                  </p>
                                  <p>
                                    <strong>Location:</strong>{" "}
                                    {opportunity.location}
                                  </p>
                                  <p>
                                    <strong>End Date:</strong>{" "}
                                    {new Date(
                                      opportunity.endDate
                                    ).toLocaleDateString()}
                                  </p>
                                  <p>
                                    <strong>Status:</strong>{" "}
                                    {opportunity.status}
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
                                      }}
                                      onClick={() =>
                                        handleCreateTicket(opportunity)
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
                      ))
                    ) : (
                      <p>No opportunities found.</p>
                    )}
                  </Row>
                </TabPane>

                {/* Applied Opportunities */}
                <TabPane tabId="2">
                  <Row>
                    {loading ? (
                      <p>Loading...</p>
                    ) : opportunitiesData.length > 0 ? (
                      opportunitiesData.map((ticket) => (
                        <Col
                          sm="6"
                          md="4"
                          lg="3"
                          key={ticket._id}
                          className="mb-4"
                        >
                          <Card className="overflow-hidden d-flex flex-column h-100">
                            {/* Image Section */}
                            <div
                              style={{
                                backgroundColor: "var(--primary-purple)",
                              }}
                            >
                              <Row>
                                <Col xs="12" className="p-3">
                                  <CardImg
                                    className="img-fluid"
                                    src={`${
                                      import.meta.env.VITE_APP_BASE_URL
                                    }/uploads/opportunityImage/${
                                      ticket.opportunity.imageUrl
                                    }`}
                                    alt={`Image for ${ticket.opportunity.title}`}
                                    style={{
                                      height: "100px",
                                      objectFit: "contain",
                                    }}
                                  />
                                </Col>
                              </Row>
                            </div>

                            {/* Card Body with Flexbox Layout */}
                            <CardBody className="pt-0 d-flex flex-column">
                              <Row>
                                <Col xs="12">
                                  <h5
                                    style={{ color: "var(--primary-purple)" }}
                                    className="mt-2"
                                  >
                                    {ticket.opportunity.title}
                                  </h5>
                                  <p>
                                    <strong>Brand:</strong>{" "}
                                    {ticket.opportunity.brand}
                                  </p>
                                  <p>
                                    <strong>Description:</strong>{" "}
                                    {ticket.opportunity.description}
                                  </p>
                                  <p>
                                    <strong>Type:</strong>{" "}
                                    {ticket.opportunity.type}
                                  </p>
                                  <p>
                                    <strong>Location:</strong>{" "}
                                    {ticket.opportunity.location}
                                  </p>
                                  <p>
                                    <strong>End Date:</strong>{" "}
                                    {new Date(
                                      ticket.opportunity.endDate
                                    ).toLocaleDateString()}
                                  </p>
                                  <p>
                                    <strong>Status:</strong>{" "}
                                    {ticket.opportunity.status}
                                  </p>
                                </Col>
                              </Row>
                              {/* Coupon Code Box fixed at the bottom */}
                              <div
                                className="mt-2 d-flex align-items-center"
                                style={{
                                  border: "2px dotted var(--primary-purple)",
                                  padding: "8px",
                                  margin: "8px 10px",
                                  borderRadius: "5px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginTop: "auto",
                                  position: "absolute",
                                  bottom: "0",
                                  left: "0",
                                  width : '50%',
                                  height: "40px",
                                  zIndex: "100",
                                  boxSizing: "border-box",
                                }}
                              >
                                <span
                                  className="me-2"
                                  style={{ fontWeight: "bold" }}
                                >
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
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor : "gray",
                                    border : "none"
                                  }}
                                >
                                  {copiedState[ticket._id] ? (
                                    <FaCheckCircle color="white" />
                                  ) : (
                                    <FaCopy />
                                  )}
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <p>No applied opportunities found.</p>
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(OpportunitiesPage);
