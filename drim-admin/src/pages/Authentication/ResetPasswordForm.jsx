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
import { Link } from "react-router-dom";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/Logo.png";
import withRouter from "../../components/Common/withRouter";
const ResetPasswordForm = (props) => {
  //meta title
  document.title = "Reset Password | Drim";

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldPwd: "",
      newPwd: "",
    },
    validationSchema: Yup.object({
      oldPwd: Yup.string()
        .required("Please Enter Your Old Password")
        .min(6, "Password must be at least 6 characters"),
      newPwd: Yup.string()
        .required("Please Enter Your New Password")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: (values) => {
      console.log(values);
      // Handle form submission here if needed
    },
  });

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
                        <p>Please enter your old and new password below.</p>
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
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">Old Password</Label>
                        <Input
                          name="oldPwd"
                          className="form-control"
                          placeholder="Enter old password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.oldPwd || ""}
                          invalid={
                            validation.touched.oldPwd &&
                            validation.errors.oldPwd
                              ? true
                              : false
                          }
                        />
                        {validation.touched.oldPwd &&
                        validation.errors.oldPwd ? (
                          <FormFeedback type="invalid">
                            {validation.errors.oldPwd}
                          </FormFeedback>
                        ) : null}
                      </div>

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

ResetPasswordForm.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ResetPasswordForm);
