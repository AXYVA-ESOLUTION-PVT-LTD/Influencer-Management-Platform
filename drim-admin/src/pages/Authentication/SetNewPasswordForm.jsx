import PropTypes from "prop-types";
import React from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userResetPassword } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/Logo.png";

const SetNewPasswordForm = (props) => {
  //meta title
  document.title = "Forget Password | Drim";
  const dispatch = useDispatch();
  
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      otp: "",
      newPwd: "",
      confirmPwd: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please Enter Your Email")
        .email("Invalid email format"),
      otp: Yup.string()
        .required("Please Enter the OTP")
        .length(6, "OTP must be exactly 6 digits"),
      newPwd: Yup.string()
        .required("Please Enter Your New Password")
        .min(6, "Password must be at least 6 characters"),
      confirmPwd: Yup.string()
        .oneOf([Yup.ref("newPwd"), null], "Passwords must match")
        .required("Please Confirm Your New Password"),
    }),
    onSubmit: (values) => {
      dispatch(userResetPassword(values, props.router.navigate));
    },
  });

  const { resetError, resetSuccessMsg } = useSelector((state) => ({
    resetError: state.resetPassword.resetError,
    resetSuccessMsg: state.resetPassword.resetSuccessMsg,
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
                        <h5 className="text-primary">Reset Your Password</h5>
                        <p>Please enter your new password below.</p>
                      </div>
                    </Col>

                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    {resetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {resetError}
                      </Alert>
                    ) : null}
                    {resetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {resetSuccessMsg}
                      </Alert>
                    ) : null}

                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {/* <div className="mb-3">
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
                        <Label className="form-label">OTP</Label>
                        <Input
                          name="otp"
                          className="form-control"
                          placeholder="Enter OTP"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.otp || ""}
                          invalid={
                            validation.touched.otp && validation.errors.otp
                              ? true
                              : false
                          }
                        />
                        {validation.touched.otp && validation.errors.otp ? (
                          <FormFeedback type="invalid">
                            {validation.errors.otp}
                          </FormFeedback>
                        ) : null}
                      </div> */}

                      <div className="mb-3">
                        <Label className="form-label">New Password</Label>
                        <Input
                          name="newPwd"
                          className="form-control"
                          placeholder="Enter new password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.newPwd || ""}
                          invalid={
                            validation.touched.newPwd &&
                            validation.errors.newPwd
                              ? true
                              : false
                          }
                        />
                        {validation.touched.newPwd &&
                        validation.errors.newPwd ? (
                          <FormFeedback type="invalid">
                            {validation.errors.newPwd}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="confirmPwd"
                          className="form-control"
                          placeholder="Confirm new password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.confirmPwd || ""}
                          invalid={
                            validation.touched.confirmPwd &&
                            validation.errors.confirmPwd
                              ? true
                              : false
                          }
                        />
                        {validation.touched.confirmPwd &&
                        validation.errors.confirmPwd ? (
                          <FormFeedback type="invalid">
                            {validation.errors.confirmPwd}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md"
                            type="submit"
                          >
                            Reset
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Drim. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Demo
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

SetNewPasswordForm.propTypes = {
  history: PropTypes.object,
};

export default withRouter(SetNewPasswordForm);
