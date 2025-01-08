import React from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import "../../assets/themes/colors.scss";

const PublicationSearching = ({
  filterFields,
  setFilterFields,
  setIsSearching,
}) => {
  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilterFields((prev) => ({
      ...prev,
      [name]: name.includes("Count") || name === "engagementRate" ? Number(value) : value,
    }));
  };

  const handleSearch = () => {
    setIsSearching((prev) => !prev);
  };

  const handleClear = () => {
    setFilterFields({
      influencer: "",
      platform: "",
      status: "",
      type: "",
      engagementRate: 0,
      followerCount: 0,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      viewCount: 0,
    });
    setIsSearching((prev) => !prev);
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="influencer">Influencer</Label>
            <Input
              type="text"
              placeholder="Enter Influencer"
              className="form-control"
              name="influencer"
              value={filterFields.influencer}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>

        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="platform">Social Network</Label>
            <Input
              type="select"
              className="form-control"
              name="platform"
              value={filterFields.platform}
              onChange={handleFilter}
            >
              <option value="">Select Platform</option>
              <option value="Tiktok">Tiktok</option>
              <option value="Instagram">Instagram</option>
              <option value="Youtube">Youtube</option>
              <option value="Facebook">Facebook</option>
            </Input>
          </FormGroup>
        </Col>

        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="status">Status</Label>
            <Input
              type="select"
              className="form-control"
              name="status"
              value={filterFields.status}
              onChange={handleFilter}
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Published">Published</option>
            </Input>
          </FormGroup>
        </Col>

        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="type">Type</Label>
            <Input
              type="select"
              className="form-control"
              name="type"
              value={filterFields.type}
              onChange={handleFilter}
            >
              <option value="">Select Type</option>
              <option value="Post">Post</option>
              <option value="Story">Story</option>
            </Input>
          </FormGroup>
        </Col>
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="engagementRate">Engagement Rate</Label>
            <div className="d-flex justify-content-between align-items-center publication-filter">
              <Input
                type="range"
                name="engagementRate"
                min="0"
                max="100"
                value={filterFields.engagementRate}
                onChange={handleFilter}
              />
              <span>{filterFields.engagementRate}%</span>
            </div>
          </FormGroup>
        </Col>

        {/* Follower Count Range */}
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="followerCount">Follower Count</Label>
            <div className="d-flex justify-content-between align-items-center publication-filter">
              <Input
                type="range"
                name="followerCount"
                min="0"
                max="100"
                value={filterFields.followerCount}
                onChange={handleFilter}
              />
              <span>{filterFields.followerCount}</span>
            </div>
          </FormGroup>
        </Col>

        {/* Like Count Range */}
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="likeCount">Like Count</Label>
            <div className="d-flex justify-content-between align-items-center publication-filter">
              <Input
                type="range"
                name="likeCount"
                min="0"
                max="100"
                value={filterFields.likeCount}
                onChange={handleFilter}
              />
              <span>{filterFields.likeCount}</span>
            </div>
          </FormGroup>
        </Col>

        {/* Comment Count Range */}
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="commentCount">Comment Count</Label>
            <div className="d-flex justify-content-between align-items-center publication-filter">
              <Input
                type="range"
                name="commentCount"
                min="0"
                max="100"
                value={filterFields.commentCount}
                onChange={handleFilter}
              />
              <span>{filterFields.commentCount}</span>
            </div>
          </FormGroup>
        </Col>

        {/* Share Count Range */}
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="shareCount">Share Count</Label>
            <div className="d-flex justify-content-between align-items-center publication-filter">
              <Input
                type="range"
                name="shareCount"
                min="0"
                max="100"
                value={filterFields.shareCount}
                onChange={handleFilter}
              />
              <span>{filterFields.shareCount}</span>
            </div>
          </FormGroup>
        </Col>

        {/* View Count Range */}
        <Col xs="12" sm="6" md="2">
          <FormGroup>
            <Label for="viewCount">View Count</Label>
            <div className="d-flex justify-content-between align-items-center publication-filter">
              <Input
                type="range"
                name="viewCount"
                min="0"
                max="100"
                value={filterFields.viewCount}
                onChange={handleFilter}
              />
              <span>{filterFields.viewCount}</span>
            </div>
          </FormGroup>
        </Col>

        <Col xs="3" sm="2" md="auto" className="d-flex align-items-center mt-2">
          <Button
            className="w-100 custom-button border-none"
            onClick={handleSearch}
            style={{ backgroundColor: "var(--primary-purple)" }}
          >
            <i
              className="bx bx-search-alt-2"
              style={{ color: "var(--primary-white)" }}
            ></i>
          </Button>
        </Col>

        <Col xs="3" sm="2" md="auto" className="d-flex align-items-center mt-2">
          <Button
            className="w-100 custom-button border-none"
            onClick={handleClear}
            style={{ backgroundColor: "var(--secondary-red)" }}
          >
            <i className="bx bx-x"></i>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PublicationSearching;
