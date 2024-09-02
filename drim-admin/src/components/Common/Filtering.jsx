import React from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";

const Filtering = ({ setFilterFields, filterFields, setIsSearching }) => {
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
        <Col md="6">
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
        <Col md="6">
          <FormGroup>
            <Label for="type">Type</Label>
            <Input
              id="type"
              type="text"
              placeholder="Enter Type"
              className="form-control"
              name="type"
              value={filterFields.type}
              onChange={handleFilter}
            />
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
};

export default Filtering;
