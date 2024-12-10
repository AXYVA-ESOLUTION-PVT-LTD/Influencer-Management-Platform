import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import ROLES from "../../constants/role";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { NavLink, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import { useCallback } from "react";
import '../../assets/themes/colors.scss'
const SidebarContent = (props) => {
  const [roleName, setRoleName] = useState(null);
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");
        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active");
          parent3.childNodes[0].classList.add("mm-active");
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      setRoleName(user.roleId.name);
    }
  }, [user]);

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/* Admin Menu */}
            {roleName === ROLES.ADMIN && (
              <>
                <li className="menu-title">Admin Menu</li>

                <li>
                  <NavLink
                    to="/overview/admin"
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                    <i className="bx bxs-dashboard"></i>
                    <span>overview</span>
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to="/manage-role">
                    <i className="bx bxs-user-badge"></i>
                    <span>Manage Role</span>
                  </NavLink>
                </li> */}
                <li>
                  <NavLink
                    to="/influencer"
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                    <i className="bx bxs-group"></i>
                    <span>Influencers</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/brand"
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                    <i className="bx bx-store"></i>
                    <span>Brands</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/publications"
                    end
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                    <i className="bx bxs-book-bookmark"></i>
                    <span>Publications</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/opportunities"
                    end
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                    <i className="bx bx-star"></i>
                    <span>Opportunities</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/coupon-management"
                    end
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                     <i className="bx bx-gift"></i>
                    <span>Coupon Management</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/ticket-management"
                    end
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                      <i className="bx bx-receipt"></i>
                    <span>Ticket Management</span>
                  </NavLink>
                </li>
                {roleName === ROLES.ADMIN && (
                  <li>
                    <NavLink
                      to="/payment"
                      className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                    >
                      <i className="bx bxs-credit-card"></i>
                      <span>Payment</span>
                    </NavLink>
                  </li>
                )}
              </>
            )}

            {(roleName === ROLES.ADMIN || roleName === ROLES.BRAND) && (
              <>
                <li className="menu-title">Brands Menu</li>
                <li>
                  <NavLink
                    to="/overview/brand"
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                    <i className="bx bx-home-circle"></i>
                    <span>Brands Dashboard</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/influencers"
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                    <i className="bx bxs-user-badge"></i>
                    <span>Influencers</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/publications/brand"
                    end
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                    <i className="bx bx-book"></i>
                    <span>Publications</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Influencer Menu Item */}

            {(roleName === ROLES.ADMIN || roleName === ROLES.INFLUENCER) && (
              <>
                <li className="menu-title">Influencer Menu</li>
                <li>
                  <NavLink
                    to="/overview/influencer"
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                    <i className='bx bx-bar-chart-alt' ></i>
                    <span>Influencer Dashboard</span>
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to="/influencer-growth">
                    <i className="bx bx-news"></i>
                    <span>Reports</span>
                  </NavLink>
                </li> */}
                <li>
                  <NavLink
                    to="/opportunities/influencer"
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "var(--primary-purple)" : "",
                      color: isActive ? "var(--primary-white)" : "",
                    })}
                  >
                     <i className="bx bx-rocket"></i>
                    <span>Opportunities</span>
                  </NavLink>
                </li>
                {roleName === ROLES.INFLUENCER && (
                  <li>
                    <NavLink
                      to="/payment/influencer"
                      className={({ isActive }) => (isActive ? "menu-active" : "")}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "var(--primary-purple)" : "",
                        color: isActive ? "var(--primary-white)" : "",
                      })}
                    >
                       <i className="bx bx-wallet"></i>
                      <span>Payment</span>
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
