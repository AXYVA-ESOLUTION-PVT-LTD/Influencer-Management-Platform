import React from "react";
import { Card, CardBody, Col } from "reactstrap";
import '../../assets/themes/colors.scss';
const StatisticsBox = ({ box }) => {
  return (
    <Col xs={6} sm={4} md={3} lg={2}>
      <Card
        className="d-flex flex-column align-items-center"
        style={{ height: "150px", borderRadius: "10px" }}
      >
        <CardBody className="d-flex flex-column justify-content-center align-items-center text-center">
          <div style={{ marginBottom: "10px" }}>
            <p
              style={{
                fontSize: "0.85rem",
                color: box.isIncrease ? "var(--status-green-dark)" : "var(--secondary-red)",
                margin: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {box.isIncrease ? (
                <i className="bx bxs-up-arrow"></i>
              ) : (
                <i className="bx bxs-down-arrow"></i>
              )}
              {box.rate > 0 ? `+${box.rate}%` : `${box.rate}%`}
            </p>
            <p
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {box.value}
            </p>
            <h6
              style={{
                fontSize: "0.75rem",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              {box.title}
            </h6>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default StatisticsBox;
