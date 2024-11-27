import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table, Row, Col, Button, Input } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import '../../assets/themes/colors.scss';
// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Col sm={4}>
      <div className="search-box me-2 mb-2 d-inline-block">
        <div className="position-relative">
          <label htmlFor="search-bar-0" className="search-label">
            <span id="search-bar-0-label" className="sr-only">
              Search this table
            </span>
            <input
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              id="search-bar-0"
              type="text"
              className="form-control"
              placeholder={`${count} records...`}
              value={value || ""}
            />
          </label>
          <i className="bx bx-search-alt search-icon"></i>
        </div>
      </div>
    </Col>
  );
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  className,
  customPageSizeOptions,
  isPagination,
  isFiltering,
  isSorting,
  setSortBy,
  sortBy,
  setSortOrder,
  sortOrder,
}) => {
  const tableHooks = [useGlobalFilter, useExpanded, usePagination];

  if (isFiltering) {
    tableHooks.shift(useFilters);
  }

  if (isSorting) {
    tableHooks.shift(useSortBy);
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, filters },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
    ...tableHooks
  );

  const generateSortingIndicator = (column) => {
    return isSorting && column.isSorted
      ? column.isSortedDesc
        ? " 🔽"
        : " 🔼"
      : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  const handleSort = (value) => {
    if (value === "actions") {
      return;
    }
    if (value === sortBy) {
      setSortOrder(sortOrder === -1 ? 1 : -1);
    } else {
      setSortBy(value);
      setSortOrder(1);
    }
  };
  return (
    <Fragment>
      <Row className="mb-2">
        {isPagination && (
          <Col md={customPageSizeOptions ? 2 : 1}>
            <select
              className="form-select"
              value={pageSize}
              onChange={onChangeInSelect}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}

        {/* {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )} */}

        {isAddOptions && (
          <Col sm="11">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col sm="11">
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="11">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const headerTitle = column.render("Header");
                  const accessorTitle = column.render("id");

                  return (
                    <th
                      key={column.id}
                      onClick={() => handleSort(accessorTitle)}
                    >
                      <div
                        className="mb-2"
                        style={{
                          cursor: "pointer",
                        }}
                        {...(isSorting ? column.getSortByToggleProps() : {})}
                      >
                        {headerTitle}
                        {sortBy === accessorTitle ? (
                          sortOrder === -1 ? (
                            <i className="bx bx-sort-down"></i>
                          ) : sortOrder === 1 ? (
                            <i className="bx bx-sort-up"></i>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {generateSortingIndicator(column)}
                      </div>
                      {isFiltering && column.Header !== "Actions" && (
                        <Filter column={column} />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr>
                    {row.cells.map((cell) => {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>

      {isPagination && (
        <Row className="justify-content-md-end justify-content-center align-items-center">
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                style={{ backgroundColor  :  "var(--primary-purple)" ,color  : "var(--primary-white)"}}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="border-none"
              >
                {"<<"}
              </Button>
              <Button
                style={{ backgroundColor  : "var(--primary-purple)",color  : "var(--primary-white)"}}
                onClick={previousPage}
                disabled={!canPreviousPage}
                className="border-none"
              >
                {"<"}
              </Button>
            </div>
          </Col>
          <Col className="col-md-auto d-none d-md-block">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Col>
          <Col className="col-md-auto">
            <Input
              type="number"
              min={1}
              style={{ width: 70 }}
              max={pageOptions.length}
              value={pageIndex + 1}
              onChange={onChangeInInput}
            />
          </Col>

          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                style={{ backgroundColor  : "var(--primary-purple)" ,color  : "var(--primary-white)"}}
                onClick={nextPage}
                disabled={!canNextPage}
                className="border-none"
              >
                {">"}
              </Button>
              <Button
                style={{ backgroundColor  : "var(--primary-purple)" ,color  : "var(--primary-white)"}}
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className="border-none"
              >
                {">>"}
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
