import React from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import '../../components/UI/ButtonStyles.css'
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
        <Col  xs="12" sm="6"  md="2">
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
        <Col  xs="12" sm="6"  md="2">
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
        <Col xs="3" sm="2" md="auto" className="d-flex align-items-center mt-2">
          <Button  className="w-100 custom-button custom-button-primary" onClick={handleSearch}>
          <i className="bx bx-search-alt-2"></i>
          </Button>
        </Col>
        <Col xs="3" sm="2" md="auto" className="d-flex align-items-center mt-2">
          <Button  className="w-100 custom-button custom-button-danger" onClick={handleClear}>
          <i className="bx bx-x"></i>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Filtering;
