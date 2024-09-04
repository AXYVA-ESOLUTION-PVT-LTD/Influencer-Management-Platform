import { combineReducers } from "redux";

import Layout from "./layout/reducer";

import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import resetPassword from "./auth/reset-pwd/reducer";
import Role from "./role/reducer";
import opportunity from "./opportunity/reducer";
import user from "./user/reducer";
import influencer from "./influencers/reducer";
import client from "./client/reducer";
import notification from "./notification/reducers";
import chats from "./chats/reducers";

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  resetPassword,
  Role,
  opportunity,
  user,
  influencer,
  client,
  notification,
  chats,
});

export default rootReducer;
