import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";

// Import Images
import error from "../../assets/images/error-img.png";

const Pages404 = () => {
  // Meta title
  document.title = "404 Error Page";
  
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-5">
        <Container className="text-center">
          <Row className="justify-content-center">
            <Col md="8" xl="6">
              <div className="mb-5">
                <h1 className="display-1 fw-bold">404</h1>
                <h4 className="text-uppercase mb-4">Page Not Found</h4>
                <p className="text-muted mb-5">
                  The page you are looking for does not exist. It might have been removed or you may have typed the URL incorrectly.
                </p>
                <div>
                  <Button color="primary" onClick={handleBackClick}>
                    Go Back
                  </Button>
                </div>
              </div>
              <div>
                <img src={error} alt="Error" className="img-fluid" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Pages404;
