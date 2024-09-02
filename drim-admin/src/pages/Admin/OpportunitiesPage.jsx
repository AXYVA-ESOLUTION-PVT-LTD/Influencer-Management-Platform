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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Filtering from "../../components/Common/Filtering";
import Pagination from "../../components/Common/Pagination";
import TableContainer from "../../components/Common/TableContainer"; // Adjust import path if necessary
import {
  createOpportunity,
  deleteOpportunity,
  getOpportunity,
  updateOpportunity,
} from "../../store/opportunity/actions";

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
  });

  const [filterFields, setFilterFields] = useState({
    title: "",
    type: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // Meta title`
  document.title = "Opportunity | Raise ";

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

  // Confirm opportunity deletion
  const confirmDeleteOpportunity = () => {
    dispatch(deleteOpportunity(selectedOpportunity._id));
    toggleDeleteModal();
  };

  // Handle input change for update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOpportunity({ ...selectedOpportunity, [name]: value });
  };

  const columns = useMemo(
    () => [
      // {
      //   Header: "No.",
      //   accessor: "id",
      // },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Type",
        accessor: "type",
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
              <i className="bx bx-show" style={{ color: "blue" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleUpdateOpportunity(original)}
            >
              <i className="bx bx-edit" style={{ color: "orange" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleDeleteOpportunity(original)}
            >
              <i className="bx bx-trash" style={{ color: "red" }}></i>
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
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Opportunity")}
            breadcrumbItem={props.t("Opportunity")}
          /> */}

          {/* Button to Add New Opportunity */}
          <div className="d-flex justify-content-end mb-3">
            <Button color="primary" onClick={() => toggleUpdateModal()}>
              Add Opportunity
            </Button>
          </div>
          <Filtering
            setFilterFields={setFilterFields}
            filterFields={filterFields}
            setIsSearching={setIsSearching}
          />

          {loading ? (
            <div className="text-center" style={{ marginTop: 50 }}>
              <Spinner color="primary" />
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
          <Input
            type="text"
            name="title"
            value={selectedOpportunity ? selectedOpportunity.title : ""}
            onChange={handleInputChange}
            placeholder="Enter opportunity title"
            className="mb-2"
          />
          <Input
            type="text"
            name="type"
            value={selectedOpportunity ? selectedOpportunity.type : ""}
            onChange={handleInputChange}
            placeholder="Enter opportunity type"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
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
          <Button color="danger" onClick={confirmDeleteOpportunity}>
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
              <p>
                <strong>Title:</strong> {selectedOpportunity.title}
              </p>
              <p>
                <strong>Type:</strong> {selectedOpportunity.type}
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
