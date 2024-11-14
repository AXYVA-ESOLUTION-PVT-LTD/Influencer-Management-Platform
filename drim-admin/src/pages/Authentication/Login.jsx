import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

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
} from "reactstrap";
// Google Login
import { GoogleLogin } from "@react-oauth/google";

// Facebook Login
import FacebookLogin from 'react-facebook-login';

// Role code
import ROLECODE from "../../constants/rolecode";

// Auth Mode
import AUTH_MODE from "../../constants/authmode";

// actions
import { loginUser } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
// import logo from "../../assets/images/favicon/logo-sm.png";

const Login = (props) => {
  //meta title
  document.title = "Login | Brandraise";
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      roleCode: ROLECODE["Brand"],
      email: "",
      password: "",
    };
    console.log("google ",payload);
    
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

  // const handleTikTokLogin = (response) => {
  //   if (response.access_token) {
  //     const payload = {
  //       token: response.access_token,
  //       mode: AUTH_MODE.TIKTOK,
  //       roleCode: ROLECODE["Brand"],
  //       email: response.email,
  //       password: "",
  //     };
  //     dispatch(loginUser(payload, props.router.navigate));
  //   } else {
  //     console.error("TikTok login failed");
  //   }
  // };

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
        .min(6, "Password must be at least 6 characters")
        .required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      const payload = {
        token: "",
        mode: "",
        roleCode: "",
        email: values.email,
        password: values.password,
      };
      console.log("manual login",payload);
      
      dispatch(loginUser(payload, props.router.navigate));
    },
  });

  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to Brandraise.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          {/* <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          /> */}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Log In
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                          <p className="me-2">Or login with:</p>
                          <div className="d-flex flex-column justify-content-center align-items-center gap-3">
                              <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginFailure}
                              />
                            {/* <FacebookLogin
                              appId="946726573608245"
                              fields="name,email,picture"
                              callback={handleFacebookLoginSuccess}
                              onFailure={handleFacebookLoginFailure} 
                            /> */}
                          </div>
                      </div>
                      <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Don&#39;t have an account ?{" "}
                  <Link to="/register" className="fw-medium text-primary">
                    {" "}
                    Signup now{" "}
                  </Link>{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
