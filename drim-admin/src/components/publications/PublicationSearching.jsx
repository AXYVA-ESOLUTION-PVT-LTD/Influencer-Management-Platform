import React from "react";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";

const PublicationSearching = ({
  filterFields,
  setFilterFields,
  setIsSearching,
}) => {
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
        <Col md="4">
          <FormGroup>
            <Label for="project">Project</Label>
            <Input
              type="text"
              placeholder="Enter Project"
              className="form-control"
              name="project"
              value={filterFields.project}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label for="postDate">Post Date</Label>
            <Input
              type="date"
              className="form-control"
              name="postDate"
              value={filterFields.postDate}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="4">
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
      </Row>
      <Row className="align-items-center">
        <Col md="4">
          <FormGroup>
            <Label for="socialNetwork">Social Network</Label>
            <Input
              type="select"
              className="form-control"
              name="socialNetwork"
              value={filterFields.socialNetwork}
              onChange={handleFilter}
            >
              <option value="">Select Social Network</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="telegram">Telegram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md="4">
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
              <option value="published">Published</option>
              <option value="Declined">Declined</option>
              <option value="Cancelled">Cancelled</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md="4">
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
              <option value="post">Post</option>
              <option value="reel">Reel</option>
              <option value="clip">Clip</option>
              <option value="shorts">Shorts</option>
              <option value="full video">Full Video</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>
      <Row className="align-items-center"></Row>
      <Row className="align-items-center">
        <Col md="4">
          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              type="text"
              placeholder="Enter Price"
              className="form-control"
              name="price"
              value={filterFields.price}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label for="ER">Engagement Rate (ER)</Label>
            <Input
              type="text"
              placeholder="Enter ER"
              className="form-control"
              name="ER"
              value={filterFields.ER}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label for="follower">Follower</Label>
            <Input
              type="text"
              placeholder="Enter Follower"
              className="form-control"
              name="follower"
              value={filterFields.follower}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col md="4">
          <FormGroup>
            <Label for="approximateReach">Approximate Reach</Label>
            <Input
              type="text"
              placeholder="Enter Approximate Reach"
              className="form-control"
              name="approximateReach"
              value={filterFields.approximateReach}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label for="likes">Likes</Label>
            <Input
              type="text"
              placeholder="Enter Likes"
              className="form-control"
              name="likes"
              value={filterFields.likes}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label for="comments">Comments</Label>
            <Input
              type="text"
              placeholder="Enter Comments"
              className="form-control"
              name="comments"
              value={filterFields.comments}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col md="4">
          <FormGroup>
            <Label for="views">Views</Label>
            <Input
              type="text"
              placeholder="Enter Views"
              className="form-control"
              name="views"
              value={filterFields.views}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label for="videoViews">Video Views</Label>
            <Input
              type="text"
              placeholder="Enter Video Views"
              className="form-control"
              name="videoViews"
              value={filterFields.videoViews}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label for="country">Country</Label>
            <Input
              type="text"
              placeholder="Enter Country"
              className="form-control"
              name="country"
              value={filterFields.country}
              onChange={handleFilter}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row className="align-items-center justify-content-center">
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

export default PublicationSearching;
