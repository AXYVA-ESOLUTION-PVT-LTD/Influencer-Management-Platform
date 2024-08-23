import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Input,
  Label,
  Form,
  Alert,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../store/actions"; // Assuming the action is named verifyOtp

// Import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/Logo.png";

const VerifyOtpForm = (props) => {
  // Meta title
  document.title = "Verify OTP | Drim";

  const dispatch = useDispatch();
  const navigate = props.router.navigate;
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // You'll need to get the email, maybe from props or state

  const { verifyOtpError, verifyOtpSuccessMsg } = useSelector(state => state.verifyOtp);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ email, otp, history: navigate }));
  };

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
                        <h5 className="text-primary">Verify OTP</h5>
                        <p>Enter the OTP sent to your email.</p>
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
                    {verifyOtpError && (
                      <Alert color="danger">{verifyOtpError}</Alert>
                    )}
                    {verifyOtpSuccessMsg && (
                      <Alert color="success">{verifyOtpSuccessMsg}</Alert>
                    )}
                    <Form className="form-horizontal" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <Label className="form-label">OTP</Label>
                        <Input
                          name="otp"
                          className="form-control"
                          placeholder="Enter OTP"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>

                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md"
                            type="submit"
                          >
                            Verify OTP
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

VerifyOtpForm.propTypes = {
  history: PropTypes.object,
};

export default VerifyOtpForm;
