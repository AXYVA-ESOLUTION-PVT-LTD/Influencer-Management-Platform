import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

// Import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import publicationData from "../../data/publication";
import PublicationSearching from "../../components/publications/PublicationSearching";
import ColumnSelector from "../../components/Common/ColumnSelector";

function PublicationsPage() {
  // State for managing data
  const [data, setData] = useState(publicationData);

  // State for modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const [isHeaderDropDown, setIsHeaderDropDown] = useState(false);

  const [filterHeader, setFilterHeader] = useState({
    project: true,
    postDate: true,
    influencer: true,
    socialNetwork: true,
    internalModeration: false,
    status: true,
    type: true,
    price: true,
    ER: true,
    follower: true,
    approximateReach: false,
    likes: false,
    comments: false,
    videoViews: false,
    views: false,
    country: false,

    publicationLink: "",
    screenShots: "",
  });

  const [isSearching, setIsSearching] = useState(false);

  const [filterFields, setFilterFields] = useState({
    project: "",
    postDate: "",
    influencer: "",
    socialNetwork: "",
    internalModeration: null,
    status: "",
    type: "",
    price: 0,
    ER: "",
    follower: "",
    approximateReach: "",
    likes: "",
    comments: "",
    videoViews: "",
    views: "",
    country: "",

    publicationLink: "",
    screenShots: "",
  });

  // Meta title
  document.title =
    "Publications | Drim - Vite React Admin & Dashboard Template";

  // Toggle modals
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);

  // useEffect(() => {
  //   console.log({ filterFields });
  // }, [isSearching]);

  //

  // Handle update
  const handleUpdateRecord = (record) => {
    setSelectedRecord(record);
    toggleUpdateModal();
  };

  // Handle delete
  const handleDeleteRecord = (record) => {
    setSelectedRecord(record);
    toggleDeleteModal();
  };

  // Confirm record update
  const confirmUpdateRecord = () => {
    if (selectedRecord.id) {
      const updatedData = data.map((item) =>
        item.id === selectedRecord.id ? { ...item, ...selectedRecord } : item
      );
      setData(updatedData);
    } else {
      const newRecord = { id: data.length + 1, ...selectedRecord };
      setData([...data, newRecord]);
    }
    toggleUpdateModal();
  };

  // Confirm record deletion
  const confirmDeleteRecord = () => {
    const updatedData = data.filter((item) => item.id !== selectedRecord.id);
    setData(updatedData);
    toggleDeleteModal();
  };

  // Handle input change for update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecord({ ...selectedRecord, [name]: value });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Project",
        accessor: "project",
        isVisible: filterHeader.project,
      },
      {
        Header: "Post Date",
        accessor: "postDate",
        isVisible: filterHeader.postDate,
      },
      {
        Header: "Internal Moderation",
        accessor: "internalModeration",
        isVisible: filterHeader.internalModeration,
      },
      {
        Header: "Influencer",
        accessor: "influencer",
        isVisible: filterHeader.influencer,
      },
      {
        Header: "Social Network",
        accessor: "socialNetwork",
        isVisible: filterHeader.socialNetwork,
      },
      { Header: "Status", accessor: "status", isVisible: filterHeader.status },
      { Header: "Type", accessor: "type", isVisible: filterHeader.type },
      {
        Header: "Publication Link",
        accessor: "publicationLink",
        isVisible: true,
      },
      { Header: "Screen Shots", accessor: "screenShots", isVisible: true },
      { Header: "Price", accessor: "price", isVisible: filterHeader.price },
      {
        Header: "Engagement Rate (ER)",
        accessor: "ER",
        isVisible: filterHeader.ER,
      },
      {
        Header: "Follower Count",
        accessor: "follower",
        isVisible: filterHeader.follower,
      },
      {
        Header: "Approximate Reach",
        accessor: "approximateReach",
        isVisible: filterHeader.approximateReach,
      },
      { Header: "Likes", accessor: "likes", isVisible: filterHeader.likes },
      {
        Header: "Comments",
        accessor: "comments",
        isVisible: filterHeader.comments,
      },
      { Header: "Views", accessor: "views", isVisible: filterHeader.views },
      {
        Header: "Video Views",
        accessor: "videoViews",
        isVisible: filterHeader.videoViews,
      },
      {
        Header: "Actions",
        accessor: "actions",
        isVisible: true,
        Cell: ({ row }) => (
          <>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => {
                setSelectedRecord(row.original);
                toggleViewModal();
              }}
            >
              <i className="bx bx-show" style={{ color: "blue" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleUpdateRecord(row.original)}
            >
              <i className="bx bx-edit" style={{ color: "orange" }}></i>
            </Button>
            <Button
              color="link"
              size="lg"
              className="p-0"
              onClick={() => handleDeleteRecord(row.original)}
            >
              <i className="bx bx-trash" style={{ color: "red" }}></i>
            </Button>
          </>
        ),
      },
    ],
    [
      filterHeader,
      setSelectedRecord,
      toggleViewModal,
      handleUpdateRecord,
      handleDeleteRecord,
    ]
  );

  const visibleColumns = useMemo(
    () => columns.filter((column) => column.isVisible),
    [columns, filterHeader]
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* <Breadcrumbs title="Publications" breadcrumbItem="Publications" /> */}
        <div className="d-flex justify-content-end mb-3 gap-2 position-relative">
          <Button
            color="primary"
            onClick={() => setIsShowFilter(!isShowFilter)}
          >
            {isShowFilter ? "Hide " : "Show "}Filters
          </Button>

          {/* <Button
            color="primary"
            onClick={() =>
              handleUpdateRecord({
                id: null,
                firstName: "",
                lastName: "",
                email: "",
              })
            }
          >
            Add Publication
          </Button> */}

          <Dropdown
            isOpen={isHeaderDropDown}
            toggle={() => setIsHeaderDropDown(!isHeaderDropDown)}
            className="d-inline-block"
          >
            <DropdownToggle>
              <i className="bx bx-filter" style={{ fontSize: 18 }}></i>
            </DropdownToggle>
            <DropdownMenu
              className="dropdown-menu-end"
              style={{
                maxHeight: 300,
                width: 200,
                overflowY: "scroll",
                zIndex: 1000,
                padding: "5px 15px",
                marginTop: "12px",
              }}
            >
              <ColumnSelector
                columns={columns}
                filterHeader={filterHeader}
                setFilterHeader={setFilterHeader}
              />
            </DropdownMenu>
          </Dropdown>
        </div>

        {isShowFilter && (
          <PublicationSearching
            filterFields={filterFields}
            setFilterFields={setFilterFields}
            setIsSearching={setIsSearching}
          />
        )}

        <TableContainer
          columns={visibleColumns}
          data={data}
          isGlobalFilter={true}
          isAddOptions={false}
          customPageSize={10}
          className="custom-header-css"
          isPagination={false}
        />

        {/* Update Modal */}
        <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
          <ModalHeader toggle={toggleUpdateModal}>Update Record</ModalHeader>
          <ModalBody>
            <Input
              name="firstName"
              value={selectedRecord?.firstName || ""}
              onChange={handleInputChange}
              placeholder="First Name"
              className="mb-3"
            />
            <Input
              name="lastName"
              value={selectedRecord?.lastName || ""}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="mb-3"
            />
            <Input
              name="email"
              value={selectedRecord?.email || ""}
              onChange={handleInputChange}
              placeholder="Email"
              className="mb-3"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={confirmUpdateRecord}>
              Save
            </Button>
            <Button color="secondary" onClick={toggleUpdateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
          <ModalHeader toggle={toggleDeleteModal}>Delete Record</ModalHeader>
          <ModalBody>Are you sure you want to delete this record?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={confirmDeleteRecord}>
              Delete
            </Button>
            <Button color="secondary" onClick={toggleDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* View Modal */}
        <Modal isOpen={isViewModalOpen} toggle={toggleViewModal}>
          <ModalHeader toggle={toggleViewModal}>View Record</ModalHeader>
          <ModalBody>
            <p>
              <strong>Project:</strong> {selectedRecord?.project}
            </p>
            <p>
              <strong>Post Date:</strong> {selectedRecord?.postDate}
            </p>
            <p>
              <strong>Internal Moderation:</strong>{" "}
              {selectedRecord?.internalModeration || "N/A"}
            </p>
            <p>
              <strong>Influencer:</strong> {selectedRecord?.influencer}
            </p>
            <p>
              <strong>Social Network:</strong> {selectedRecord?.socialNetwork}
            </p>
            <p>
              <strong>Status:</strong> {selectedRecord?.status}
            </p>
            <p>
              <strong>Type:</strong> {selectedRecord?.type}
            </p>
            <p>
              <strong>Publication Link:</strong>
              <a
                href={selectedRecord?.publicationLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedRecord?.publicationLink}
              </a>
            </p>
            <p>
              <strong>Screen Shots:</strong>
              <a
                href={selectedRecord?.screenShots}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedRecord?.screenShots}
              </a>
            </p>
            <p>
              <strong>Price:</strong> ${selectedRecord?.price}
            </p>
            <p>
              <strong>Engagement Rate (ER):</strong> {selectedRecord?.ER}
            </p>
            <p>
              <strong>Follower Count:</strong> {selectedRecord?.follower}
            </p>
            <p>
              <strong>Approximate Reach:</strong>{" "}
              {selectedRecord?.approximateReach}
            </p>
            <p>
              <strong>Likes:</strong> {selectedRecord?.likes}
            </p>
            <p>
              <strong>Comments:</strong> {selectedRecord?.comments}
            </p>
            <p>
              <strong>Views:</strong> {selectedRecord?.views}
            </p>
            <p>
              <strong>Video Views:</strong> {selectedRecord?.videoViews}
            </p>
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={toggleViewModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default PublicationsPage;
