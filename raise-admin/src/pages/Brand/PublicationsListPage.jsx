import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import Pagination from "../../components/Common/Pagination";
// Import components
import TableContainer from "../../components/Common/TableContainer";
import PublicationSearching from "../../components/Publications/PublicationSearching";
import ColumnSelector from "../../components/Common/ColumnSelector";
import "../../assets/themes/colors.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  getPublication,
  updatePublicationStatus,
} from "../../store/publication/actions";
import { getAllPublicationsByBrand } from "../../store/actions";
import { Link } from "react-router-dom";
function PublicationsListPage() {
  const [data, setData] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [isHeaderDropDown, setIsHeaderDropDown] = useState(false);
  const [isViewImageModalOpen, setIsViewImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [filterHeader, setFilterHeader] = useState({
    "opportunityId.title": true,
    createdAt: true,
    "influencerId.username": true,
    "influencerId.platform": true,
    status: true,
    type: true,
    publicationLink: true,
    screenshot: true,
    engagementRate: true,
    followerCount: true,
    likeCount: true,
    commentCount: true,
    shareCount: true,
    viewCount: true,
  });

  const [isSearching, setIsSearching] = useState(false);

  const [filterFields, setFilterFields] = useState({
    influencer: "",
    platform: "",
    status: "",
    type: "",
    engagementRate: 0,
    followerCount: 0,
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    viewCount: 0,
  });

  // Meta title
  document.title = "Publications | Brandraise ";

  const dispatch = useDispatch();
  const { publications, totalPublications, publicationsLoading, error } =
    useSelector((state) => state.Brand);
  const toggleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);

  useEffect(() => {
    dispatch(getAllPublicationsByBrand({ limit, pageCount, ...filterFields }));
  }, [dispatch, limit, pageCount, isSearching]);

  const confirmUpdateRecord = () => {
    if (selectedRecord._id) {
      let payload = {
        _id: selectedRecord._id,
        status: selectedRecord.status,
      };

      dispatch(updatePublicationStatus(payload));
      setImageUrl(null);
    }
    toggleUpdateModal();
  };

  // Handle input change for update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecord({ ...selectedRecord, [name]: value });
  };

  const toggleViewImageModal = () => {
    setIsViewImageModalOpen(!isViewImageModalOpen);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    toggleViewImageModal();
  };

  const getImageUrl = (
    value,
    basePath = import.meta.env.VITE_APP_PUBLICATION_IMAGE_URL
  ) => {
    return `${basePath}${value}`;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "opportunityId.title",
        isVisible: filterHeader.project,
      },
      {
        Header: "Post Date",
        accessor: "createdAt",
        isVisible: filterHeader.postDate,
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = `${String(date.getDate()).padStart(
            2,
            "0"
          )}.${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}.${date.getFullYear()} ${String(date.getHours()).padStart(
            2,
            "0"
          )}:${String(date.getMinutes()).padStart(2, "0")}`;
          return formattedDate;
        },
      },
      {
        Header: "Influencer",
        accessor: "influencerId.username",
        isVisible: filterHeader.influencer,
        Cell: ({ row }) => (
          <Link
            to={`/influencers/${row.original.influencerId._id}`}
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {row.original.influencerId.username}
          </Link>
        ),
      },
      {
        Header: "Social Network",
        accessor: "influencerId.platform",
        isVisible: filterHeader.socialNetwork,
      },
      {
        Header: "Status",
        accessor: "status",
        isVisible: filterHeader.status,
        Cell: ({ value }) => {
          let badgeClass = "";
          let badgeText = value;

          switch (value) {
            case "Pending":
              badgeClass = "badge bg-warning";
              badgeText = "Pending";
              break;
            case "Declined":
              badgeClass = "badge bg-danger";
              badgeText = "Declined";
              break;
            case "Cancelled":
              badgeClass = "badge bg-secondary";
              badgeText = "Cancelled";
              break;
            case "Published":
              badgeClass = "badge bg-success";
              badgeText = "Published";
              break;
            default:
              badgeClass = "badge bg-light";
              badgeText = "Unknown";
              break;
          }

          return <span className={badgeClass}>{badgeText}</span>;
        },
      },
      { Header: "Type", accessor: "type", isVisible: filterHeader.type },
      {
        Header: "Publication Link",
        accessor: "publicationLink",
        isVisible: true,
        Cell: ({ value }) => {
          return (
            <a href={value} target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          );
        },
      },
      {
        Header: "Screen Shots",
        accessor: "screenshot",
        isVisible: true,
        Cell: ({ value }) => {
          const screenshot = value;

          return (
            <div>
              {screenshot && (
                <div>
                  <span
                    onClick={() => handleImageClick(screenshot)}
                    className="publication-screenshot-link"
                  >
                    Image
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        Header: "Engagement Rate (ER)",
        accessor: "engagementRate",
        isVisible: filterHeader.ER,
      },
      {
        Header: "Follower",
        accessor: "followerCount",
        isVisible: filterHeader.follower,
      },
      {
        Header: "Like",
        accessor: "likeCount",
        isVisible: filterHeader.likes,
      },
      {
        Header: "Comments",
        accessor: "commentCount",
        isVisible: filterHeader.comments,
      },
      {
        Header: "share",
        accessor: "shareCount",
        isVisible: filterHeader.shares,
      },
      {
        Header: "Views",
        accessor: "viewCount",
        isVisible: filterHeader.views,
      },
    ],
    [filterHeader]
  );

  const visibleColumns = useMemo(
    () => columns.filter((column) => filterHeader[column.accessor]),
    [columns, filterHeader]
  );

  const toggleFilterModal = () => setIsShowFilter(!isShowFilter);

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* <Breadcrumbs title="Publications" breadcrumbItem="Publications" /> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="header-title font-size-18 text-uppercase">
            Publications
          </h4>
          <div className="d-flex gap-2">
            <Dropdown
              isOpen={isHeaderDropDown}
              toggle={() => setIsHeaderDropDown(!isHeaderDropDown)}
              className="d-inline-block publication-filter-icon"
            >
              <DropdownToggle>
                <i className="bx bx-filter"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end publication-filter-container">
                <ColumnSelector
                  columns={columns}
                  filterHeader={filterHeader}
                  setFilterHeader={setFilterHeader}
                />
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <PublicationSearching
          filterFields={filterFields}
          setFilterFields={setFilterFields}
          setIsSearching={setIsSearching}
        />

        {publicationsLoading ? (
          <div className="text-center space-top">
            <Spinner style={{ color: "var(--primary-purple)" }} />{" "}
          </div>
        ) : (
          <>
            {publications?.length ? (
              <>
                <TableContainer
                  columns={visibleColumns}
                  data={publications}
                  isGlobalFilter={true}
                  isAddOptions={false}
                  customPageSize={10}
                  className="custom-header-css"
                  isPagination={false}
                />
                <Pagination
                  totalData={totalPublications}
                  setLimit={setLimit}
                  setPageCount={setPageCount}
                  limit={limit}
                  pageCount={pageCount}
                  currentPage={pageCount}
                />
              </>
            ) : (
              <h1 className="text-center space-top">No publications Found</h1>
            )}
          </>
        )}

        {/* Update Modal */}
        <Modal isOpen={isUpdateModalOpen} toggle={toggleUpdateModal}>
          <ModalHeader toggle={toggleUpdateModal}>Update Record</ModalHeader>
          <ModalBody>
            <Row>
              <Col md={12}>
                <label>Status</label>
                <Input
                  type="select"
                  name="status"
                  value={selectedRecord?.status}
                  onChange={handleInputChange}
                  className="mb-3"
                >
                  {["Pending", "Declined", "Cancelled", "Published"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    )
                  )}
                </Input>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              style={{
                backgroundColor: "var(--primary-purple)",
                color: "var(--primary-white)",
              }}
              onClick={confirmUpdateRecord}
            >
              Save
            </Button>
            <Button color="secondary" onClick={toggleUpdateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* View Modal */}
        <Modal isOpen={isViewModalOpen} toggle={toggleViewModal}>
          <ModalHeader toggle={toggleViewModal}>View Record</ModalHeader>
          <ModalBody>
            <div className="model-format">
              <p>
                <strong>Title</strong>
              </p>
              <p>: {selectedRecord?.opportunityId?.title}</p>

              <p>
                <strong>Post Date</strong>
              </p>
              <p>: {new Date(selectedRecord?.createdAt).toLocaleString()}</p>

              <p>
                <strong>Influencer</strong>
              </p>
              <p>: {selectedRecord?.influencerId?.username}</p>

              <p>
                <strong>Social Network</strong>
              </p>
              <p>: {selectedRecord?.influencerId?.platform}</p>

              <p>
                <strong>Status</strong>
              </p>
              <p>
                : <span>{selectedRecord?.status}</span>
              </p>

              <p>
                <strong>Type</strong>
              </p>
              <p>: {selectedRecord?.type}</p>

              <p>
                <strong>Publication Link</strong>
              </p>
              <p className="publicatio-link-box">
                :&nbsp;
                <a
                  className="publication-link"
                  href={selectedRecord?.publicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedRecord?.publicationLink}
                </a>
              </p>

              <p>
                <strong>Engagement Rate (ER)</strong>
              </p>
              <p>: {selectedRecord?.engagementRate}</p>

              <p>
                <strong>Follower Count</strong>
              </p>
              <p>: {selectedRecord?.followerCount}</p>

              <p>
                <strong>Like Count</strong>
              </p>
              <p>: {selectedRecord?.likeCount}</p>

              <p>
                <strong>Comments Count</strong>
              </p>
              <p>: {selectedRecord?.commentCount}</p>

              <p>
                <strong>Share Count</strong>
              </p>
              <p>: {selectedRecord?.shareCount}</p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={toggleViewModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={isViewImageModalOpen} // Control modal visibility
          toggle={toggleViewImageModal} // Close modal on background click
          size="lg"
        >
          <ModalBody>
            {selectedImage && (
              <img
                src={getImageUrl(selectedImage)}
                alt="Selected"
                className="publication-image"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleViewImageModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default PublicationsListPage;
