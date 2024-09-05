import { call, put, takeEvery } from "redux-saga/effects";
import {
  LOGIN_USER,
  LOGOUT_USER,
  SOCIAL_LOGIN,
} from "./actionTypes";
import {
  loginSuccess,
  loginFail,  // New
  logoutUserSuccess,
  logoutUserFail,  // New
  apiError,
} from "./actions";
import { LoginApi } from "../../../services/index";
import STATUS from "../../../constants/status";
import ROLES from "../../../constants/role";

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(LoginApi, {
      email: user.email,
      password: user.password,
    });
    
    if (response?.status === STATUS.SUCCESS) {
      localStorage.setItem("authUser", response.result.data.token);
      localStorage.setItem("user", JSON.stringify(response.result.data.user));
      yield put(loginSuccess(response.result.data));
      const user = JSON.parse(localStorage.getItem("user"));
      const role = user.roleId.name;
      switch (role) {
        case ROLES.ADMIN:
          history("/overview/admin");
          break;
        case ROLES.BRAND:
          history("/overview/brand");
          break;
        case ROLES.INFLUENCER:
          history("/overview/influencer");
          break;
        default:
          history('/404')
      }
    } else {
      throw new Error(response?.result?.message || "Login failed. Please try again.");
    }
  } catch (error) {
    yield put(loginFail(error.message || "Login failed. Please try again."));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");
    yield put(logoutUserSuccess());
    history("/login");
  } catch (error) {
    yield put(logoutUserFail(error.message)); 
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
