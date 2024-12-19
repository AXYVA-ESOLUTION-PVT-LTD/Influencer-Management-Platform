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
import {
  AdminDashboardOverview,
  BrandManagement,
  InfluencerManagement,
  OpportunitiesPage,
  PublicationsPage,
  PaymentPage,
  CouponManagement
} from "../pages/Admin";
import {
  BrandDashboardOverview,
  InfluencerDetailsPage,
  InfluencerListPage,
  PublicationsListPage,
} from "../pages/Brand";
import {
  InfluencerDashboardOverview,
  OpportunitiesListPage,
  InfluencerPayment
} from "../pages/Influencer";
import { ProfilePage } from "../pages/Profile";
import { Notifications } from "../pages/Notification";
import TicketManagement from "../pages/Admin/TicketManagement";
import LoginCallback from "../pages/Authentication/LoginCallback";

const authProtectedRoutes = [
  {
    path: "/overview/admin",
    component: <AdminDashboardOverview />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: "/influencer",
    component: <InfluencerManagement />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: "/brand",
    component: <BrandManagement />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: "/publications",
    component: <PublicationsPage />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: "/opportunities",
    component: <OpportunitiesPage />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: "/coupon-management",
    component: <CouponManagement />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: "/ticket-management",
    component: <TicketManagement />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: "/overview/brand",
    component: <BrandDashboardOverview />,
    allowedRoles: [ROLES.ADMIN, ROLES.BRAND],
  },
  {
    path: "/influencers",
    component: <InfluencerListPage />,
    allowedRoles: [ROLES.ADMIN, ROLES.BRAND],
  },
  {
    path: "/influencers/:id",
    component: <InfluencerDetailsPage />,
    allowedRoles: [ROLES.ADMIN, ROLES.BRAND],
  },
  {
    path: "/publications/brand",
    component: <PublicationsListPage />,
    allowedRoles: [ROLES.ADMIN, ROLES.BRAND],
  },

  {
    path: "/overview/influencer",
    component: <InfluencerDashboardOverview />,
    allowedRoles: [ROLES.ADMIN, ROLES.INFLUENCER],
  },
  {
    path: "/opportunities/influencer",
    component: <OpportunitiesListPage />,
    allowedRoles: [ROLES.ADMIN, ROLES.INFLUENCER],
  },
  {
    path: "/profile",
    component: <ProfilePage />,
    allowedRoles: [ROLES.ADMIN, ROLES.BRAND, ROLES.INFLUENCER],
  },
  {
    path: "/notifications",
    component: <Notifications />,
    allowedRoles: [ROLES.ADMIN, ROLES.INFLUENCER],
  },
  {
    path: "/payment",
    component: <PaymentPage />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: "/payment/influencer",
    component: <InfluencerPayment />,
    allowedRoles: [ROLES.INFLUENCER],
  },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/login/callback", component: <LoginCallback /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/verify-otp", component: <VerifyOTP /> },
  { path: "/set-new-password", component: <ChangePassword /> },
  { path: "/change-password", component: <ResetPasswordForm /> },
  { path: "/register", component: <Register /> },
  { path: "/", component: <Navigate to="/login" /> },
];

export { authProtectedRoutes, publicRoutes };
