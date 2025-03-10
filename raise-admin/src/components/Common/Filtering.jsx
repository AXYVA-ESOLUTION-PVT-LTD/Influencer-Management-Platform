import React, { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getBrand } from "../../store/brand/actions";
import ROLES from "../../constants/role";
import "../../components/UI/ButtonStyles.css";
import "../../assets/themes/colors.scss";

const Filtering = ({ setFilterFields, filterFields, setIsSearching }) => {
  const dispatch = useDispatch();
  const { brands, totalBrands } = useSelector((state) => state.Brand);
  const [brandData, setBrandData] = useState([]);
  const [brandPage, setBrandPage] = useState(0);

  useEffect(() => {
    if (brandData.length < totalBrands || totalBrands === null) {
      dispatch(
        getBrand({
          roleName: ROLES.BRAND,
          allrecord: false,
          limit: 10,
          pageCount: brandPage,
        })
      );
    }
  }, [brandPage, dispatch]);

  useEffect(() => {
    const uniqueBrands = new Map();
    brandData.forEach((brand) => uniqueBrands.set(brand._id, brand));
    brands.forEach((brand) => uniqueBrands.set(brand._id, brand));
    setBrandData(Array.from(uniqueBrands.values()));
  }, [brands]);

  const handleMenuScrollToBottom = () => {
    if (brandData.length < totalBrands) {
      setBrandPage((prevPage) => prevPage + 1);
    }
  };

  const handleMenuClose = () => {
    setBrandData([]);
    setBrandPage(0);
    dispatch(
      getBrand({
        roleName: ROLES.BRAND,
        allrecord: false,
        limit: 10,
        pageCount: 0,
      })
    );
  };

  const brandOptions = brandData
    ?.filter((brand) => brand.companyName)
    .map((brand) => ({
      value: brand.companyName,
      label: brand.companyName,
    }));

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilterFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandChange = (selectedOption) => {
    setFilterFields((prev) => ({ ...prev, brand: selectedOption.value }));
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
        <Col xs="12" sm="6" md="2">
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
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="brand">Brand</Label>
            <Select
              options={
                brandOptions.some(
                  (option) => option.value === filterFields.brand
                )
                  ? brandOptions
                  : [
                      ...brandOptions,
                      {
                        value: filterFields.brand,
                        label: filterFields.brand,
                      },
                    ]
              }
              value={
                filterFields.brand
                  ? brandOptions.find(
                      (option) => option.value === filterFields.brand
                    ) || {
                      value: filterFields.brand,
                      label: filterFields.brand,
                    }
                  : null 
              }
              placeholder="-- Select Brand --"
              onChange={handleBrandChange}
              onMenuScrollToBottom={handleMenuScrollToBottom}
              onMenuClose={handleMenuClose}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 300,
                  overflowY: "auto",
                }),
              }}
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
};

export default Filtering;
