// route/index.js
import React from "react";
import { Navigate } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ResetPasswordForm from "../pages/Authentication/ResetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import ManageRole from "../pages/Manage-Role";
import Influencer from "../pages/Influencers";
import Influencers from "../pages/Client/Influencers";
import Publications from "../pages/Publications";
import Publication from "../pages/Client/publication";
import Opportunities from "../pages/Opportunities";
import Opportunity from "../pages/Opportunities/opportunities";
import InfluencerDetails from "../pages/Influencers/influencerdetails";
import Influencergrowth from "../pages/Influencers/influencergrowth";
import Client from "../pages/Client";
import UserProfile from "../pages/Authentication/UserProfile";
import InfluencerDashboard from "../pages/Dashboard/influencerDashboard";
import ROLES from "../constants/role"; 
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";
import VerifyOTP from "../pages/Authentication/VerifyOTP";
import ClientDashboard from "../pages/Client/ClientDashboard";

const authProtectedRoutes = [
  { path: "/overview", component: <Dashboard />, allowedRoles: [ROLES.ADMIN] },
  { path: "/manage-role", component: <ManageRole />, allowedRoles: [ROLES.ADMIN] },
  { path: "/influencer", component: <Influencer />, allowedRoles: [ROLES.ADMIN] },
  { path: "/client", component: <Client />, allowedRoles: [ROLES.ADMIN] },
  { path: "/publications", component: <Publications />, allowedRoles: [ROLES.ADMIN] },
  { path: "/client/overview", component: <ClientDashboard />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT] },
  { path: "/influencers", component: <Influencers />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT] },
  { path: "/influencer-details", component: <InfluencerDetails />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT] },
  { path: "/publication", component: <Publication />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT] },
  { path: "/opportunity", component: <Opportunity />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT] },
  { path: "/influencer/overview", component: <InfluencerDashboard />, allowedRoles: [ROLES.ADMIN, ROLES.INFLUENCER] },
  { path: "/influencer-growth", component: <Influencergrowth />, allowedRoles: [ROLES.ADMIN, ROLES.INFLUENCER] },
  { path: "/opportunities", component: <Opportunities />, allowedRoles: [ROLES.ADMIN, ROLES.INFLUENCER] },
  { path: "/profile", component: <UserProfile />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT, ROLES.INFLUENCER] },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/verify-otp", component: <VerifyOTP /> },
  { path: "/set-new-password", component: <ChangePassword /> },
  { path: "/change-password", component: <ResetPasswordForm /> },
  { path: "/register", component: <Register /> },
  { path: "/", component: <Navigate to="/login" /> },
];

export { authProtectedRoutes, publicRoutes };
