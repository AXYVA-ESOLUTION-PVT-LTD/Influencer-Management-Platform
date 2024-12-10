import React, { useEffect, useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import Filtering from "../../components/Common/Filtering";
import Pagination from "../../components/Common/Pagination";
import TableContainer from "../../components/Common/TableContainer";
import "../../assets/themes/colors.scss";
import {
  createOpportunity,
  deleteOpportunity,
  getOpportunity,
  removeOpportunityImage,
  updateOpportunity
} from "../../store/opportunity/actions";
import { toast } from "react-toastify";
import axios from "axios";
import { UPLOAD_OPPORTUNITY_IMAGE_URL } from "../../services/opportunity/routes";

const OpportunitiesPage = (props) => {
  const dispatch = useDispatch();

  const { opportunities, error, loading, totalOpportunities, currentPage } =
    useSelector((state) => state.opportunity);

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [OpportunityDetails, setOpportunityDetails] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    imageUrl: "",
    brand: "",
    endDate: "",
    status: "",
  });
  const [selectedOpportunity, setSelectedOpportunity] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    imageUrl: "",
    brand: "",
    endDate: "",
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [updateModelerrors, setupdateModelErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [newImageFile, setnewImageFile] = useState(null);
  const [filterFields, setFilterFields] = useState({
    title: "",
    type: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // Meta title`
  document.title = "Opportunity | Brandraise ";
  
  const today = new Date().toISOString().split("T")[0]
  
  // Toggle modals
  const toggleAddModal = () => {
    // If the modal is being closed, reset the errors
    if (isAddModalOpen) {
      setOpportunityDetails({
        title: "",
        type: "",
        description: "",
        location: "",
        imageUrl: "",
        brand: "",
        endDate: "",
        status: "",
      });
      setErrors({}); 
      setnewImageFile(null);
    }
  
    // Toggle the modal open/close
    setIsAddModalOpen(!isAddModalOpen);
  };
  
  const toggleUpdateModal = () => {
    // If the modal is being closed, reset the errors
    if (isUpdateModalOpen) {
      setupdateModelErrors({});
    }
  
    // Toggle the modal open/close
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };
  
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);

  // FETCH OPPORTUNITY WHEN COMPONENT MOUNT
  useEffect(() => {
    dispatch(
      getOpportunity({
        limit,
        pageCount,
        ...filterFields,
        sortBy: sortBy.toLowerCase(),
        sortOrder,
      })
    );
  }, [dispatch, limit, pageCount, sortBy, isSearching, sortOrder, sortBy]);

  useEffect(() => {
    // When updating the record, format the date as YYYY-MM-DD if it's not already.
    if (selectedOpportunity.endDate) {
      const formattedDate = new Date(selectedOpportunity.endDate)
        .toISOString()
        .split("T")[0]; // Get YYYY-MM-DD format
      setSelectedOpportunity((prevState) => ({
        ...prevState,
        endDate: formattedDate,
      }));
    }
  }, [selectedOpportunity.endDate]);

  // Add Form Validation
  const validateForm = () => {
    const newErrors = {};
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0); // Set time to midnight
    tomorrow.setDate(tomorrow.getDate() + 1); // Move to tomorrow
  
    if (!OpportunityDetails.title.trim())
      newErrors.title = "Title is required.";
    if (!OpportunityDetails.type.trim())
      newErrors.type = "Type is required.";
    if (!OpportunityDetails.description.trim())
      newErrors.description = "Description is required.";
    if (!OpportunityDetails.location.trim())
      newErrors.location = "Location is required.";
    if (!OpportunityDetails.brand.trim())
      newErrors.brand = "Brand is required.";
    if (!OpportunityDetails.imageUrl.trim())
      newErrors.imageUrl = "Image upload is required.";
    if (!OpportunityDetails.endDate.trim()) {
      newErrors.endDate = "End Date is required.";
    } else {
      const selectedEndDate = new Date(OpportunityDetails.endDate).setHours(0, 0, 0, 0); // Normalize selected end date
      if (selectedEndDate < tomorrow) {
        newErrors.endDate = "Please select a future date.";
      }
    }
    if (!OpportunityDetails.status.trim())
      newErrors.status = "Status is required.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleInputNewOpportunity = (e) => {
    const { name, value } = e.target;
    setOpportunityDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null })); // Clear error on change
    }
  };

  // Handle view
  const handleViewOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    toggleViewModal();
  };

  // Handle update
  const handleUpdateOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    toggleUpdateModal();
  };

  // Handle delete
  const handleDeleteOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    toggleDeleteModal();
  };

  const addNewOpportunity = () => {
    if (validateForm()) {
      dispatch(createOpportunity(OpportunityDetails));
      toggleAddModal();
      setOpportunityDetails({
        title: "",
        type: "",
        description: "",
        location: "",
        imageUrl: "",
        brand: "",
        endDate: "",
        status: "",
      });
      setnewImageFile(null);
      setErrors({});
    }
  };

  // Confirm opportunity update
  const confirmUpdateOpportunity = () => {
    if (validateUpdateForm()) {
      dispatch(updateOpportunity(selectedOpportunity));
      toggleUpdateModal();
    }
  };

  const confirmDeleteOpportunity = () => {
    dispatch(deleteOpportunity(selectedOpportunity._id));
    toggleDeleteModal();
  };

  const handleNewImageChange = (e) => {
    setnewImageFile(e.target.files[0]);
  };

  // Image upload in Add Opportunity
  const handleImageUploadNewOpportunity = async () => {
    if (!newImageFile) {
      setErrors((prev) => ({ ...prev, imageUrl: "Image is required." }));
      return;
    }
    const formData = new FormData();
    formData.append("file", newImageFile);
    try {
      const token = localStorage.getItem("authUser");
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}${UPLOAD_OPPORTUNITY_IMAGE_URL}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const result = response.data;
        setOpportunityDetails((prevState) => ({
          ...prevState,
          imageUrl: result.result.data.fileName,
        }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image not uploaded successfully. Please try again later.");
      }
    } catch (error) {
      toast.error("Image not uploaded successfully. Please try again later.");
      console.error("Error uploading image:", error);
    }
  };

  const handleRemoveImageNewOpportunity = () => {
    if (!OpportunityDetails.imageUrl) {
      toast.error("No image to remove.");
      return;
    }

    const payload = { fileName: OpportunityDetails.imageUrl };
    dispatch(removeOpportunityImage(payload));
    setOpportunityDetails((prev) => ({ ...prev, imageUrl: "" }));
  };

  const validateUpdateForm = () => {
    const newUpdateErrors = {};
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (!selectedOpportunity.title.trim()) {
      newUpdateErrors.title = "Title is required.";
    }
    if (!selectedOpportunity.type.trim()) {
      newUpdateErrors.type = "Type is required.";
    }
    if (!selectedOpportunity.description.trim()) {
      newUpdateErrors.description = "Description is required.";
    }
    if (!selectedOpportunity.location.trim()) {
      newUpdateErrors.location = "Location is required.";
    }
    if (!selectedOpportunity.brand.trim()) {
      newUpdateErrors.brand = "Brand is required.";
    }
    if (!selectedOpportunity.imageUrl.trim()) {
      newUpdateErrors.imageUrl = "Image upload is required.";
    }
    if (!selectedOpportunity.endDate.trim()) {
      newUpdateErrors.endDate = "End Date is required.";
    } else {
      const selectedEndDate = new Date(selectedOpportunity.endDate).setHours(0, 0, 0, 0); // Normalize selected date
      if (selectedEndDate < tomorrow) {
        newUpdateErrors.endDate = "Please select a future date.";
      }
    }
    if (!selectedOpportunity.status.trim()) {
      newUpdateErrors.status = "Status is required.";
    }

    setupdateModelErrors(newUpdateErrors);

    return Object.keys(newUpdateErrors).length === 0;
  };

  // Update Models
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOpportunity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (updateModelerrors[name]) {
      setupdateModelErrors((prev) => ({ ...prev, [name]: null })); // Clear error on change
    }
  };

  // Image Upload with Update Model
  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image first.");
      setupdateModelErrors((prev) => ({
        ...prev,
        imageUrl: "Image is required.",
      }));
      return;
    }
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      const token = localStorage.getItem("authUser");
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}${UPLOAD_OPPORTUNITY_IMAGE_URL}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const result = response.data;
        setSelectedOpportunity((prevState) => ({
          ...prevState,
          imageUrl: result.result.data.fileName,
        }));
      } else {
        toast.error("Image not uploaded successfully. Please try again later.");
      }
    } catch (error) {
      toast.error("Image not uploaded successfully. Please try again later.");
      console.error("Error uploading image:", error);
    }
  };

  const handleRemoveImage = () => {
    if (!selectedOpportunity.imageUrl) {
      toast.error("No image to remove.");
      setupdateModelErrors((prev) => ({
        ...prev,
        imageUrl: "Image is required.",
      }));
      return;
    }

    const payload = { fileName: selectedOpportunity.imageUrl };
    dispatch(removeOpportunityImage(payload));
    setSelectedOpportunity((prev) => ({ ...prev, imageUrl: "" }));
  };

  // const handleImageUpload = () => {
  //   if (!imageFile) {
  //     toast.error("Please select an image first.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", imageFile);

  //   dispatch(uploadOpportunityImage(imageFile));
  // };

  const columns = useMemo(
    () => [
      {
        Header: "Image",
        accessor: "imageUrl",
        Cell: ({ value }) => (
          <img
            src={`${import.meta.env.VITE_APP_BASE_IMAGE_URL}${value}`}
            alt="Opportunity Image"
            style={{ width: "70px", height: "70px", objectFit: "contain" }}
          />
        ),
      },
      {
        Header: "Brand",
        accessor: "brand",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Description",
        accessor: "description",
      },

      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "End Date",
        accessor: "endDate",
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          return <span>{formattedDate}</span>;
        },
      },
      {
        Header: "Status",
        accessor: "status",
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
              onClick={() => handleViewOpportunity(original)}
            >
              <i
                className="bx bx-show"
                style={{ color: "var(--secondary-blue)" }}
              ></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleUpdateOpportunity(original)}
            >
              <i
                className="bx bx-edit"
                style={{ color: "var(--secondary-yellow)" }}
              ></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleDeleteOpportunity(original)}
            >
              <i
                className="bx bx-trash"
                style={{ color: "var(--secondary-red)" }}
              ></i>
            </Button>
          </>
        ),
      },
    ],
    [handleViewOpportunity, handleUpdateOpportunity, handleDeleteOpportunity]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* <Breadcrumbs
            title={props.t("Opportunity")}
            breadcrumbItem={props.t("Opportunity")}
          /> */}

          {/* Button to Add New Opportunity */}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18" style={{ textTransform: "uppercase" }}>
              Opportunities
            </h4>
            <div>
              <Button
                style={{
                  backgroundColor: "var(--primary-purple)",
                  color: "var(--primary-white)",
                  border: "none",
                }}
                onClick={toggleAddModal}
              >
                Add Opportunity
              </Button>
            </div>
          </div>
          <Filtering
            setFilterFields={setFilterFields}
            filterFields={filterFields}
            setIsSearching={setIsSearching}
          />

          {loading ? (
            <div className="text-center" style={{ marginTop: 50 }}>
              <Spinner style={{ color: "var(--primary-purple)" }} />
            </div>
          ) : (
            <>
              {opportunities.length ? (
                <>
                  <TableContainer
                    columns={columns}
                    data={opportunities}
                    isGlobalFilter={true}
                    isAddOptions={false}
                    customPageSize={limit}
                    className="custom-header-css"
                    setPageCount={setPageCount}
                    setLimit={setLimit}
                    setSortBy={setSortBy}
                    isPagination={false}
                    isFiltering={false}
                    isSorting={false}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                  />
                  <Pagination
                    totalData={totalOpportunities}
                    setLimit={setLimit}
                    setPageCount={setPageCount}
                    limit={limit}
                    pageCount={pageCount}
                    currentPage={currentPage}
                  />
                </>
              ) : (
                <h1 className="text-center" style={{ marginTop: 50 }}>
                  No Opportunities Found
                </h1>
              )}
            </>
          )}
        </Container>
      </div>

      {/* Add Model */}
      <Modal isOpen={isAddModalOpen} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add Opportunity</ModalHeader>
        <ModalBody>
          {OpportunityDetails.imageUrl && (
            <div className="mb-2">
              <p>Current Image:</p>
              <img
                src={`${import.meta.env.VITE_APP_BASE_IMAGE_URL}${
                  OpportunityDetails.imageUrl
                }`}
                alt="Current"
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />
              <Button
                color="danger"
                onClick={handleRemoveImageNewOpportunity}
                className="mt-2 ms-2"
              >
                Change Image
              </Button>
            </div>
          )}
          {!OpportunityDetails.imageUrl && (
            <>
              <label htmlFor="imageFile">Upload New Image</label>
              <Input
                type="file"
                name="imageFile"
                onChange={handleNewImageChange}
                className="mb-2"
              />
              {errors.imageUrl && (
                <p className="text-danger">{errors.imageUrl}</p>
              )}
              <Button color="primary" onClick={handleImageUploadNewOpportunity}>
                Upload New Image
              </Button>
            </>
          )}

          {/* <Input
            type="text"
            name="imageUrl"
            value={OpportunityDetails.imageUrl || ""}
            onChange={handleInputNewOpportunity}
            placeholder="Uploaded image URL"
            className="mb-2"
            disabled
          />
            */}

          <label htmlFor="title" className="mt-2">
            Opportunity Title
          </label>
          <Input
            type="text"
            name="title"
            value={OpportunityDetails.title}
            onChange={handleInputNewOpportunity}
            placeholder="Enter opportunity title"
            className="mb-2"
          />
          {errors.title && <p className="text-danger">{errors.title}</p>}

          <label htmlFor="type">Opportunity Type</label>
          <Input
            type="text"
            name="type"
            value={OpportunityDetails.type}
            onChange={handleInputNewOpportunity}
            placeholder="Enter opportunity type"
            className="mb-2"
          />
          {errors.type && <p className="text-danger">{errors.type}</p>}

          <label htmlFor="description">Opportunity Description</label>
          <Input
            type="text"
            name="description"
            value={OpportunityDetails.description}
            onChange={handleInputNewOpportunity}
            placeholder="Enter opportunity description"
            className="mb-2"
          />
          {errors.description && (
            <p className="text-danger">{errors.description}</p>
          )}

          <label htmlFor="location">Opportunity Location</label>
          <Input
            type="text"
            name="location"
            value={OpportunityDetails.location}
            onChange={handleInputNewOpportunity}
            placeholder="Enter opportunity location"
            className="mb-2"
          />
          {errors.location && <p className="text-danger">{errors.location}</p>}

          <label htmlFor="brand">Brand</label>
          <Input
            type="text"
            name="brand"
            value={OpportunityDetails.brand}
            onChange={handleInputNewOpportunity}
            placeholder="Enter brand"
            className="mb-2"
          />
          {errors.brand && <p className="text-danger">{errors.brand}</p>}

          <label htmlFor="endDate">End Date</label>
          <Input
            type="date"
            name="endDate"
            value={OpportunityDetails.endDate}
            onChange={handleInputNewOpportunity}
            placeholder="Enter end date"
            className="mb-2"
            min={today}
          />
          {errors.endDate && <p className="text-danger">{errors.endDate}</p>}

          <label htmlFor="status">Opportunity Status</label>
          <Input
            type="select"
            name="status"
            value={OpportunityDetails.status}
            onChange={handleInputNewOpportunity}
            placeholder="Select opportunity status"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Input>
          {errors.status && <p className="text-danger">{errors.status}</p>}
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "var(--primary-purple)",
              color: "var(--primary-white)",
            }}
            onClick={addNewOpportunity}
          >
            Save
          </Button>
          <Button color="secondary" onClick={toggleAddModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>Update Opportunity</ModalHeader>
        <ModalBody>
          {selectedOpportunity.imageUrl && (
            <div className="mb-2">
              <p>Current Image:</p>
              <img
                src={`${import.meta.env.VITE_APP_BASE_IMAGE_URL}${
                  selectedOpportunity.imageUrl
                }`}
                alt="Current"
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />
              <Button
                color="danger"
                onClick={handleRemoveImage}
                className="mt-2 ms-2"
              >
                Change Image
              </Button>
            </div>
          )}
          {!selectedOpportunity.imageUrl && (
            <>
              <label htmlFor="imageFile">Upload New Image</label>
              <Input
                type="file"
                name="imageFile"
                onChange={handleImageChange}
                className="mb-2"
              />
              {updateModelerrors.imageUrl && (
                <p className="text-danger">{updateModelerrors.imageUrl}</p>
              )}
              <Button color="primary" onClick={handleImageUpload}>
                Upload New Image
              </Button>
            </>
          )}

          {/* <Input
            type="text"
            name="imageUrl"
            value={selectedOpportunity.imageUrl || ""}
            onChange={handleInputChange}
            placeholder="Uploaded image URL"
            className="mb-2"
            disabled
          /> */}
          <label htmlFor="title" className="mt-2">
            Opportunity Title
          </label>
          <Input
            type="text"
            name="title"
            value={selectedOpportunity.title}
            onChange={handleInputChange}
            placeholder="Enter opportunity title"
            className="mb-2"
          />
          {updateModelerrors.title && (
            <p className="text-danger">{updateModelerrors.title}</p>
          )}
          <label htmlFor="type">Opportunity Type</label>
          <Input
            type="text"
            name="type"
            value={selectedOpportunity.type}
            onChange={handleInputChange}
            placeholder="Enter opportunity type"
            className="mb-2"
          />
          {updateModelerrors.type && (
            <p className="text-danger">{updateModelerrors.type}</p>
          )}
          <label htmlFor="description">Opportunity Description</label>
          <Input
            type="text"
            name="description"
            value={selectedOpportunity.description}
            onChange={handleInputChange}
            placeholder="Enter opportunity description"
            className="mb-2"
          />
          {updateModelerrors.description && (
            <p className="text-danger">{updateModelerrors.description}</p>
          )}
          <label htmlFor="location">Opportunity Location</label>
          <Input
            type="text"
            name="location"
            value={selectedOpportunity.location}
            onChange={handleInputChange}
            placeholder="Enter opportunity location"
            className="mb-2"
          />
          {updateModelerrors.location && (
            <p className="text-danger">{updateModelerrors.location}</p>
          )}
          <label htmlFor="brand">Brand</label>
          <Input
            type="text"
            name="brand"
            value={selectedOpportunity.brand}
            onChange={handleInputChange}
            placeholder="Enter brand"
            className="mb-2"
          />
          {updateModelerrors.brand && (
            <p className="text-danger">{updateModelerrors.brand}</p>
          )}
          <label htmlFor="endDate">End Date</label>
          <Input
            type="date"
            name="endDate"
            value={selectedOpportunity.endDate}
            onChange={handleInputChange}
            placeholder="Enter end date"
            className="mb-2"
            min={today}
          />
          {updateModelerrors.endDate && (
            <p className="text-danger">{updateModelerrors.endDate}</p>
          )}
          <label htmlFor="status">Opportunity Status</label>
          <Input
            type="select"
            name="status"
            value={selectedOpportunity.status}
            onChange={handleInputChange}
            placeholder="Select opportunity status"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Input>
          {updateModelerrors.status && (
            <p className="text-danger">{updateModelerrors.status}</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "var(--primary-purple)",
              color: "var(--primary-white)",
            }}
            onClick={confirmUpdateOpportunity}
          >
            Save
          </Button>
          <Button color="secondary" onClick={toggleUpdateModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete Opportunity</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the opportunity{" "}
          <strong>
            {selectedOpportunity ? selectedOpportunity.title : ""}
          </strong>
          ?
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "var(--secondary-red)",
              color: "var(--primary-white)",
            }}
            onClick={confirmDeleteOpportunity}
          >
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} toggle={toggleViewModal}>
        <ModalHeader toggle={toggleViewModal}>Opportunity Details</ModalHeader>
        <ModalBody>
          {selectedOpportunity && (
            <>
              {selectedOpportunity.imageUrl && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px", // Add spacing between the image and the text
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={`http://localhost:4000/uploads/opportunityImage/${selectedOpportunity.imageUrl}`}
                    alt={selectedOpportunity.title}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain", // Ensures the image is properly scaled
                      borderRadius: "5px", // Optional: Makes the image corners rounded
                    }}
                  />
                  <p style={{ margin: 0 }}>{selectedOpportunity.brand}</p>
                </div>
              )}

              <p>
                <strong>Title:</strong> {selectedOpportunity.title}
              </p>
              <p>
                <strong>Type:</strong> {selectedOpportunity.type}
              </p>
              <p>
                <strong>Description:</strong> {selectedOpportunity.description}
              </p>
              <p>
                <strong>Location:</strong> {selectedOpportunity.location}
              </p>

              <p>
                <strong>End Date:</strong> {selectedOpportunity.endDate}
              </p>
              <p>
                <strong>Status:</strong> {selectedOpportunity.status}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleViewModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default withTranslation()(OpportunitiesPage);
