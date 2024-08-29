import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Alert,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { userResetPassword, userResetPasswordError, userResetPasswordNull } from "../../store/actions";

const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

function ChangePasswordForm() {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values , { resetForm }) => {
    
           dispatch(userResetPassword(values));
          resetForm();
     
          setTimeout(()=>{
            dispatch(userResetPasswordNull());
          },5000) 
    }
  });

  const { resetSuccessMsg, resetError } = useSelector((state) => ({
    resetSuccessMsg: state.resetPassword.resetSuccessMsg,
    resetError: state.resetPassword.resetError,
  }));

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-70">
      <Card style={{ maxWidth: "500px", width: "100%" }}>
        <CardBody>
          <h4 className="text-center mb-4">Change Password</h4>
          <Form className="form-horizontal" onSubmit={formik.handleSubmit}>
            {resetError && <Alert color="danger">{resetError}</Alert>}
            {resetSuccessMsg && <Alert color="success">{resetSuccessMsg}</Alert>}
            
            <FormGroup>
              <Label for="oldPassword">Old Password</Label>
              <Input
                type="password"
                id="oldPassword"
                name="oldPassword"
                placeholder="Enter old password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.oldPassword}
                invalid={formik.touched.oldPassword && !!formik.errors.oldPassword}
              />
              <FormFeedback>{formik.errors.oldPassword}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="newPassword">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
                invalid={formik.touched.newPassword && !!formik.errors.newPassword}
              />
              <FormFeedback>{formik.errors.newPassword}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                invalid={
                  formik.touched.confirmPassword && !!formik.errors.confirmPassword
                }
              />
              <FormFeedback>{formik.errors.confirmPassword}</FormFeedback>
            </FormGroup>

            <Button color="primary" type="submit">
              Save
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

export default ChangePasswordForm;
