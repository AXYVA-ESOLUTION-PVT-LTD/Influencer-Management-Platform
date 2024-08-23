import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgotPasswordEmailForm from "../pages/Authentication/ForgotPasswordEmailForm"
// Dashboard
import Dashboard from "../pages/Dashboard/index"
import ManageRole from "../pages/Manage-Role"
import Influencer from "../pages/Influencers"
import Influencers from "../pages/Influencers/influencers"
import Publications from "../pages/Publications"
import Home from "../pages/Home"
import Publication from "../pages/Publications/publication"
import Opportunities from "../pages/Opportunities"
import Opportunity from "../pages/Opportunities/opportunities"
import InfluencerDetails from "../pages/Influencers/influencerdetails"
import Influencergrowth from "../pages/Influencers/influencergrowth"
import VerifyOtpForm from "../pages/Authentication/VerifyOtpForm"
import SetNewPasswordForm from "../pages/Authentication/SetNewPasswordForm"
import ResetPasswordForm from "../pages/Authentication/ResetPasswordForm"

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard/> },
  { path: "/manage-role", component: <ManageRole/> },
  { path: "/influencer", component: <Influencer/> },
  { path: "/publications", component: <Publications/> },
  { path: "/home", component: <Home/> },
  { path: "/influencers", component: <Influencers/> },
  { path: "/influencer-details", component: <InfluencerDetails/> },
  { path: "/publication", component: <Publication/> },
  { path: "/opportunities", component: <Opportunities/> },
  { path: "/opportunity", component: <Opportunity/> },
  { path: "/influencer-growth", component: <Influencergrowth/> },

  // opportunity
  { path: "/profile", component: <UserProfile/> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
   {
    path: "/",
    exact: true,
    component: < Navigate to="/dashboard" />,
  },
]

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgotPasswordEmailForm /> },
  { path: "/verify-otp", component: <VerifyOtpForm /> },
  { path: "/set-new-password", component: <SetNewPasswordForm /> },
  { path: "/change-password", component: <ResetPasswordForm /> },
  { path: "/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }

