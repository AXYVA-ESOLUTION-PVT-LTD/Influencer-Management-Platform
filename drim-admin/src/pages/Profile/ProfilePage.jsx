import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Alert,
} from "reactstrap";
import classnames from "classnames";
// Formik Validation
import { useFormik } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../store/user/actions";
import { API_URL } from "../../helpers/api_helper";
import ResetPassword from "../Authentication/ResetPassword";

const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ProfilePage = () => {
  const dispatch = useDispatch();

  //meta title
  document.title = "Profile | Raise";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setProfilePhoto(user.profilePhoto);
    }
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      profilePhoto: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      lastName: Yup.string().required("Please Enter Your Last Name"),
      profilePhoto: Yup.mixed(),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }
      dispatch(updateProfile(formData));
    },
  });

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Raise" breadcrumbItem="Personal account" />
          <Row>
            <Col sm="12">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggle("1");
                    }}
                  >
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggle("2");
                    }}
                  >
                    Security
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col lg="12">
                      <Card>
                        <CardBody>
                          <div className="d-flex">
                            <div className="ms-3">
                              <img
                                src={
                                  profilePhoto
                                    ? profilePhoto instanceof File
                                      ? URL.createObjectURL(profilePhoto)
                                      : `${API_URL}/uploads/${profilePhoto}`
                                    : avatar
                                }
                                alt="Profile"
                                className="avatar-md rounded-circle img-thumbnail"
                              />
                            </div>
                            <div className="flex-grow-1 align-self-center">
                              <div className="text-muted">
                                <h5>{name}</h5>
                                <p className="mb-1">{email}</p>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  <h4 className="card-title mb-4">Change User Profile</h4>
                  <Card>
                    <CardBody>
                      <Form
                        className="form-horizontal"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="form-group">
                          <Label className="form-label">First Name</Label>
                          <Input
                            name="firstName"
                            className="form-control"
                            placeholder="Enter First Name"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.firstName || ""}
                            invalid={
                              validation.touched.firstName &&
                              validation.errors.firstName
                            }
                          />
                          {validation.touched.firstName &&
                          validation.errors.firstName ? (
                            <FormFeedback type="invalid">
                              {validation.errors.firstName}
                            </FormFeedback>
                          ) : null}
                          <Label className="form-label">Last Name</Label>
                          <Input
                            name="lastName"
                            className="form-control"
                            placeholder="Enter Last Name"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.lastName || ""}
                            invalid={
                              validation.touched.lastName &&
                              validation.errors.lastName
                            }
                          />
                          {validation.touched.lastName &&
                          validation.errors.lastName ? (
                            <FormFeedback type="invalid">
                              {validation.errors.lastName}
                            </FormFeedback>
                          ) : null}

                          <Label className="form-label">Email</Label>
                          <Input
                            name="email"
                            className="form-control "
                            placeholder="Enter Email"
                            type="email"
                            disable={true}
                            value={email}
                          />
                          <Label className="form-label">Profile Photo</Label>
                          <Input
                            name="profilePhoto"
                            className="form-control"
                            type="file"
                            onChange={handlePhotoChange}
                            invalid={
                              validation.touched.profilePhoto &&
                              validation.errors.profilePhoto
                            }
                          />
                          {validation.touched.profilePhoto &&
                          validation.errors.profilePhoto ? (
                            <FormFeedback type="invalid">
                              {validation.errors.profilePhoto}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="text-center mt-4">
                          <Button type="submit" color="danger">
                            Update Profile
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </TabPane>
                <TabPane tabId="2">
                      <ResetPassword />
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProfilePage;
