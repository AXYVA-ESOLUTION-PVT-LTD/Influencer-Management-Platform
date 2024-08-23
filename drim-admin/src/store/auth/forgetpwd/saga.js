import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { FORGET_PASSWORD, VERIFY_OTP } from "./actionTypes";
import {
  userForgetPasswordSuccess,
  userForgetPasswordError,
  verifyOtpSuccess,
  verifyOtpError,
} from "./actions";
import { ForgetPasswordApi, OTPVerificationApi } from "../../../services";

// API call for forget password
function* forgetUser({ payload: { user, history } }) {
  try {
    const response = yield call(ForgetPasswordApi, { email: user.email });

    if (response.status === "Success") {
      yield put(userForgetPasswordSuccess("OTP sent to your mailbox."));
      history('/verify-otp');
    } else if (response.status === "Fail") {
      yield put(userForgetPasswordError("Invalid email address. Please try again."));
    } else {
      yield put(userForgetPasswordError("Please try again later."));
    }
  } catch (error) {
    yield put(userForgetPasswordError(error.message || "Please try again later."));
  }
}

// API call for OTP verification
function* verifyOtp({ payload: { email, otp, history } }) {
  try {
    const response = yield call(OTPVerificationApi, { email, otp });

    if (response.status === "Success") {
      yield put(verifyOtpSuccess("OTP verified successfully."));
      console.log(response);
      
      history('/set-new-password');
    } else if (response.status === "Fail") {
      yield put(verifyOtpError("Invalid OTP. Please try again."));
    } else {
      yield put(verifyOtpError("Please try again later."));
    }
  } catch (error) {
    yield put(verifyOtpError(error.message || "Please try again later."));
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

// Root Saga
function* rootSaga() {
  yield all([fork(watchUserPasswordForget), fork(watchOtpVerification)]);
}

export default rootSaga;
