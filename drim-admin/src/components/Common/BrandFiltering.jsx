import React from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import '../../components/UI/ButtonStyles.css';
import '../../assets/themes/colors.scss';
function BrandFiltering({ filterFields, setFilterFields, setIsSearching }) {
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
        <Col  xs="12" sm="6" md="2">
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
        <Col  xs="12" sm="6" md="2">
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
        <Col  xs="12" sm="6" md="2">
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
        <Col  xs="12" sm="6"  md="2">
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
        <Col xs="3" sm="2" md="auto" className="d-flex align-items-center mt-2">
        <Button
          className="w-100 custom-button border-none"
          onClick={handleSearch}
          style={{ backgroundColor  :  "var(--primary-purple)" }}
        >
          <i className="bx bx-search-alt-2" style={{ color  :"var(--primary-white)"}}></i>
        </Button>
      </Col>

      <Col xs="3" sm="2" md="auto" className="d-flex align-items-center mt-2">
        <Button
          className="w-100 custom-button border-none"
          onClick={handleClear}
          style={{ backgroundColor  : "var(--secondary-red)"}}
        >
          <i className="bx bx-x" ></i>
        </Button>
      </Col>
      </Row>
    </div>
  );
}

export default BrandFiltering;
