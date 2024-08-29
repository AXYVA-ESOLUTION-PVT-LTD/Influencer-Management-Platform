import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
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
import { addNewInfluencer } from "../../store/influencers/actions";

const Influencer = (props) => {
  const dispatch = useDispatch();

  // State for managing influencers
  const [influencers, setInfluencers] = useState([
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@example.com",
    },
  ]);

  // State for modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  // Meta title
  document.title = "Influencer | Drim - React Admin & Dashboard Template";

  // Toggle modals
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleDetailsModal = () => setIsDetailsModalOpen(!isDetailsModalOpen);

  // Handle update
  const handleUpdateInfluencer = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleUpdateModal();
  };

  // Handle delete
  const handleDeleteInfluencer = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleDeleteModal();
  };

  // Handle view details
  const handleViewDetails = (influencer) => {
    setSelectedInfluencer(influencer);
    toggleDetailsModal();
  };

  // Confirm influencer update
  const confirmUpdateInfluencer = () => {
    if (selectedInfluencer.id) {
      const updatedInfluencers = influencers.map((inf) =>
        inf.id === selectedInfluencer.id
          ? { ...inf, ...selectedInfluencer }
          : inf
      );
      setInfluencers(updatedInfluencers);
    } else {
      // const newInfluencer = {
      //   id: influencers.length + 1,
      //   ...selectedInfluencer,
      // };
      // setInfluencers([...influencers, newInfluencer]);
      // dispatch(addNewInfluencer(selectedInfluencer));
      dispatch(addNewInfluencer(selectedInfluencer));
    }
    toggleUpdateModal();
  };

  // Confirm influencer deletion
  const confirmDeleteInfluencer = () => {
    const updatedInfluencers = influencers.filter(
      (inf) => inf.id !== selectedInfluencer.id
    );
    setInfluencers(updatedInfluencers);
    toggleDeleteModal();
  };

  // Handle input change for update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInfluencer({ ...selectedInfluencer, [name]: value });
  };

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: "id",
        Cell: ({ cell: { value }, row: { index } }) => index + 1,
      },
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
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleDeleteInfluencer(original)}
            >
              <i className="bx bx-trash" style={{ color: "red" }}></i>
            </Button>
          </>
        ),
      },
    ],
    [handleUpdateInfluencer, handleDeleteInfluencer, handleViewDetails]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: selectedInfluencer ? selectedInfluencer.firstName : "",
      lastName: selectedInfluencer ? selectedInfluencer.lastName : "",
      email: selectedInfluencer ? selectedInfluencer.email : "",
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
      };
      if (selectedInfluencer && selectedInfluencer.id) {
        // Update  Influencer
      } else {
        // Add new Influencer
        dispatch(addNewInfluencer(payload));
      }
      resetForm();
      toggleUpdateModal();
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Influencer")}
            breadcrumbItem={props.t("Influencer")}
          />

          {/* Button to Add New Influencer */}
          <div className="d-flex justify-content-end mb-3">
            <Button
              color="primary"
              onClick={() =>
                handleUpdateInfluencer({
                  firstName: "",
                  lastName: "",
                  email: "",
                })
              }
            >
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
          />
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

      {/* Update Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>
          {selectedInfluencer && selectedInfluencer.id
            ? "Update Client"
            : "Add Client"}
        </ModalHeader>
        <form onSubmit={validation.handleSubmit}>
          <ModalBody>
            <div className="mb-2">
              <Label htmlFor="firstName" className="block mb-1">
                First Name:
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.firstName}
                invalid={
                  validation.touched.firstName && validation.errors.firstName
                    ? true
                    : false
                }
              />
              {validation.touched.firstName && validation.errors.firstName ? (
                <div className="invalid-feedback">
                  {validation.errors.firstName}
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
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.lastName}
                invalid={
                  validation.touched.lastName && validation.errors.lastName
                    ? true
                    : false
                }
              />
              {validation.touched.lastName && validation.errors.lastName ? (
                <div className="invalid-feedback">
                  {validation.errors.lastName}
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
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.email}
                invalid={
                  validation.touched.email && validation.errors.email
                    ? true
                    : false
                }
              />
              {validation.touched.email && validation.errors.email ? (
                <div className="invalid-feedback">
                  {validation.errors.email}
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete Influencer</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the influencer{" "}
          <strong>
            {selectedInfluencer
              ? `${selectedInfluencer.firstName} ${selectedInfluencer.lastName}`
              : ""}
          </strong>
          ?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDeleteInfluencer}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default withTranslation()(Influencer);
