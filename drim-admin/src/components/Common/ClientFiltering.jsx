import React from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";

function ClientFiltering({ filterFields, setFilterFields, setIsSearching }) {
  const handleFilter = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setFilterFields((prev) => ({
        ...prev,
        [name]: value === "active" ? true : value === "inactive" ? false : "",
      }));
    } else {
      setFilterFields((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSearch = () => {
    setIsSearching((prev) => !prev);
  };
  const handleClear = () => {
    setFilterFields(
      Object.fromEntries(Object.keys(filterFields).map((key) => [key, ""]))
    );
    setIsSearching((prev) => !prev);
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col md="3">
          <FormGroup>
            <Label for="firstName">First Name</Label>
            <Input
              type="text"
              placeholder="Enter First Name"
              className="form-control"
              name="firstName"
              value={filterFields.firstName}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label for="lastName">Last Name</Label>
            <Input
              type="text"
              placeholder="Enter Type"
              className="form-control"
              name="lastName"
              value={filterFields.lastName}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="text"
              placeholder="Enter Email"
              className="form-control"
              name="email"
              value={filterFields.email}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label for="status">Status</Label>
            <Input
              type="select"
              placeholder="Enter Type"
              className="form-control"
              name="status"
              value={
                filterFields.status === true
                  ? "active"
                  : filterFields.status === false
                  ? "inactive"
                  : ""
              }
              onChange={handleFilter}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>
      <Row className="align-item-center justify-content-center">
        <Col md="2">
          <Button color="primary" className="w-100" onClick={handleSearch}>
            Search
          </Button>
        </Col>
        <Col md="2">
          <Button color="danger" className="w-100" onClick={handleClear}>
            Clear Filter
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ClientFiltering;
