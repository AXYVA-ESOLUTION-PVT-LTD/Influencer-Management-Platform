import React from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import "../../components/UI/ButtonStyles.css";
import "../../assets/themes/colors.scss";

const TicketFiltering = ({ setFilterFields, filterFields, setIsSearching }) => {
  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilterFields((prev) => ({ ...prev, [name]: value }));
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
        {/* Title Field */}
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter Title"
              className="form-control"
              name="title"
              value={filterFields.title}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>

        {/* Name Field */}
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter Name"
              className="form-control"
              name="name"
              value={filterFields.name}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>

        {/* Email Field */}
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email"
              className="form-control"
              name="email"
              value={filterFields.email}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>

        {/* Status Dropdown */}
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="status">Status</Label>
            <Input
              id="status"
              type="select"
              className="form-control"
              name="status"
              value={filterFields.status}
              onChange={handleFilter}
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Read">Read</option>
              <option value="Completed">Completed</option>
            </Input>
          </FormGroup>
        </Col>

        {/* Search Button */}
        <Col xs="3" sm="2" md="auto" className="d-flex align-items-center mt-2">
          <Button
            className="w-100 custom-button border-none"
            style={{ backgroundColor: "var(--primary-purple)" }}
            onClick={handleSearch}
          >
            <i className="bx bx-search-alt-2"></i>
          </Button>
        </Col>

        {/* Clear Button */}
        <Col xs="3" sm="2" md="auto" className="d-flex align-items-center mt-2">
          <Button
            className="w-100 custom-button border-none"
            style={{ backgroundColor: "var(--secondary-red)" }}
            onClick={handleClear}
          >
            <i className="bx bx-x"></i>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default TicketFiltering;
