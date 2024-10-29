import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import withRouter from "../Common/withRouter";
import "../../assets/themes/colors.scss";
//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";
// import colors from "../../assets/themes/colors";
// import logo from "../../assets/images/logo.svg";
// import logo from "../../assets/images/favicon/logo-sm.png";
// import logoLightPng from "../../assets/images/favicon/logo-lg.png";
// import logoLightSvg from "../../assets/images/favicon/logo-sm.svg";
// import logoDark from "../../assets/images/favicon/logo-lg.png";

const Sidebar = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);
  return (
    <React.Fragment>
      <div className="vertical-menu" style={{ backgroundColor : "var(--primary-black)" }}>
        <div className="navbar-brand-box" style={{ backgroundColor : "var(--primary-black)"}}>
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              {/* <img src={logo} alt="" height="22" /> */}
            </span>
            <span className="logo-lg">
              {/* <img src={logoDark} alt="" height="17" /> */}
            </span>
          </Link>

          <Link
            to={`/overview/${user?.roleId?.name.toLowerCase()}`}
            className="logo logo-light"
          >
            <span className="logo-sm">
              {/* <img src={logoLightSvg} alt="" height="22" /> */}
              <h2 className="mt-3" style={{ color: "var(--primary-off-white)" }}>B</h2>
            </span>
            <span className="logo-lg">
              {/* <img src={logoLightPng} alt="" height="19" /> */}
              <h2 className="mt-3" style={{ color: "var(--primary-off-white)" }}>BRANDRAISE</h2>
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>

        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
