import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
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
import { fetchTicketsRequest, updateTicketRequest } from "../../store/actions";
import axios from "axios";
const CouponManagement = (props) => {
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  
  const dispatch = useDispatch();

  const handleEdit = (item) => {
    setSelectedOpportunity(item);
    setCouponCode(item.couponCode || ""); 
    setIsEditModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      id : selectedOpportunity._id,
      influencerId: selectedOpportunity.influencerId._id,
      opportunityId: selectedOpportunity.opportunity._id,
      couponCode
    };
  
    dispatch(updateTicketRequest(payload));
    dispatch(
      fetchTicketsRequest({
        limit,
        pageCount,
      })
    );
    setIsEditModalOpen(false);
  };

  document.title = "Coupon Management | Brandraise ";
  
  
  const { opportunitiesData ,loading } = useSelector((state) => state.opportunity);

  useEffect(() => {
    dispatch(
      fetchTicketsRequest({
        limit,
        pageCount
      })
    );
  }, [dispatch, limit, pageCount]);

  const columns = useMemo(() => [
    {
      Header: "Image",
      accessor: "opportunity.imageUrl",
      Cell: ({ value }) => (
        <img
          src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/opportunityImage/${value}`}
          alt="Opportunity"
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
        />
      ),
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
      accessor: row => `${row.influencerData.firstName} ${row.influencerData.lastName}`,
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
        <Button
          onClick={() => handleEdit(row.original)}
          size="lg"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--primary-purple)",
          }}
        >
          <i className="bx bx-edit" style={{ color: "var(--secondary-yellow)" }}></i>
        </Button>
      ),
    },
  ], []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18" style={{ textTransform: "uppercase" }}>
              Manage Coupons
            </h4>
          </div>
          {loading ? (
            <div className="text-center" style={{ marginTop: 50 }}>
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

                  {/* <Pagination
                    totalData={totalBrands}
                    setLimit={setLimit}
                    setPageCount={setPageCount}
                    limit={limit}
                    pageCount={pageCount}
                    currentPage={pageCount}
                  /> */}
                </>
              ) : (
                <h1 className="text-center" style={{ marginTop: 50 }}>
                  No Coupon Ticket Found
                </h1>
              )}
            </>
          )}
        </Container>
      </div>

      {/* Update Modal */}
      <Modal isOpen={isEditModalOpen} toggle={() => setIsEditModalOpen(!isEditModalOpen)}>
        <ModalHeader toggle={() => setIsEditModalOpen(!isEditModalOpen)}>
          Manage Coupon
        </ModalHeader>
        <ModalBody>
          {selectedOpportunity && (
            <>
              <div className="mb-3 text-left">
                <img
                  src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/opportunityImage/${selectedOpportunity.opportunity.imageUrl}`}
                  alt="Opportunity"
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
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
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                />
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button color="secondary" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

    </React.Fragment>
  );
};

export default withTranslation()(CouponManagement);
