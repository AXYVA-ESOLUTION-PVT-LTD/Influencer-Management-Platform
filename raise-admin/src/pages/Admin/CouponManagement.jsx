import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import Pagination from "../../components/Common/Pagination";
import TableContainer from "../../components/Common/TableContainer";
import "../../assets/themes/colors.scss";
import PropTypes from "prop-types";
import {
  createNotification,
  deleteTicketRequest,
  fetchTicketsRequest,
  updateTicketRequest,
} from "../../store/actions";
import axios from "axios";
import CouponFiltering from "../../components/Common/CouponFiltering";
const CouponManagement = (props) => {
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterFields, setFilterFields] = useState({
    brand: "",
    title: "",
    influencerName: "",
  });
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();

  const handleEdit = (item) => {
    setSelectedOpportunity(item);
    setCouponCode(item.couponCode || "");
    setIsEditModalOpen(true);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDelete = (coupon) => {
    setSelectedCoupon(coupon);
    toggleDeleteModal();
  };

  const confirmDeleteCoupon = () => {
    if (selectedCoupon) {
      dispatch(deleteTicketRequest({ ticketId: selectedCoupon._id }));
      toggleDeleteModal();
      dispatch(fetchTicketsRequest({ limit, pageCount, ...filterFields }));
    }
  };

  const handleSubmit = () => {
    
    if (!isValid || couponCode.trim().length === 0) {
      setIsValid(false);
      setErrorMessage("Please enter a valid coupon code.");
      return;
    }

    const payload = {
      id: selectedOpportunity._id,
      influencerId: selectedOpportunity.influencerId._id,
      opportunityId: selectedOpportunity.opportunity._id,
      couponCode,
    };

    dispatch(updateTicketRequest(payload));

    const newNotification = {
      userId: selectedOpportunity.influencerId._id,
      title: `Coupon Assigned for ${selectedOpportunity.opportunity.title}`,
      message: `A coupon code has been assigned to you for the opportunity: ${selectedOpportunity.opportunity.title}.`,
    };

    dispatch(createNotification(newNotification));

    setCouponCode("");
    setIsValid(true);
    setErrorMessage("");
    setIsEditModalOpen(false);
    
    dispatch(
      fetchTicketsRequest({
        limit,
        pageCount,
        ...filterFields,
      })
    );
  };

  document.title = "Coupon Management | Brandraise ";

  const { opportunitiesData, loading, totalRecords } = useSelector(
    (state) => state.Opportunity
  );

  useEffect(() => {
    dispatch(
      fetchTicketsRequest({
        limit,
        pageCount,
        ...filterFields,
      })
    );
  }, [dispatch, limit, pageCount, isSearching]);

  const getImageUrl = (
    value,
    basePath = import.meta.env.VITE_APP_BASE_IMAGE_URL
  ) => {
    return value.startsWith("http") || value.startsWith("https")
      ? value
      : `${basePath}${value}`;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Image",
        accessor: "opportunity.imageUrl",
        Cell: ({ value }) => {
          const imageUrl = getImageUrl(value);

          return (
            <img
              src={imageUrl}
              alt="Opportunity Image"
              className="influencer-image"
            />
          );
        },
      },
      {
        Header: "Brand",
        accessor: "opportunity.brand",
      },
      {
        Header: "Opportunity Title",
        accessor: "opportunity.title",
      },
      {
        Header: "Influencer Name",
        accessor: (row) =>
          `${row.influencerData.firstName} ${row.influencerData.lastName}`,
      },
      {
        Header: "Influencer Email",
        accessor: (row) =>
          `${row.influencerId.email}`,
      },
      {
        Header: "Coupon Code",
        accessor: "couponCode",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <>
            <Button
              color="link"
              size="lg"
              className="p-0 me-2"
              onClick={() => handleEdit(row.original)}
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
              onClick={() => handleDelete(row.original)}
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
    []
  );
  
  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setCouponCode(value);
  
    if (value.length === 0) {
      setIsValid(false);
      setErrorMessage("Coupon code is required.");
    } else if (value.length < 2 || value.length > 20) {
      setIsValid(false);
      setErrorMessage("Coupon code must be between 2 and 20 characters.");
    } else {
      setIsValid(true);
      setErrorMessage("");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">Manage Coupons</h4>
          </div>
          <CouponFiltering
            setFilterFields={setFilterFields}
            filterFields={filterFields}
            setIsSearching={setIsSearching}
          />
          {loading ? (
            <div className="text-center space-top">
              <Spinner style={{ color: "var(--primary-purple)" }} />
            </div>
          ) : (
            <>
              {opportunitiesData.length ? (
                <>
                  <TableContainer
                    columns={columns}
                    data={opportunitiesData}
                    isGlobalFilter={false}
                    isAddOptions={false}
                    customPageSize={10}
                    className="custom-header-css"
                    isPagination={false}
                  />

                  <Pagination
                    totalData={totalRecords}
                    setLimit={setLimit}
                    setPageCount={setPageCount}
                    limit={limit}
                    pageCount={pageCount}
                    currentPage={pageCount}
                  />
                </>
              ) : (
                <h1 className="text-center space-top">
                  No Coupon Ticket Found
                </h1>
              )}
            </>
          )}
        </Container>
      </div>

      {/* Update Modal */}
      <Modal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(!isEditModalOpen)}
      >
        <ModalHeader toggle={() => setIsEditModalOpen(!isEditModalOpen)}>
          Manage Coupon
        </ModalHeader>
        <ModalBody>
          {selectedOpportunity && (
            <>
              <div className="mb-3 text-left">
                <img
                  src={getImageUrl(selectedOpportunity.opportunity.imageUrl)}
                  alt="Opportunity"
                  className="coupon-image"
                />
              </div>
              <div className="mb-3">
                <p>{selectedOpportunity.opportunity.title}</p>
              </div>
              <div className="mb-3">
                <Label for="couponCode">Coupon Code</Label>
                <Input
                  id="couponCode"
                  type="text"
                  value={couponCode}
                  onChange={handleChange}
                  placeholder="Enter coupon code"
                  invalid={!isValid}
                />
                {!isValid && <FormFeedback>{errorMessage}</FormFeedback>}
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit} disabled={!isValid}>
            Submit
          </Button>
          <Button color="secondary" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Model */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete Coupon</ModalHeader>
        <ModalBody>Are you sure you want to delete the coupon ?</ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "var(--secondary-red)",
              color: "var(--primary-white)",
            }}
            onClick={confirmDeleteCoupon}
          >
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

export default withTranslation()(CouponManagement);
