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
  FormGroup,
  Label,
  FormFeedback,
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
  trackOpportunityViewRequest,
} from "../../store/opportunity/actions";
import {
  createNotification,
  createPublication,
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
  } = useSelector((state) => state.Opportunity);
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
  const [viewDetailsModelOpen, setViewDetailsModelOpen] = useState(false);
  const [viewDetailsOpportunity,setViewDetailsOpportunity] = useState(null);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [publicationModalOpen, setPublicationModalOpen] = useState(false);
  const [publicationType, setPublicationType] = useState("");
  const [showScreenshotField, setShowScreenshotField] = useState(false);
  const [publicationLink, setPublicationLink] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [errors, setErrors] = useState({});
  const [descriptionError, setDescriptionError] = useState("");
  const [user, setUser] = useState(null);
  const USER_ID = import.meta.env.VITE_ADMIN_ID;

  document.title = "Opportunity | Brandraise ";

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setPublicationType(selectedType);
    setShowScreenshotField(selectedType === "story");
  
    // Clear errors when a valid type is selected
    setErrors((prevErrors) => ({
      ...prevErrors,
      type: selectedType ? "" : prevErrors.type,
    }));
  };

  const handlePublicationLinkChange = (e) => {
    const value = e.target.value;
    setPublicationLink(value);
  
    // Remove error when user enters a valid URL
    setErrors((prevErrors) => ({
      ...prevErrors,
      link: value.startsWith("https://") ? "" : prevErrors.link,
    }));
  };
  
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
  
      if (!allowedTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          screenshot: "Only JPEG and PNG files are allowed.",
        }));
        setScreenshot(null);
        e.target.value = ""; 
        return;
      } else {
        setScreenshot(file);
        
        // Remove error when a valid file type is selected
        setErrors((prevErrors) => ({
          ...prevErrors,
          screenshot: "",
        }));
      }
    }
  };
  
  const publicationOptions = {
    Tiktok: [
      { value: "post", label: "Post" }
    ],
    Instagram: [
      { value: "reel", label: "Reel" },
      { value: "post", label: "Post" },
      { value: "story", label: "Story" },
    ],
    Facebook: [
      { value: "post", label: "Post" },
      { value: "video", label: "Video" },
    ],
    YouTube: [{ value: "video", label: "Video" }],
  };

  const options = user ? publicationOptions[user.platform] || [] : [];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setRole(user?.roleId?.name || "User");
      setInfluencer(user._id);
      setUser(user);
    }
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
    if (!description.trim()) {
      setDescriptionError("Description is required.");
      return;
    }

    if (descriptionError) {
      return;
    }

    setDescriptionError("");

    dispatch(
      createTicketRequest({
        influencerId: influencer,
        opportunityId: selectedOpportunity._id,
        title: `Applied for ${selectedOpportunity?.title}`,
        description,
      })
    );

    dispatch(
      getOpportunity({
        limit,
        pageCount,
      })
    );

    const newNotification = {
      userId: USER_ID,
      title: `Applied for ${selectedOpportunity.title}`,
      message: description,
    };

    dispatch(createNotification(newNotification));

    setAppliedOpportunities((prevApplied) => [
      ...prevApplied,
      selectedOpportunity._id,
    ]);
    
    setDescription("");
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

  const handleViewDetails = (opportunity) => {
    dispatch(trackOpportunityViewRequest(opportunity._id));
    setViewDetailsOpportunity(opportunity);
    setViewDetailsModelOpen(true);
  };

  const handleDetailsView = (opportunity) => {
    dispatch(trackOpportunityViewRequest(opportunity?.opportunity?._id));
    setDetailsOpportunity(opportunity);
    setDetailsModalOpen(true);
  };

  const handleCreateTicket = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setModalOpen(true);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9 ]*$/;

    if (value.length < 10 || value.length > 50) {
      setDescriptionError("Description must be between 10 to 50 characters.");
    } else if (!regex.test(value)) {
      setDescriptionError("Special characters are not allowed.");
    } else {
      setDescriptionError("");
    }

    setDescription(value);
  };

  const getImageUrl = (
    value,
    basePath = import.meta.env.VITE_APP_BASE_IMAGE_URL
  ) => {
    return value.startsWith("http") || value.startsWith("https")
      ? value
      : `${basePath}${value}`;
  };

  const publicationToggleModal = (ticket) => {
    setSelectedTicket(ticket);
    setErrors({});
    setPublicationType("");
    setShowScreenshotField(false);
    setPublicationLink("");
    setScreenshot(null);
    setPublicationModalOpen(!publicationModalOpen);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!publicationType) newErrors.type = "Publication type is required.";
    if (!publicationLink) {
      newErrors.link = "Publication link is required.";
    } else if (!publicationLink.startsWith("https://")) {
      newErrors.link = "Publication link must start with 'https://'";
    }
    if (showScreenshotField && !screenshot) {
      newErrors.screenshot = "Screenshot is required.";
    } else if (screenshot) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(screenshot.type)) {
        newErrors.screenshot = "Only JPEG and PNG files are allowed.";
      }
    }
    return newErrors;
  };
  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (showScreenshotField && screenshot) {
      const formData = new FormData();
      formData.append("opportunityId", selectedTicket.opportunity._id);
      formData.append("type", publicationType);
      formData.append("publicationLink", publicationLink);
      formData.append("image", screenshot);

      dispatch(createPublication({ formData, isFormData: true }));
    } else {
      const payload = {
        selectedTicket,
        publicationType,
        publicationLink,
      };

      dispatch(createPublication({ payload, isFormData: false }));
    }

    const influencerName = `${selectedTicket.influencerData?.firstName || ""} ${
      selectedTicket.influencerData?.lastName || ""
    }`.trim();
    const newNotification = {
      userId: USER_ID,
      title: `Add new Publication by ${influencerName}`,
      message: `A new publication has been added by the influencer ${influencerName}.`,
    };

    dispatch(createNotification(newNotification));
    setErrors({});
    setPublicationType("");
    setShowScreenshotField(false);
    setPublicationLink("");
    setScreenshot(null);
    setPublicationModalOpen(false);
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
                    Opportunity
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
                  {loading ? (
                    <div className="no-opportunities-heading">
                      <Spinner style={{ color: "var(--primary-purple)" }} />
                    </div>
                  ) : filteredOpportunities?.length > 0 ? (
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
                                      src={getImageUrl(
                                        opportunity.imageUrl,
                                        `${
                                          import.meta.env.VITE_APP_BASE_URL
                                        }/uploads/opportunityImage/`
                                      )}
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
                                    <Col xs="12" className="mt-1">
                                      <Button
                                        color="primary"
                                        className="w-100"
                                        onClick={() =>
                                          handleViewDetails(opportunity)
                                        }
                                      >
                                        View More
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
                                      src={getImageUrl(
                                        ticket.opportunity.imageUrl,
                                        `${
                                          import.meta.env.VITE_APP_BASE_URL
                                        }/uploads/opportunityImage/`
                                      )}
                                      alt={`Image for ${ticket.opportunity.title}`}
                                    />
                                  </Col>
                                </Row>
                              </div>

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
                                <div className="d-flex flex-column justify-content-center align-items-center mt-3 gap-1">
                                  <Button
                                    color="primary"
                                    className="w-100"
                                    onClick={() => handleDetailsView(ticket)}
                                  >
                                    View More
                                  </Button>
                                  <Button
                                    color="primary"
                                    className="w-100"
                                    onClick={() =>
                                      publicationToggleModal(ticket)
                                    }
                                    disabled={
                                      !ticket.couponCode ||
                                      ticket.couponCode === "N/A"
                                    }
                                  >
                                    Add Publication
                                  </Button>
                                </div>
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

          <Modal
            isOpen={modalOpen}
            toggle={() => {
              setModalOpen(!modalOpen);
              setDescriptionError("");
            }}
          >
            <ModalHeader
              toggle={() => {
                setModalOpen(!modalOpen);
                setDescriptionError("");
              }}
            >
              Apply for {selectedOpportunity ? selectedOpportunity.title : ""}
            </ModalHeader>
            <ModalBody>
              <Input
                type="textarea"
                placeholder="Enter description for your ticket"
                value={description}
                onChange={handleDescriptionChange}
              />
              {descriptionError && (
                <p style={{ color: "red" }}>{descriptionError}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onClick={() => {
                  setModalOpen(false);
                  setDescription("");
                  setDescriptionError("");
                }}
              >
                Cancel
              </Button>
              <Button color="primary" onClick={handleTicketCreation}>
                Confirm
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={viewDetailsModelOpen}
            toggle={() => setViewDetailsModelOpen(!viewDetailsModelOpen)}
            size="lg"
          >
            <ModalHeader toggle={() => setViewDetailsModelOpen(!viewDetailsModelOpen)}>
              {viewDetailsOpportunity?.title || "Opportunity Details"}
            </ModalHeader>
            <ModalBody>
              {/* Image Section */}
              {viewDetailsOpportunity?.imageUrl && (
                <div className="text-center mb-3">
                  <img
                    src={getImageUrl(viewDetailsOpportunity.imageUrl)}
                    alt={`Image for ${viewDetailsOpportunity.title}`}
                    className="img-fluid rounded opportunity-image"
                  />
                </div>
              )}

              {/* Opportunity Details */}
              <Row>
                <Col xs="12">
                  <div className="model-format">
                    <p>
                      <strong>Brand</strong>
                    </p>
                    <p>: {viewDetailsOpportunity?.brand}</p>

                    <p>
                      <strong>Description</strong>
                    </p>
                    <p>: {viewDetailsOpportunity?.description}</p>

                    <p>
                      <strong>Type</strong>
                    </p>
                    <p>: {viewDetailsOpportunity?.type}</p>

                    <p>
                      <strong>Location</strong>
                    </p>
                    <p>: {viewDetailsOpportunity?.location}</p>

                    <p>
                      <strong>End Date</strong>
                    </p>
                    <p>
                      :{" "}
                      {new Date(
                        viewDetailsOpportunity?.endDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>Status:</strong>
                    </p>
                    <p>
                      :{" "}
                      <span
                        className={`badge ${
                          viewDetailsOpportunity?.status === "Active"
                            ? "badge-active"
                            : "badge-inactive"
                        }`}
                      >
                        {viewDetailsOpportunity?.status}
                      </span>
                    </p>
                  </div>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onClick={() => setViewDetailsModelOpen(false)}
              >
                Close
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
                    src={getImageUrl(detailsOpportunity.opportunity.imageUrl)}
                    alt={`Image for ${detailsOpportunity.opportunity.title}`}
                    className="img-fluid rounded opportunity-image"
                  />
                </div>
              )}

              {/* Opportunity Details */}
              <Row>
                <Col xs="12">
                  <div className="model-format">
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

          <Modal isOpen={publicationModalOpen} toggle={publicationToggleModal}>
            <ModalHeader toggle={publicationToggleModal}>
              Add Publication for Ticket
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="type">Type</Label>
                <Input
                  type="select"
                  id="type"
                  value={publicationType}
                  onChange={handleTypeChange}
                  invalid={!!errors.type}
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Input>
                <FormFeedback>{errors.type}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="link">Publication Link</Label>
                <Input
                  type="url"
                  id="link"
                  placeholder="Enter publication link"
                  value={publicationLink}
                  onChange={handlePublicationLinkChange}
                  invalid={!!errors.link}
                />
                <FormFeedback>{errors.link}</FormFeedback>
              </FormGroup>

              {showScreenshotField && (
                <FormGroup>
                  <Label for="screenshot">Upload Screenshot</Label>
                  <Input
                    type="file"
                    id="screenshot"
                    onChange={handleScreenshotChange}
                    invalid={!!errors.screenshot}
                  />
                  <FormFeedback>{errors.screenshot}</FormFeedback>
                </FormGroup>
              )}

              {/* <FormGroup>
                <Label for="screenshot">Upload Screenshot</Label>
                <Input
                  type="file"
                  id="screenshot"
                  onChange={(e) => setScreenshot(e.target.files[0])}
                  invalid={!!errors.screenshot}
                />
                <FormFeedback>{errors.screenshot}</FormFeedback>
              </FormGroup> */}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={publicationToggleModal}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit}>
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
