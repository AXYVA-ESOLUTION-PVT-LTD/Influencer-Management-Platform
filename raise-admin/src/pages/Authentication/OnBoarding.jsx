import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
  Button,
  Alert,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";

const OnBoarding = (props) => {
  document.title = "Register | Brandraise";
  const navigate = useNavigate();
  const validationStep2 = useFormik({
    enableReinitialize: true,
    initialValues: {
      platform: "",
    },
    validationSchema: Yup.object({
      platform: Yup.string().required("Please Select a Platform"), // Platform validation
    }),
  });

  const handleSubmit = async () => {
    const errorsStep2 = await validationStep2.validateForm();
    if (Object.keys(errorsStep2).length === 0) {
      const mergedData = {
        ...validationStep2.values,
      };

      // Handle specific actions based on selected platform
      switch (mergedData.platform) {
        case "Tiktok":
          handleTikTokLogin(); // Call TikTok login if selected
          break;
        default:
          // dispatch(updateUserName(mergedData, history)); // Handle other platform actions
          console.log("Another Platform");

          break;
      }
    } else {
      validationStep2.setTouched({
        platform: true,
      });
    }
  };

  const handleTikTokLogin = () => {
    const jwtToken = localStorage.getItem("authUser");
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
    const TIKTOK_AUTH_ENDPOINT = `/tiktok/auth/${jwtToken}`;
    const tiktokAuthUrl = `${BASE_URL}${TIKTOK_AUTH_ENDPOINT}`;
    window.location.href = tiktokAuthUrl;
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <React.Fragment>
      <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light w-100">
        <Card className="shadow-lg login-page">
          <Row className="g-0 h-100">
            <Col
              xs={12}
              md={6}
              className="bg-primary text-white p-4 d-flex flex-column align-items-start justify-content-between d-none d-md-flex"
            >
              <h1 className="fw-bold mb-3 text-center text-md-start">
                BrandRaise
              </h1>

              <div className="text-center text-md-start mt-5">
                <h1 className="fw-bold mb-3">Empowering Creators Worldwide</h1>
                <h1 className="fw-bold mb-3 text-center text-md-start">
                  Partnered with Leading Brands
                </h1>
              </div>

              <div className="company-logo-slider">
                <h5 className="mb-1 text-center text-md-start">
                  Our partners include:
                </h5>
                <ul className="list-inline mt-2 text-center text-md-start">
                  <li className="list-inline-item">
                    <img
                      src="path-to-amazon-logo.png"
                      alt="Amazon logo"
                      height="30"
                    />
                  </li>
                  <li className="list-inline-item">
                    <img
                      src="path-to-nike-logo.png"
                      alt="Nike logo"
                      height="30"
                    />
                  </li>
                  <li className="list-inline-item">
                    <img
                      src="path-to-coca-cola-logo.png"
                      alt="Coca-Cola logo"
                      height="30"
                    />
                  </li>
                  <li className="list-inline-item">
                    <img
                      src="path-to-apple-logo.png"
                      alt="Apple logo"
                      height="30"
                    />
                  </li>
                  <li className="list-inline-item">
                    <img
                      src="path-to-microsoft-logo.png"
                      alt="Microsoft logo"
                      height="30"
                    />
                  </li>
                </ul>
              </div>
            </Col>

            <Col
              xs={12}
              md={6}
              className="d-flex flex-column align-items-center justify-content-between"
            >
              <div className="w-100 d-flex justify-content-end  text-right shadow-sm p-3">
                <Button
                  color="primary"
                  className="w-auto rounded-0"
                  onClick={handleNavigateToLogin}
                  style={{
                    borderColor: "var(--primary-purple)",
                    color: "var(--primary-purple)",
                    backgroundColor: "var(--primary-white)",
                  }}
                  size="lg"
                >
                  Login
                </Button>
              </div>
              <CardBody className="d-flex flex-column align-items-center justify-content-center">
                <div>
                  <h2 className="text-left mb-4">Select Platform</h2>
                  <h6 className="text-left mb-4">
                    Already selected a platform?{" "}
                    <Link to="/login" className="text-primary fw-bold">
                      Log In
                    </Link>
                  </h6>

                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                      return false;
                    }}
                  >
                    <div className="mb-3">
                      <Label className="form-label">Select Your Platform</Label>

                      <div className="d-flex justify-content-center">
                        <Row className="w-100">
                          <Col
                            xs="12"
                            sm="6"
                            className="d-flex justify-content-center mb-1 p-1"
                          >
                            <div
                              className={`d-flex align-items-center platform-option p-2 w-100 rounded border ${
                                validationStep2.values.platform === "Youtube"
                                  ? "border-primary border-2"
                                  : "border-dark"
                              }`}
                              onClick={() =>
                                validationStep2.setFieldValue(
                                  "platform",
                                  "Youtube"
                                )
                              }
                            >
                              <input
                                type="radio"
                                id="youtube"
                                name="platform"
                                value="Youtube"
                                className="me-2"
                                onChange={validationStep2.handleChange}
                                onBlur={validationStep2.handleBlur}
                                checked={
                                  validationStep2.values.platform === "Youtube"
                                }
                              />
                              <Label
                                htmlFor="youtube"
                                className="d-block text-center mb-0"
                              >
                                YouTube
                              </Label>
                            </div>
                          </Col>

                          <Col
                            xs="12"
                            sm="6"
                            className="d-flex justify-content-center mb-1 p-1"
                          >
                            <div
                              className={`d-flex align-items-center platform-option p-2 w-100 rounded border ${
                                validationStep2.values.platform === "Instagram"
                                  ? "border-primary border-2"
                                  : "border-dark"
                              }`}
                              onClick={() =>
                                validationStep2.setFieldValue(
                                  "platform",
                                  "Instagram"
                                )
                              }
                            >
                              <input
                                type="radio"
                                id="instagram"
                                name="platform"
                                value="Instagram"
                                className="me-2"
                                onChange={validationStep2.handleChange}
                                onBlur={validationStep2.handleBlur}
                                checked={
                                  validationStep2.values.platform ===
                                  "Instagram"
                                }
                              />
                              <Label
                                htmlFor="instagram"
                                className="d-block text-center mb-0"
                              >
                                Instagram
                              </Label>
                            </div>
                          </Col>

                          <Col
                            xs="12"
                            sm="6"
                            className="d-flex justify-content-center mb-1 p-1"
                          >
                            <div
                              className={`d-flex align-items-center platform-option p-2 w-100 rounded border ${
                                validationStep2.values.platform === "Tiktok"
                                  ? "border-primary border-2"
                                  : "border-dark"
                              }`}
                              onClick={() =>
                                validationStep2.setFieldValue(
                                  "platform",
                                  "Tiktok"
                                )
                              }
                            >
                              <input
                                type="radio"
                                id="tiktok"
                                name="platform"
                                value="Tiktok"
                                className="me-2"
                                onChange={validationStep2.handleChange}
                                onBlur={validationStep2.handleBlur}
                                checked={
                                  validationStep2.values.platform === "Tiktok"
                                }
                              />
                              <Label
                                htmlFor="tiktok"
                                className="d-block text-center mb-0"
                              >
                                Tiktok
                              </Label>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {validationStep2.touched.platform &&
                        validationStep2.errors.platform && (
                          <Alert color="danger" className="mt-2 p-1">
                            {validationStep2.errors.platform}
                          </Alert>
                        )}
                    </div>

                  </Form>
                </div>
              </CardBody>
              <div
                className="w-100 d-flex justify-content-end text-right shadow-lg p-3"
              >
                <Button
                  color="primary"
                  className="w-auto rounded-0"
                  onClick={handleSubmit}
                  size="lg"
                >
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default withRouter(OnBoarding);

OnBoarding.propTypes = {
  history: PropTypes.object,
};
