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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
  const [imageFile, setImageFile] = useState(null);
  const [isChangingImage, setIsChangingImage] = useState(false);
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

  // Toggle modals
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
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
      const formattedDate = new Date(selectedOpportunity.endDate).toISOString().split("T")[0]; // Get YYYY-MM-DD format
      setSelectedOpportunity((prevState) => ({
        ...prevState,
        endDate: formattedDate,
      }));
    }
  }, [selectedOpportunity.endDate]); 

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

  // Confirm opportunity update
  const confirmUpdateOpportunity = () => {
    if (selectedOpportunity && selectedOpportunity._id) {
      dispatch(updateOpportunity(selectedOpportunity));
    } else {
      dispatch(createOpportunity(selectedOpportunity));
    }
    toggleUpdateModal();
    setSelectedOpportunity({ title: "", type: "" });
  };

  const confirmDeleteOpportunity = () => {
    dispatch(deleteOpportunity(selectedOpportunity._id));
    toggleDeleteModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOpportunity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      const token = localStorage.getItem("authUser");
      const response = await axios.post(
        `${ import.meta.env.VITE_APP_BASE_URL}${UPLOAD_OPPORTUNITY_IMAGE_URL}`,
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
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image not uploaded successfully. Please try again later.");
      }
    } catch (error) {
      toast.error("Image not uploaded successfully. Please try again later.");
      console.error("Error uploading image:", error);
    }
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

  const handleRemoveImage = () => {
    if (!selectedOpportunity.imageUrl) {
      toast.error("No image to remove.");
      return;
    }

    const payload = { fileName: selectedOpportunity.imageUrl };
    dispatch(removeOpportunityImage(payload));
    setSelectedOpportunity((prev) => ({ ...prev, imageUrl: "" }));
  };

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

  const canSubmit =
    selectedOpportunity?.title.trim().length > 0 &&
    selectedOpportunity?.type.trim().length > 0;
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
                  border : "none"
                }}
                onClick={() => toggleUpdateModal()}
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

      {/* Update Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>
          {selectedOpportunity && selectedOpportunity.id
            ? "Update Opportunity"
            : "Add Opportunity"}
        </ModalHeader>
        <ModalBody>
          {selectedOpportunity.imageUrl && (
            <div className="mb-2">
              <p>Current Image:</p>
              <img
                src={`${import.meta.env.VITE_APP_BASE_IMAGE_URL}${selectedOpportunity.imageUrl}`}
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
          <label htmlFor="imageFile">Upload New Image</label>
          <Input
            type="file"
            name="imageFile"
            onChange={handleImageChange}
            className="mb-2"
          />
          <Button color="primary" onClick={handleImageUpload}>
            Upload New Image
          </Button>
          {/* <Input
            type="text"
            name="imageUrl"
            value={selectedOpportunity.imageUrl || ""}
            onChange={handleInputChange}
            placeholder="Uploaded image URL"
            className="mb-2"
            disabled
          /> */}
           <label htmlFor="title" className="mt-2">Opportunity Title</label>
          <Input
            type="text"
            name="title"
            value={selectedOpportunity.title}
            onChange={handleInputChange}
            placeholder="Enter opportunity title"
            className="mb-2"
          />
          <label htmlFor="type">Opportunity Type</label>
          <Input
            type="text"
            name="type"
            value={selectedOpportunity.type}
            onChange={handleInputChange}
            placeholder="Enter opportunity type"
            className="mb-2"
          />
           <label htmlFor="description">Opportunity Description</label>
          <Input
            type="text"
            name="description"
            value={selectedOpportunity.description}
            onChange={handleInputChange}
            placeholder="Enter opportunity description"
            className="mb-2"
          />
          <label htmlFor="location">Opportunity Location</label>
          <Input
            type="text"
            name="location"
            value={selectedOpportunity.location}
            onChange={handleInputChange}
            placeholder="Enter opportunity location"
            className="mb-2"
          />
          <label htmlFor="brand">Brand (Optional)</label>
          <Input
            type="text"
            name="brand"
            value={selectedOpportunity.brand}
            onChange={handleInputChange}
            placeholder="Enter brand (optional)"
            className="mb-2"
          />
          <label htmlFor="endDate">End Date</label>
          <Input
            type="date"
            name="endDate"
            value={selectedOpportunity.endDate}
            onChange={handleInputChange}
            placeholder="Enter end date"
            className="mb-2"
          />
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
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "var(--primary-purple)",
              color: "var(--primary-white)",
            }}
            onClick={confirmUpdateOpportunity}
            disabled={!canSubmit}
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
