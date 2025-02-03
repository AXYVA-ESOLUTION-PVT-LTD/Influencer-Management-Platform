import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
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
  InputGroupText,
  InputGroup,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { setNewPassword } from "../../store/actions";

import profile from "../../assets/images/profile-img.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import logo from "../../assets/images/favicon/logo-sm.png";

const ChangePassword = (props) => {
  document.title = "Set New Password | Brandraise";
  const dispatch = useDispatch();
  const { resetError, resetSuccessMsg } = useSelector((state) => ({
    resetError: state.ForgetPassword.setNewPasswordError,
    resetSuccessMsg: state.ForgetPassword.setNewPasswordSuccessMsg,
  }));
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [localSuccessMsg, setLocalSuccessMsg] = useState(null);

  useEffect(() => {
    if (resetError) {
      setLocalError(resetError);
    }
    if (resetSuccessMsg) {
      setLocalSuccessMsg(resetSuccessMsg);
    }
  }, [resetError, resetSuccessMsg]);

  useEffect(() => {
    setLocalError(null);
    setLocalSuccessMsg(null);

    return () => {
      setLocalError(null);
      setLocalSuccessMsg(null);
    };
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      newPwd: "",
      confirmPwd: "",
    },
    validationSchema: Yup.object({
      newPwd: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/,
          "Password must be 8-20 characters, include uppercase, lowercase, number, and special character."
        )
        .required("Password is required"),

      confirmPwd: Yup.string()
        .oneOf([Yup.ref("newPwd"), null], "Passwords must match")
        .required("Please Confirm Your New Password"),
    }),
    onSubmit: (values) => {
      const token = localStorage.getItem("usertoken");
      const data = {
        token: token,
        password: values.newPwd,
        confirmPassword: values.confirmPwd,
      };
      dispatch(setNewPassword(data, props.router.navigate));
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
                    {localError && (
                      <Alert color="danger" className="section-space-top">
                        {localError}
                      </Alert>
                    )}

                    {/* Display success message */}
                    {localSuccessMsg && (
                      <Alert color="success" className="section-space-top">
                        {localSuccessMsg}
                      </Alert>
                    )}

                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">New Password</Label>
                        <InputGroup>
                          <Input
                            name="newPwd"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
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
                          <InputGroupText
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="cursor-pointer-dot"
                          >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroupText>
                        </InputGroup>
                        {validation.touched.newPwd &&
                          validation.errors.newPwd && (
                            <Alert color="danger" className="mt-2 p-1">
                              {validation.errors.newPwd}
                            </Alert>
                          )}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <InputGroup>
                          <Input
                            name="confirmPwd"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
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
                          <InputGroupText
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="cursor-pointer-dot"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroupText>
                        </InputGroup>
                        {validation.touched.confirmPwd &&
                          validation.errors.confirmPwd && (
                            <Alert color="danger" className="mt-2 p-1">
                              {validation.errors.confirmPwd}
                            </Alert>
                          )}
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

ChangePassword.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ChangePassword);
