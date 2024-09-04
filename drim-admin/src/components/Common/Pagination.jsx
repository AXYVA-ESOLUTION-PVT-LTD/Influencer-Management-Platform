import React from "react";
import { Button, Col, Input, Row } from "reactstrap";

const Pagination = ({
  setLimit,
  setPageCount,
  customPageSizeOptions,
  totalData,
  limit,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalData / limit);
  const handleNext = () => {
    setPageCount((prev) => prev + 1);
  };
  const handlePrev = () => {
    setPageCount((prev) => prev - 1);
  };
  const handleFirstPage = () => {
    setPageCount(0);
  };
  const handleLastPage = () => {
    setPageCount(totalPages - 1);
  };

  const handleShowMore = (e) => {
    setLimit(Number(e.target.value));
    setPageCount(0); // Reset to first page when changing limit
  };

  const canNextPage = currentPage < totalPages - 1;
  const canPreviousPage = currentPage > 0;

  return (
    <div className="d-flex justify-content-between">
      <Col md={customPageSizeOptions ? 2 : 1}>
        <select className="form-select" value={limit} onChange={handleShowMore}>
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </Col>
      <Col>
        <Row className="justify-content-md-end justify-content-center align-items-center">
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={handleFirstPage}
                disabled={!canPreviousPage}
              >
                {"<<"}
              </Button>
              <Button
                color="primary"
                onClick={handlePrev}
                disabled={!canPreviousPage}
              >
                {"<"}
              </Button>
            </div>
          </Col>
          <Col className="col-md-auto d-none d-md-block">
            Page{" "}
            <strong>
              {currentPage + 1} of {totalPages}
            </strong>
          </Col>
          <Col className="col-md-auto">
            <Input
              type="number"
              min={1}
              style={{ width: 70 }}
              max={totalPages}
              value={currentPage + 1}
              onChange={(e) => {
                const page =
                  Math.max(1, Math.min(Number(e.target.value), totalPages)) - 1;
                setPageCount(page);
              }}
            />
          </Col>

          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={handleNext}
                disabled={!canNextPage}
              >
                {">"}
              </Button>
              <Button
                color="primary"
                onClick={handleLastPage}
                disabled={!canNextPage}
              >
                {">>"}
              </Button>
            </div>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default Pagination;
