import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import {
  getRole,
  addNewRole,
  updateRole,
  deleteRole,
} from "../../store/actions";

const ManageRole = (props) => {
  const dispatch = useDispatch();

  // Select roles and errors from Redux store
  const roles = useSelector((state) => state.Role.roles);
  
  // const roles = [];
  // const error = useSelector((state) => state.role.error);
  
  // State for modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState({ id: null, name: "" });

  // Meta title
  document.title = "Manage Role | Drim - React Admin & Dashboard Template";

  // Fetch roles when the component mounts
  useEffect(() => {
    dispatch(getRole());
  }, [dispatch, isUpdateModalOpen , isDeleteModalOpen]);

  // Toggle modals
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  // Handle update
  const handleUpdateRole = (role) => {
    setSelectedRole(role);
    toggleUpdateModal();
  };

  // Handle delete
  const handleDeleteRole = (role) => {
    setSelectedRole(role);
    toggleDeleteModal();
  };

  // Confirm role update
  const confirmUpdateRole = () => {
    if (selectedRole._id) {
      dispatch(updateRole(selectedRole));
    } else {
      dispatch(addNewRole(selectedRole));
    }
    toggleUpdateModal();
  };

  // Confirm role deletion
  const confirmDeleteRole = () => {
    dispatch(deleteRole(selectedRole._id));
    toggleDeleteModal();
  };

  const handleViewRole = (role) => {
    setSelectedRole(role);
    toggleViewModal();
  };

  // Handle input change for update
  const handleInputChange = (e) => {
    setSelectedRole({ ...selectedRole, name: e.target.value });
  };

  // Define columns for the table
  const columns = useMemo(
    () => [
      
      {
        Header: "Role Name",
        accessor: "name",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() =>  handleViewRole(row.original)}
            >
              <i className="bx bx-show" style={{ color: "blue" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleUpdateRole(row.original)}
            >
              <i className="bx bx-edit" style={{ color: "orange" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleDeleteRole(row.original)}
            >
              <i className="bx bx-trash" size="lg" style={{ color: "red" }}></i>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Manage Role")}
            breadcrumbItem={props.t("Manage Role")}
          /> */}

          {/* Button to Add New Role */}
          <div className="d-flex justify-content-end mb-3">
            <Button
              color="primary"
              onClick={() => handleUpdateRole({ id: null, name: "" })}
            >
              Add Role
            </Button>
          </div>

          {/* Roles Table */}
          <TableContainer
            columns={columns}
            data={roles}
            isGlobalFilter={true}
            isAddOptions={false}
            customPageSize={10}
            className="custom-header-css"
          />
        </Container>
      </div>
      
      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} toggle={toggleViewModal}>
        <ModalHeader toggle={toggleViewModal}>View Role</ModalHeader>
        <ModalBody>
          <p><strong>Role : </strong> {selectedRole ? selectedRole.name : ""}</p>
          {/* Add more details if needed */}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleViewModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>
          {selectedRole && selectedRole.id ? "Update Role" : "Add Role"}
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            value={selectedRole ? selectedRole.name : ""}
            onChange={handleInputChange}
            placeholder="Enter role name"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirmUpdateRole}>
            Save
          </Button>
          <Button color="secondary" onClick={toggleUpdateModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete Role</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the role{" "}
          <strong>{selectedRole ? selectedRole.name : ""}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDeleteRole}>
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

export default withTranslation()(ManageRole);
