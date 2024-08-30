import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import * as Yup from "yup";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer"; // Adjust import path if necessary
import {
  addNewInfluencer,
  getInfluencers,
  updateInfluencer,
} from "../../store/influencers/actions";
import ROLES from "../../constants/role";
import Pagination from "../../components/Common/Pagination";

const Influencer = (props) => {
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // Meta title
  document.title = "Influencer | Drim - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const { influencers, loading, error, totalInfluencer, currentPage } =
    useSelector((state) => state.influencer);
  console.log({ influencers });
  const createInfluncerValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        roleName: ROLES.INFLUENCER,
      };
      dispatch(addNewInfluencer(payload));
      resetForm();
      toggleCreateModal();
    },
  });
  const updateInfluncerValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: "Active",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log({ selectedInfluencer });
      const payload = {
        id: selectedInfluencer._id,
        status: values.status === "Inactive" ? false : true,
        roleName: ROLES.INFLUENCER,
      };
      dispatch(updateInfluencer(payload));
      resetForm();
      toggleUpdateModal();
    },
  });

  // Get Influencer when Mount
  useEffect(() => {
    dispatch(getInfluencers({ roleName: ROLES.INFLUENCER }));
  }, []);

  // Toggle modals
  const toggleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  const toggleDetailsModal = () => {
    setIsDetailsModalOpen(!isDetailsModalOpen);
  };
  // Handle update
  const handleUpdateInfluencer = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleUpdateModal();
  };

  // Handle view details
  const handleViewDetails = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleDetailsModal();
  };

  const columns = useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span style={{ color: value ? "green" : "red" }}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row: { original } }) => (
          <>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleViewDetails(original)}
            >
              <i className="bx bx-show" style={{ color: "blue" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleUpdateInfluencer(original)}
            >
              <i className="bx bx-edit" style={{ color: "orange" }}></i>
            </Button>
          </>
        ),
      },
    ],
    [handleUpdateInfluencer, handleViewDetails]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Button to Add New Influencer */}
          <div className="d-flex justify-content-end mb-3">
            <Button color="primary" onClick={toggleCreateModal}>
              Add Influencer
            </Button>
          </div>

          {/* Influencers Table */}
          <TableContainer
            columns={columns}
            data={influencers}
            isGlobalFilter={false} // Assuming you don't need global filtering here
            isAddOptions={false}
            customPageSize={10}
            className="custom-header-css"
            isPagination={false}
          />
          {/* <Pagination
            totalData={totalInfluencer}
            setLimit={setLimit}
            setPageCount={setPageCount}
            limit={limit}
            pageCount={pageCount}
            currentPage={pageCount}
          /> */}
        </Container>
      </div>

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} toggle={toggleDetailsModal}>
        <ModalHeader toggle={toggleDetailsModal}>
          Influencer Details
        </ModalHeader>
        <ModalBody>
          {selectedInfluencer && (
            <>
              <p>
                <strong>First Name:</strong> {selectedInfluencer.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedInfluencer.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedInfluencer.email}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDetailsModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}>Add Influencer</ModalHeader>
        <form onSubmit={createInfluncerValidation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="firstName" className="block mb-1">
                First Name:
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.firstName}
                invalid={
                  createInfluncerValidation.touched.firstName &&
                  createInfluncerValidation.errors.firstName
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.firstName &&
              createInfluncerValidation.errors.firstName ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.firstName}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <Label htmlFor="lastName" className="block mb-1">
                Last Name:
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.lastName}
                invalid={
                  createInfluncerValidation.touched.lastName &&
                  createInfluncerValidation.errors.lastName
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.lastName &&
              createInfluncerValidation.errors.lastName ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.lastName}
                </div>
              ) : null}
            </div>
            <div className="mb-2">
              <Label htmlFor="email" className="block mb-1">
                Email:
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                onChange={createInfluncerValidation.handleChange}
                onBlur={createInfluncerValidation.handleBlur}
                value={createInfluncerValidation.values.email}
                invalid={
                  createInfluncerValidation.touched.email &&
                  createInfluncerValidation.errors.email
                    ? true
                    : false
                }
              />
              {createInfluncerValidation.touched.email &&
              createInfluncerValidation.errors.email ? (
                <div className="invalid-feedback">
                  {createInfluncerValidation.errors.email}
                </div>
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Save
            </Button>
            <Button color="secondary" onClick={toggleCreateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>Update Client</ModalHeader>
        <form onSubmit={updateInfluncerValidation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="status" className="block mb-1">
                Status
              </Label>
              <Input
                name="status"
                type="select"
                onChange={updateInfluncerValidation.handleChange}
                onBlur={updateInfluncerValidation.handleBlur}
                value={updateInfluncerValidation.values.status}
                invalid={
                  updateInfluncerValidation.touched.status &&
                  updateInfluncerValidation.errors.status
                    ? true
                    : false
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </Input>
              {updateInfluncerValidation.touched.status &&
              updateInfluncerValidation.errors.status ? (
                <div className="invalid-feedback">
                  {updateInfluncerValidation.errors.status}
                </div>
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Save
            </Button>
            <Button color="secondary" onClick={toggleUpdateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default withTranslation()(Influencer);
