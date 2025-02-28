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
    const response = yield call(LoginApi, user);
    

    if (response?.status === STATUS.SUCCESS) {
      if (response.result.data.redirectUrl) {
        // Redirect user to Google OAuth URL for reauthentication
        window.location.href = response.result.data.redirectUrl;
        return; // Stop execution here since user is redirected
      }

      localStorage.setItem("authUser", response.result.data.token);
      
      yield put(loginSuccess(response.result.data));
      // const user = JSON.parse(localStorage.getItem("user"));
      const role = response?.result?.data?.user?.roleId?.name;
      const platform = response.result?.data?.user?.platform;
      const username = response.result?.data?.user?.username;
      const isVerified = response.result?.data?.user?.isVerified;

      if (role === 'Influencer' && ((!platform || platform === '') && (!username || username === '') || (!isVerified || isVerified === ''))) {
        localStorage.setItem('authUserId',response.result.data.user._id);
        history("/onboarding");
      }
      else{
        localStorage.setItem("user", JSON.stringify(response.result.data.user));
        
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
    if (localStorage.getItem("authUserId")) {
      localStorage.removeItem("authUserId");
    }
    yield put(logoutUserSuccess());
    history("/login");
  } catch (error) {
    yield put(logoutUserFail(error.message)); 
  }
}

function* AuthSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default AuthSaga;
