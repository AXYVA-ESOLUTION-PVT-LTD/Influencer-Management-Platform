// route/index.js
import React from "react";
import { Navigate } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ResetPasswordForm from "../pages/Authentication/ResetPassword";

import ROLES from "../constants/role"; 
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";
import VerifyOTP from "../pages/Authentication/VerifyOTP";
import { AdminDashboardOverview, ClientManagement, InfluencerManagement, OpportunitiesPage, PublicationsPage } from "../pages/Admin";
import {  ClientDashboardOverview, InfluencerDetailsPage, InfluencerListPage ,PublicationsListPage } from "../pages/Client";
import { InfluencerDashboardOverview, OpportunitiesListPage } from "../pages/Influencer";
import { ProfilePage } from "../pages/Profile";


const authProtectedRoutes = [
  { path: "/overview", component: <AdminDashboardOverview />, allowedRoles: [ROLES.ADMIN] },
  { path: "/influencer", component: <InfluencerManagement />, allowedRoles: [ROLES.ADMIN] },
  { path: "/client", component: <ClientManagement />, allowedRoles: [ROLES.ADMIN] },
  { path: "/publications", component: <PublicationsPage />, allowedRoles: [ROLES.ADMIN] },
  { path: "/opportunities", component: <OpportunitiesPage />, allowedRoles: [ROLES.ADMIN] },

  { path: "/client/overview", component: <ClientDashboardOverview />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT] },
  { path: "/client/influencers", component: <InfluencerListPage />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT] },
  { path: "/client/influencer-details", component: <InfluencerDetailsPage />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT] },
  { path: "/client/publications", component: <PublicationsListPage />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT] },
  
  { path: "/influencer/overview", component: <InfluencerDashboardOverview />, allowedRoles: [ROLES.ADMIN, ROLES.INFLUENCER] },
  { path: "/influencer/opportunities", component: <OpportunitiesListPage />, allowedRoles: [ROLES.ADMIN, ROLES.INFLUENCER] },
  { path: "/profile", component: <ProfilePage />, allowedRoles: [ROLES.ADMIN, ROLES.CLIENT, ROLES.INFLUENCER] },
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
