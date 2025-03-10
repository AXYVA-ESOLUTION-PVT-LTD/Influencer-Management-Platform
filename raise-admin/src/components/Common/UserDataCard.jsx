import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Col,
  Row,
  Spinner,
} from "reactstrap";

const UserDataCard = ({ userData, loading }) => {
  if (loading) {
    return (
      <Card className="influencer-custom-height shadow-sm border-light rounded d-flex justify-content-center align-items-center">
        <Spinner color="primary" />
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className="influencer-custom-height shadow-sm border-light rounded d-flex justify-content-center align-items-center p-4">
        <CardBody>
          <CardTitle tag="h5" className="text-center text-muted">
            No Data Available
          </CardTitle>
        </CardBody>
      </Card>
    );
  }

  const {
    name,
    platform,
    profile_link,
    picture_url,
    description,
    firstName,
    lastName,
    country,
    category,
    subscriber_count,
    follower_count,
    follows_count,
    total_videos,
    total_views,
  } = userData;

  return (
    <Card className="influencer-custom-height shadow-sm border-light rounded">
      <CardBody className="d-flex align-items-center">
        <Row className="w-100">
          {/* Image Section */}
          <Col
            md="4"
            className="text-center d-flex align-items-start justify-content-center"
          >
            <img
              src={picture_url}
              alt={name}
              className="img-fluid rounded-circle border border-primary"
              style={{ height: "150px", width: "150px", objectFit: "cover" }}
            />
          </Col>
          {/* Info Section */}
          <Col md="8" className="d-flex flex-column justify-content-center">
            <CardTitle tag="h6" className="font-weight-light mb-2 text-muted">
              {firstName} {lastName} | {country}
            </CardTitle>
            <CardTitle tag="h4" className="font-weight-bold mb-2">
              {name}
            </CardTitle>
            <CardTitle tag="h4" className="font-weight-light mb-2 text-muted">
              {category}
            </CardTitle>
            <CardText className="mb-2">
              <span className="text-muted">{platform} | </span>
              <a
                href={profile_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                {name}
              </a>
            </CardText>

            {description && description !== "No description available" && (
              <CardTitle tag="h4" className="font-weight-bold mb-2">
                {description}
              </CardTitle>
            )}
            {/* {platform === "Instagram" ||
            platform === "Facebook" ||
            platform === "Tiktok" ? (
              <>
                <CardText tag="h5" className="mb-2 text-muted">
                  Followers:{" "}
                  <span className="font-weight-bold">{follower_count}</span>
                </CardText>
                <CardText tag="h5" className="mb-2 text-muted">
                  Following:{" "}
                  <span className="font-weight-bold">{follows_count}</span>
                </CardText>
              </>
            ) : null}
            {platform === "YouTube" ? (
              <>
                <CardText tag="h5" className="mb-2 text-muted">
                  Subscribers:{" "}
                  <span className="font-weight-bold">{subscriber_count}</span>
                </CardText>
                <CardText tag="h5" className="mb-2 text-muted">
                  Total Views:{" "}
                  <span className="font-weight-bold">{total_views}</span>
                </CardText>
              </>
            ) : null} */}
            {/* <CardText tag="h5" className="mb-2 text-muted">
              Total Videos:{" "}
              <span className="font-weight-bold">{total_videos}</span>
            </CardText> */}

            <CardText
              className="text-truncate"
              style={{ maxWidth: "100%", overflowWrap: "break-word" }}
            >
              <a
                href={profile_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary d-flex align-items-center"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "inline-block",
                  maxWidth: "100%",
                }}
              >
                <i className="bx bx-link-external mr-2"></i>
                {profile_link}
              </a>
            </CardText>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default UserDataCard;
