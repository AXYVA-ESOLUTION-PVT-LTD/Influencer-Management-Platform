import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Input,
  Label,
  Form,
  InputGroup,
  InputGroupText,
  Alert,
  Button,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../../store/actions";
import PropTypes from "prop-types";
import ROLECODE from "../../constants/rolecode";
import withRouter from "../../components/Common/withRouter";
import PI from "react-phone-input-2";
import { phoneLengthByCountry } from "../../data/PhonenumberData";
import "react-phone-input-2/lib/style.css";
const PhoneInput = PI.default ? PI.default : PI;

const Register = (props) => {
  document.title = "Register | Brandraise";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");

  const { registrationError, loading } = useSelector((state) => ({
    registrationError: state.Account.registrationError,
    loading: state.Account.loading,
  }));

  const validationStep1 = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      city: "",
      country: "",
      roleCode: ROLECODE["Influencer"],
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim()
        .matches(
          /^[A-Za-z]+$/,
          "First name must only contain alphabets and cannot have special characters or numbers"
        )
        .min(2, "First name must be at least 2 characters long")
        .max(50, "First name must not exceed 50 characters")
        .required("Please Enter Your First Name"),
      lastName: Yup.string()
        .trim()
        .matches(
          /^[A-Za-z]+$/,
          "Last name must only contain alphabets and cannot have special characters or numbers"
        )
        .min(2, "Last name must be at least 2 characters long")
        .max(50, "Last name must not exceed 50 characters")
        .required("Please Enter Your Last Name"),
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Please Enter Your Email"),
      password: Yup.string()
        .trim()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/,
          "Password must be 8-20 characters, include uppercase, lowercase, number, and special character."
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .trim()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please Confirm Your Password"),
      phoneNumber: Yup.string().required("Please enter your phone number"),
      city: Yup.string()
        .trim()
        .matches(
          /^[A-Za-z\s]+$/,
          "City should only contain alphabets and spaces, and cannot include special characters or numbers"
        )
        .min(3, "City name must be at least 3 characters long")
        .max(100, "City name must not exceed 100 characters")
        .required("City is required"),
      country: Yup.string()
        .trim()
        .matches(
          /^[A-Za-z\s]+$/,
          "Country should only contain alphabets and spaces, and cannot include special characters or numbers"
        )
        .min(3, "Country name must be at least 3 characters long")
        .max(100, "Country name must not exceed 100 characters")
        .required("Country is required"),
      // city: Yup.string().required("Please select a city from the list"),
      // country: Yup.string().required("Please select a country from the list"),
    }),
  });

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    // Validate both forms before submitting
    const errorsStep1 = await validationStep1.validateForm();
    if (Object.keys(errorsStep1).length === 0) {
      // Merge the data from both steps and submit
      const mergedData = Object.entries(validationStep1.values).reduce(
        (acc, [key, value]) => {
          acc[key] =
            typeof value === "string" && key !== "phoneNumber"
              ? value.trim()
              : value;
          return acc;
        },
        {}
      );

      setIsSubmitting(true);
      dispatch(registerUser(mergedData));
    } else {
      validationStep1.setTouched({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        confirmPassword: true,
        phoneNumber: true,
        city: true,
        country: true,
      });
    }
  };

  useEffect(() => {
    if (!loading && isSubmitting) {
      if (!registrationError) {
        navigate("/onboarding");
      } else {
        setSubmissionError(registrationError);
        console.error("Error creating User:", registrationError);
      }
      setIsSubmitting(false);
    }
  }, [loading, registrationError, isSubmitting]);

  useEffect(() => {
    return () => {
      setSubmissionError(null);
    };
  }, []);

  const formatErrorMessage = (error) => {
    if (!error) return null;

    const errorMessage =
      typeof error === "string" ? error : JSON.stringify(error);

    if (errorMessage.includes("This")) {
      return errorMessage.split(/(?=This)/g).map((msg, index) => (
        <p key={index} className="text-danger">
          {msg.trim()}
        </p>
      ));
    }

    return <p className="text-danger">{errorMessage}</p>;
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const handlePhoneChange = (phone, country) => {
    if (country?.dialCode) {
      const phoneWithoutDialCode = phone.startsWith(country.dialCode)
        ? phone.slice(country.dialCode.length)
        : phone;

      const formattedNumber = `+${country.dialCode} ${phoneWithoutDialCode}`;
      const validLengths = phoneLengthByCountry[country.dialCode];
      // If country code not found, skip validation
      if (!validLengths) {
        validationStep1.setFieldValue("phoneNumber", formattedNumber);
        return;
      }

      // Ensure validLengths is treated as an array
      const isValid = Array.isArray(validLengths)
        ? validLengths.includes(phoneWithoutDialCode.length)
        : phoneWithoutDialCode.length === validLengths;
      if (!isValid) {
        setTimeout(() => {
          validationStep1.setFieldError(
            "phoneNumber",
            `Phone number must be ${
              Array.isArray(validLengths)
                ? validLengths.join(" or ")
                : validLengths
            } digits.`
          );
          validationStep1.setFieldTouched("phoneNumber", true, false); // Force re-render
        }, 0);
      } else {
        validationStep1.setFieldError("phoneNumber", "");
      }

      setFormattedPhoneNumber(formattedNumber);
      validationStep1.setFieldValue("phoneNumber", formattedNumber);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light w-100">
        <Card className="shadow-lg register-page">
          <Row className="g-0 h-100">
            <Col
              xs={12}
              lg={6}
              className="bg-primary text-white p-4 d-flex flex-column align-items-start justify-content-between d-none d-lg-flex"
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
              lg={6}
              className="d-flex flex-column align-items-center justify-content-between h-100"
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

              <CardBody className="d-flex flex-column align-items-center justify-content-center my-lg-4">
                <div>
                  <h2 className="text-left mb-4">Registration</h2>
                  <h6 className="text-left mb-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-bold">
                      Log In
                    </Link>
                  </h6>
                  {submissionError && (
                    <Alert color="danger">
                      {formatErrorMessage(submissionError)}
                    </Alert>
                  )}
                  <div>
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                    >
                      <div className="row mb-3">
                        <div className="col-lg-6 col-12">
                          <Label className="form-label">First Name</Label>
                          <Input
                            name="firstName"
                            type="text"
                            placeholder="Enter first name"
                            onChange={validationStep1.handleChange}
                            onBlur={validationStep1.handleBlur}
                            value={validationStep1.values.firstName || ""}
                            invalid={
                              validationStep1.touched.firstName &&
                              validationStep1.errors.firstName
                                ? true
                                : false
                            }
                          />
                          {validationStep1.touched.firstName &&
                            validationStep1.errors.firstName && (
                              <Alert color="danger" className="mt-2 p-1">
                                {validationStep1.errors.firstName}
                              </Alert>
                            )}
                        </div>

                        <div className="col-lg-6 col-12">
                          <Label className="form-label">Last Name</Label>
                          <Input
                            name="lastName"
                            type="text"
                            placeholder="Enter last name"
                            onChange={validationStep1.handleChange}
                            onBlur={validationStep1.handleBlur}
                            value={validationStep1.values.lastName || ""}
                            invalid={
                              validationStep1.touched.lastName &&
                              validationStep1.errors.lastName
                                ? true
                                : false
                            }
                          />
                          {validationStep1.touched.lastName &&
                            validationStep1.errors.lastName && (
                              <Alert color="danger" className="mt-2 p-1">
                                {validationStep1.errors.lastName}
                              </Alert>
                            )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-lg-6 col-12">
                          <Label className="form-label">Email</Label>
                          <Input
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            onChange={validationStep1.handleChange}
                            onBlur={validationStep1.handleBlur}
                            value={validationStep1.values.email || ""}
                            invalid={
                              validationStep1.touched.email &&
                              validationStep1.errors.email
                                ? true
                                : false
                            }
                          />
                          {validationStep1.touched.email &&
                            validationStep1.errors.email && (
                              <Alert color="danger" className="mt-2 p-1">
                                {validationStep1.errors.email}
                              </Alert>
                            )}
                        </div>
                        <div className="col-lg-6 col-12">
                          <Label className="form-label">Phone Number</Label>
                          <PhoneInput
                            country={"us"}
                            value={validationStep1.values.phoneNumber}
                            onChange={(phone, country) => {
                              handlePhoneChange(phone, country);
                              // validationStep1.setFieldValue(
                              //   "phoneNumber",
                              //   phone
                              // );
                            }}
                            onBlur={() =>
                              validationStep1.setFieldTouched(
                                "phoneNumber",
                                true
                              )
                            }
                            inputClass="form-control"
                          />
                          {validationStep1.touched.phoneNumber &&
                            validationStep1.errors.phoneNumber && (
                              <Alert color="danger" className="mt-2 p-1">
                                {validationStep1.errors.phoneNumber}
                              </Alert>
                            )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-lg-6 col-12">
                          <Label className="form-label">Password</Label>
                          <InputGroup>
                            <Input
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              onChange={validationStep1.handleChange}
                              onBlur={validationStep1.handleBlur}
                              value={validationStep1.values.password || ""}
                              invalid={
                                validationStep1.touched.password &&
                                validationStep1.errors.password
                                  ? true
                                  : false
                              }
                            />
                            <InputGroupText
                              onClick={() => setShowPassword(!showPassword)}
                              className="cursor-pointer-dot"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </InputGroupText>
                          </InputGroup>
                          {validationStep1.touched.password &&
                            validationStep1.errors.password && (
                              <Alert color="danger" className="mt-2 p-1">
                                {validationStep1.errors.password}
                              </Alert>
                            )}
                        </div>
                        <div className="col-lg-6 col-12">
                          <Label className="form-label">Confirm Password</Label>
                          <InputGroup>
                            <Input
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              onChange={validationStep1.handleChange}
                              onBlur={validationStep1.handleBlur}
                              value={
                                validationStep1.values.confirmPassword || ""
                              }
                              invalid={
                                validationStep1.touched.confirmPassword &&
                                validationStep1.errors.confirmPassword
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
                          {validationStep1.touched.confirmPassword &&
                            validationStep1.errors.confirmPassword && (
                              <Alert color="danger" className="mt-2 p-1">
                                {validationStep1.errors.confirmPassword}
                              </Alert>
                            )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-lg-6 col-12">
                          <Label className="form-label">City</Label>
                          <Input
                            name="city"
                            type="text"
                            placeholder="Enter city"
                            onChange={validationStep1.handleChange}
                            onBlur={validationStep1.handleBlur}
                            value={validationStep1.values.city || ""}
                            invalid={
                              validationStep1.touched.city &&
                              validationStep1.errors.city
                                ? true
                                : false
                            }
                          />
                          {validationStep1.touched.city &&
                            validationStep1.errors.city && (
                              <Alert color="danger" className="mt-2 p-1">
                                {validationStep1.errors.city}
                              </Alert>
                            )}
                        </div>

                        <div className="col-lg-6 col-12">
                          <Label className="form-label">Country</Label>
                          <Input
                            name="country"
                            type="text"
                            placeholder="Enter country"
                            onChange={validationStep1.handleChange}
                            onBlur={validationStep1.handleBlur}
                            value={validationStep1.values.country || ""}
                            invalid={
                              validationStep1.touched.country &&
                              validationStep1.errors.country
                                ? true
                                : false
                            }
                          />
                          {validationStep1.touched.country &&
                            validationStep1.errors.country && (
                              <Alert color="danger" className="mt-2 p-1">
                                {validationStep1.errors.country}
                              </Alert>
                            )}
                        </div>
                      </div>

                      {/* <div className="mb-3">
                        <Label className="form-label">Country</Label>
                        <Input
                          name="country"
                          type="select"
                          onChange={(e) => {
                            validationStep1.handleChange(e);
                            handleCountryChange(e);
                          }}
                          onBlur={validationStep1.handleBlur}
                          value={validationStep1.values.country || ""}
                          invalid={
                            validationStep1.touched.country &&
                            validationStep1.errors.country
                              ? true
                              : false
                          }
                        >
                          <option value="">Select a country</option>
                          {loadingCountries ? (
                            <option>Loading countries...</option>
                          ) : filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <option key={country.code} value={country.name}>
                                {country.name}
                              </option>
                            ))
                          ) : (
                            <option>No countries available</option>
                          )}
                        </Input>
                        {validationStep1.touched.country &&
                          validationStep1.errors.country && (
                            <FormFeedback type="invalid">
                              {validationStep1.errors.country}
                            </FormFeedback>
                          )}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">City</Label>
                        <Input
                          name="city"
                          type="select"
                          onChange={validationStep1.handleChange}
                          onBlur={validationStep1.handleBlur}
                          value={validationStep1.values.city || ""}
                          invalid={
                            validationStep1.touched.city &&
                            validationStep1.errors.city
                              ? true
                              : false
                          }
                          disabled={loadingCities}
                        >
                          <option value="">Select a city</option>
                          {loadingCities ? (
                            <option>Loading cities...</option>
                          ) : filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <option key={city.geonameId} value={city.name}>
                                {city.name}
                              </option>
                            ))
                          ) : (
                            <option>No cities available</option> 
                          )}
                        </Input>
                        {validationStep1.touched.city &&
                          validationStep1.errors.city && (
                            <FormFeedback type="invalid">
                              {validationStep1.errors.city}
                            </FormFeedback>
                          )}
                      </div> */}

                      {/* <div className="mt-4 d-flex justify-content-end">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                      </div> */}
                    </Form>
                  </div>
                </div>
              </CardBody>

              <div className="w-100 text-right shadow-lg p-3">
                <Button
                  color="primary"
                  className="w-auto rounded-0 float-end"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Register);

Register.propTypes = {
  history: PropTypes.object,
};
