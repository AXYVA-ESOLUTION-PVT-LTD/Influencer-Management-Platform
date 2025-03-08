import React, { useEffect, useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Container, Spinner } from "reactstrap";
import TableContainer from "../../components/Common/TableContainer"; // Adjust import path if necessary
import { getInfluencers } from "../../store/influencers/actions";
import ROLES from "../../constants/role";
import Pagination from "../../components/Common/Pagination";
import InfluencerFiltering from "../../components/Common/InfluencerFiltering";
import "../../assets/themes/colors.scss";
import { Link } from "react-router-dom";
const InfluencerListPage = (props) => {
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [filterFields, setFilterFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isSearching, setIsSearching] = useState(false);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Meta title
  document.title = "Influencer | Brandraise ";

  const dispatch = useDispatch();

  const { influencers, loading, error, totalInfluencers, currentPage } =
    useSelector((state) => state.Influencer);

  // Get Influencer when Mount
  useEffect(() => {
    dispatch(
      getInfluencers({
        roleName: ROLES.INFLUENCER,
        limit,
        pageCount,
        ...filterFields,
        sortBy,
        sortOrder,
        allrecord: false,
      })
    );
  }, [dispatch, limit, pageCount, isSearching, sortOrder, sortBy]);

  const columns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
        Cell: ({ row }) => (
          <Link
            to={`/influencers/${row.original._id}`}
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {row.original.username}
          </Link>
        ),
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
        Header: "Phone Number",
        accessor: "phoneNumber",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "City",
        accessor: "city",
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: "Country",
        accessor: "country",
        Cell: ({ value }) => (value ? value : "-"),
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">Influencers</h4>
          </div>
          {/* filtering */}
          <InfluencerFiltering
            filterFields={filterFields}
            setFilterFields={setFilterFields}
            setIsSearching={setIsSearching}
          />

          {loading ? (
            <div className="text-center space-top">
              <Spinner style={{ color: "var(--primary-purple)" }} />{" "}
            </div>
          ) : (
            <>
              {influencers.length ? (
                <>
                  <TableContainer
                    columns={columns}
                    data={influencers}
                    isGlobalFilter={false}
                    isAddOptions={false}
                    customPageSize={10}
                    className="custom-header-css"
                    isPagination={false}
                    isSorting={false}
                    setSortBy={setSortBy}
                    sortBy={sortBy}
                    setSortOrder={setSortOrder}
                    sortOrder={sortOrder}
                  />
                  <Pagination
                    totalData={totalInfluencers}
                    setLimit={setLimit}
                    setPageCount={setPageCount}
                    limit={limit}
                    pageCount={pageCount}
                    currentPage={pageCount}
                  />
                </>
              ) : (
                <h1 className="text-center space-top">No Influencer Found</h1>
              )}
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(InfluencerListPage);
