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

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(LoginApi, {
      email: user.email,
      password: user.password,
    });
    
    if (response?.result?.data?.token) {
      localStorage.setItem("authUser", response.result.data.token);
      localStorage.setItem("user", JSON.stringify(response.result.data.user));
      yield put(loginSuccess(response.result.data));
      history("/dashboard");
    } else {
      throw new Error("Invalid login credentials");
    }
  } catch (error) {
    yield put(loginFail(error.message)); 
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
