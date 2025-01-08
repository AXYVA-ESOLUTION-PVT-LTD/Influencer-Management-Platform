import { combineReducers } from "redux";

import Layout from "./layout/reducer";

import ForgetPassword from "./auth/forgetpwd/reducer";
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import Role from "./role/reducer";
import Dashboard from "./dashboard/reducer";
import Chats from "./chats/reducers";
import Notification from "./notification/reducers";
import Brand from "./brand/reducer";
import Influencer from "./influencers/reducer";
import User from "./user/reducer";
import Opportunity from "./opportunity/reducer";
import ResetPassword from "./auth/reset-pwd/reducer";
import Publication from "./publication/reducer";
import Payment from "./payment/reducer";


const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  ResetPassword,
  Role,
  Opportunity,
  User,
  Influencer,
  Brand,
  Notification,
  Chats,
  Dashboard,
  Publication,
  Payment
});

export default rootReducer;
