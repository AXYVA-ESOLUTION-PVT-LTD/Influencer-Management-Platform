import { combineReducers } from "redux";

import Layout from "./layout/reducer";

import ForgetPassword from "./auth/forgetpwd/reducer";
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import resetPassword from "./auth/reset-pwd/reducer";
import chats from "./chats/reducers";
import brand from "./brand/reducer";
import influencer from "./influencers/reducer";
import notification from "./notification/reducers";
import opportunity from "./opportunity/reducer";
import Role from "./role/reducer";
import user from "./user/reducer";

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
  brand,
  notification,
  chats,
});

export default rootReducer;
