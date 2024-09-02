import React, { useEffect } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback } from "reactstrap";
import PropTypes from "prop-types";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { registerUser, apiError, registerUserFailed } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

// import images
import profileImg from "../../assets/images/profile-img.png";
// import logoImg from "../../assets/images/favicon/logo-sm.png";
import withRouter from "../../components/Common/withRouter";

const Register = (props) => {
  document.title = "Register | Raise";
  
  const dispatch = useDispatch();
  const history = useNavigate();
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roleId  : '66c6c3f8380499ba2b85f317'
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      lastName: Yup.string().required("Please Enter Your Last Name"),
      email: Yup.string().email("Invalid email address").required("Please Enter Your Email"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(registerUser(values , props.router.navigate));
    },
  });

  const { user, registrationError, loading } = useSelector((state) => ({
    user: state.Account.user,
    registrationError: state.Account.registrationError,
    loading: state.Account.loading,
  }));

  
  useEffect(() => {
    dispatch(registerUserFailed(""));
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Free Register</h5>
                        <p>Get your free Raise account now.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          {/* <img src={logoImg} alt="" className="rounded-circle" height="34" /> */}
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
                      {user && user ? (
                        <Alert color="success">Register User Successfully</Alert>
                      ) : null}

                      {registrationError ? (
                        <Alert color="danger">{registrationError}</Alert>
                      ) : null}

                      <div className="mb-3">
                        <Label className="form-label">First Name</Label>
                        <Input
                          name="firstName"
                          type="text"
                          placeholder="Enter first name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.firstName || ""}
                          invalid={validation.touched.firstName && validation.errors.firstName ? true : false}
                        />
                        {validation.touched.firstName && validation.errors.firstName ? (
                          <FormFeedback type="invalid">{validation.errors.firstName}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Last Name</Label>
                        <Input
                          name="lastName"
                          type="text"
                          placeholder="Enter last name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.lastName || ""}
                          invalid={validation.touched.lastName && validation.errors.lastName ? true : false}
                        />
                        {validation.touched.lastName && validation.errors.lastName ? (
                          <FormFeedback type="invalid">{validation.errors.lastName}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={validation.touched.email && validation.errors.email ? true : false}
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={validation.touched.password && validation.errors.password ? true : false}
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-4">
                        <button className="btn btn-primary btn-block" type="submit">
                          Register
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="mb-0">
                          By registering you agree to the Raise{" "}
                          <Link to="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
                    {" "}
                    Login
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

export default withRouter(Register);

Register.propTypes = {
  history: PropTypes.object,
};
