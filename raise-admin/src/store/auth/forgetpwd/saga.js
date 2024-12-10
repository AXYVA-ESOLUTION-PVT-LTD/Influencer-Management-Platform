import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { FORGET_PASSWORD, SET_NEW_PASSWORD, VERIFY_OTP } from "./actionTypes";
import {
  userForgetPasswordSuccess,
  userForgetPasswordError,
  verifyOtpSuccess,
  verifyOtpError,
  setNewPasswordSuccess,
  setNewPasswordError,
} from "./actions";
import { ForgetPasswordApi, OTPVerificationApi, SetNewPasswordApi } from "../../../services";
import STATUS from "../../../constants/status";
import { toast } from "react-toastify";

// API call for forget password
function* forgetUser({ payload: { user, history } }) {

  const id = toast.loading("Sending Email...");

  try {
    const response = yield call(ForgetPasswordApi, { email: user.email });

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message,
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(userForgetPasswordSuccess(response?.result?.message));
      history('/verify-otp');
    } else {
      throw new Error(response?.result?.message || "Failed to send OTP. Try again.");
    }
  } catch (error) {
    toast.update(id, {
      render: error.message ? error.message : error,
      type: "error",
      isLoading: false,
      autoClose: true,
    });
    yield put(userForgetPasswordError(error.message || "Failed to send OTP. Try again."));
  }
}

// API call for OTP verification
function* verifyOtp({ payload: { data, history } }) {
  try {
    const response = yield call(OTPVerificationApi,data);
    
    if (response?.status === STATUS.SUCCESS) {
      yield put(verifyOtpSuccess(response?.result?.message));
      localStorage.removeItem('email')
      localStorage.setItem('usertoken',response?.result?.token);
      history('/set-new-password');
    } else {
      throw new Error(response?.result?.message || "Invalid OTP. Try again.");
    }
  } catch (error) {
    yield put(verifyOtpError(error.message || "Invalid OTP. Try again."));
  }
}

function* setNewPassword({ payload: { data, history } }) {
  try {
    const response = yield call(SetNewPasswordApi, data);

    if (response?.status === STATUS.SUCCESS) {
      yield put(setNewPasswordSuccess(response?.result?.message));
      localStorage.removeItem('usertoken');
      history('/login');
      } else {
      throw new Error(response?.result?.message || "Password update failed. Try again.");
    }
  } catch (error) {
    yield put(setNewPasswordError(error.message || "Password update failed. Try again."));
  }
}

// Watcher Saga for Forget Password
export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

// Watcher Saga for OTP Verification
export function* watchOtpVerification() {
  yield takeEvery(VERIFY_OTP, verifyOtp);
}

export function* watchSetNewPassword() {
  yield takeEvery(SET_NEW_PASSWORD, setNewPassword);
}
// Root Saga
function* rootSaga() {
  yield all([fork(watchUserPasswordForget), fork(watchOtpVerification) ,fork(watchSetNewPassword)]);
}

export default rootSaga;
