import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";
import ROLES from "../../../constants/role";
import moment from "moment/moment";
import { fetchUnreadNotifications, markNotificationAsRead } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";

const NotificationDropdown = (props) => {
  const dispatch = useDispatch();
  const {
    notificationsData,
    notificationsDataCount,
  } = useSelector((state) => state.Notification);
  const [menu, setMenu] = useState(false);
  const [role, setRole] = useState("");
  
  useEffect(() => {
    dispatch(fetchUnreadNotifications());
    const data = JSON.parse(localStorage.getItem("user"));
    if (data && data.roleId && data.roleId.name) {
      setRole(data.roleId.name);
    }
  }, []);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };
  
  if (role === ROLES.BRAND) {
    return null;
  }
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          {/* <Link to="/notifications"> */}
          <i className="bx bx-bell bx-tada " />
          {/* </Link> */}
          {notificationsDataCount > 0 && (
            <span className="badge bg-danger rounded-pill">{notificationsDataCount}</span>
          )}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("Notifications")} </h6>
              </Col>
              {/* <div className="col-auto">
                <Link
                  className="btn btn-sm btn-link font-size-10 btn-block text-center"
                  to="/notifications"
                >
                  View All
                </Link>
              </div> */}
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {notificationsData.length === 0 ? (
              <p className="text-center text-bold">
                No notifications available.
              </p>
            ) : (
              notificationsData.map((notification) => (
                <Link
                  to="/coupon-management"
                  key={notification._id}
                  className="text-reset notification-item"
                >
                  <span
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="btn btn-sm btn-link font-size-10 float-end"
                  >
                    Mark as Read
                  </span>
                  <div className="d-flex">
                    {/* <div className="avatar-xs me-3">
                      <span className="avatar-title bg-primary rounded-circle font-size-16">
                        <i className="bx bx-cart" />
                      </span>
                    </div> */}
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">
                        {props.t(notification.title)}
                      </h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">{props.t(notification.message)}</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline" />
                          {props.t(moment(notification.createdAt).fromNow())}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </SimpleBar>
          {/* <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="/notifications"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>{" "}
              {props.t("View all")}{" "}
            </Link>
          </div> */}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};
