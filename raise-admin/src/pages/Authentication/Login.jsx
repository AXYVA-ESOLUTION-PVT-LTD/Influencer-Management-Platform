import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import logo from "../../assets/images/tiktok-img.png";
//redux
import { useSelector, useDispatch } from "react-redux";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
  InputGroupText,
  InputGroup,
  FormGroup,
  Button,
  Spinner,
} from "reactstrap";
// Google Login
import { GoogleLogin } from "@react-oauth/google";

// Facebook Login
import FacebookLogin from "react-facebook-login";

// Role code
import ROLECODE from "../../constants/rolecode";

// Auth Mode
import AUTH_MODE from "../../constants/authmode";

// actions
import { loginUser } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import logo from "../../assets/images/favicon/logo-sm.png";

const Login = (props) => {
  //meta title
  document.title = "Login | Brandraise";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state) => state.Login);

  useEffect(() => {
    const token = localStorage.getItem("authUser");
    const user = localStorage.getItem("user");

    if (token && user) {
      const roleName = JSON.parse(user).roleId?.name?.toLowerCase();
      navigate(`/overview/${roleName}`);
    }
  }, []);

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const payload = {
      token,
      mode: AUTH_MODE.GOOGLE,
      roleCode: ROLECODE["Influencer"],
      email: "",
      password: "",
    };

    dispatch(loginUser(payload, props.router.navigate));
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google login failed", error);
  };

  // Handle Facebook Login
  // const handleFacebookLoginSuccess = (response) => {
  //   if (response.accessToken) {
  //     const payload = {
  //       token: response.accessToken,
  //       mode: AUTH_MODE.FACEBOOK,
  //       roleCode: ROLECODE["Brand"],
  //       email: response.email,
  //       password: "",
  //     };
  //     dispatch(loginUser(payload, navigate)); // Dispatch the login action to send data to server
  //   } else {
  //     console.error("Facebook login failed", response);
  //   }
  // };

  // const handleFacebookLoginFailure = (error) => {
  //   console.error("Facebook login failed", error);
  // };

  const handleTikTokLogin = () => {
    const jwtToken = localStorage.getItem("authUserId");
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
    const TIKTOK_AUTH_ENDPOINT = `/tiktok/auth/`;
    const tiktokAuthUrl = `${BASE_URL}${TIKTOK_AUTH_ENDPOINT}`;
    window.location.href = tiktokAuthUrl;
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please Enter Your Email"),
      password: Yup.string()
        .min(6, "Password must be at least 8 characters")
        .max(20, "Password cannot exceed 20 characters")
        .required("Please enter your password"),
    }),
    onSubmit: (values) => {
      const payload = {
        token: "",
        mode: "",
        roleCode: "",
        email: values.email,
        password: values.password,
      };

      dispatch(loginUser(payload, props.router.navigate));
    },
  });

  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <React.Fragment>
      <div
        className="d-flex min-vh-100 align-items-center justify-content-center bg-light w-100"
      >
        <Card
          className="shadow-lg login-page"
        >
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
              className="d-flex flex-column align-items-center justify-content-between h-100"
            >
              <div className="w-100 d-flex justify-content-end  text-right shadow-sm p-3">
                <Button
                  color="primary"
                  className="w-auto rounded-0"
                  onClick={handleNavigateToRegister}
                  style={{
                    borderColor: "var(--primary-purple)",
                    color: "var(--primary-purple)",
                    backgroundColor: "var(--primary-white)",
                  }}
                  size="lg"
                >
                  Influencer Register
                </Button>
              </div>
              <CardBody className="d-flex flex-column align-items-center justify-content-center">
                <div>
                  <h2 className="text-left mb-3">Login to Account</h2>
                  <h6 className="text-left mb-4">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-primary fw-bold">
                      Register
                    </Link>
                  </h6>

                  {error && <Alert color="danger">{error}</Alert>}

                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        validation.handleSubmit();
                      }
                    }}
                  >
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        value={validation.values.email || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.email && validation.errors.email
                        }
                      />
                      {validation.touched.email && validation.errors.email && (
                        <Alert color="danger" className="mt-2 p-1">
                          {validation.errors.email}
                        </Alert>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label for="password">Password</Label>
                      <InputGroup>
                        <Input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder="Enter password"
                          value={validation.values.password || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                          }
                        />
                        <InputGroupText
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </InputGroupText>
                      </InputGroup>
                      {validation.touched.password &&
                        validation.errors.password && (
                          <Alert color="danger" className="mt-2 p-1">
                            {validation.errors.password}
                          </Alert>
                        )}
                    </FormGroup>

                    <div className="d-flex justify-content-between align-items-center">
                      <FormGroup check>
                        <Input type="checkbox" id="remember" />
                        <Label for="remember" check>
                          Remember me
                        </Label>
                      </FormGroup>
                      <Link to="/forgot-password" className="text-primary">
                        Forgot password?
                      </Link>
                    </div>

                    {/* <Button color="primary" block className="mt-4" type="submit">
                    Log In
                  </Button> */}
                  </Form>

                  {/* <div className="text-center mt-4">
                    <p className="mb-3">OR</p>
                    <div className="d-flex justify-content-center">
                      <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginFailure}
                      />
                    </div>
                  </div> */}
                </div>
              </CardBody>
              {/* Footer */}
              <div className="w-100 d-flex justify-content-end text-right shadow-lg p-3">
                <Button
                  color="primary"
                  className="w-auto rounded-0"
                  onClick={() => {
                    validation.handleSubmit();
                  }}
                  size="lg"
                  disabled={loading}
                >
                  Login {loading && <Spinner size="sm" color="light" />}
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
