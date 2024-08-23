import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import resetPassword from "./auth/reset-pwd/reducer";
import Role from "./role/reducer";

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  resetPassword,
  Role
});

export default rootReducer;
