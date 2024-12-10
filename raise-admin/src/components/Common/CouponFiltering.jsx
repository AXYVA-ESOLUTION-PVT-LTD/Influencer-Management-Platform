import React from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import "../../components/UI/ButtonStyles.css";
import "../../assets/themes/colors.scss";
function CouponFiltering({ setFilterFields, filterFields, setIsSearching }) {
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
        {/* Brand filter */}
        <Col xs="12" sm="6" md="3">
          <FormGroup>
            <Label for="brand">Brand</Label>
            <Input
              id="brand"
              type="text"
              placeholder="Enter Brand"
              className="form-control"
              name="brand"
              value={filterFields.brand}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>

        {/* Opportunity Title filter */}
        <Col xs="12" sm="6" md="3">
          <FormGroup>
            <Label for="title">Opportunity Title</Label>
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

        {/* Influencer Name filter */}
        <Col xs="12" sm="6" md="3">
          <FormGroup>
            <Label for="influencerName">Influencer Name</Label>
            <Input
              id="influencerName"
              type="text"
              placeholder="Enter Influencer Name"
              className="form-control"
              name="influencerName"
              value={filterFields.influencerName}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col xs="3" sm="2" md="auto" className="d-flex align-items-center mt-2">
          <Button
            className="w-100 custom-button border-none"
            style={{ backgroundColor: "var(--primary-purple)" }}
            onClick={handleSearch}
          >
            <i className="bx bx-search-alt-2"></i>
          </Button>
        </Col>
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
}

export default CouponFiltering;
