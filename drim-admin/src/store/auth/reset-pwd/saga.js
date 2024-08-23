import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { RESET_PASSWORD } from "./actionTypes";
import { userResetPasswordSuccess, userResetPasswordError } from "./actions";
import { ResetPasswordApi } from "../../../services"; // Ensure the correct path

// Function to handle the reset password API call
function* resetUserPassword({ payload: { user, history } }) {
  try {
    const response = yield call(ResetPasswordApi, {
      email: user.email,
      otp: user.otp,
      newPassword: user.newPwd,
    });
    if (response.status === "Success") {
      yield put(userResetPasswordSuccess("Password has been reset successfully."));
      history('/login'); // Redirect to login page on success
    } else if (response.status === "Fail") {
      yield put(userResetPasswordError("Failed to reset password. Please try again."));
    } else {
      yield put(userResetPasswordError("Please try again later."));
    }
  } catch (error) {
    yield put(userResetPasswordError(error.message || "Please try again later."));
  }
}

// Watcher saga to watch for RESET_PASSWORD action
export function* watchUserPasswordReset() {
  yield takeEvery(RESET_PASSWORD, resetUserPassword);
}

// Root saga to fork all password reset related sagas
function* resetPasswordSaga() {
  yield all([fork(watchUserPasswordReset)]);
}

export default resetPasswordSaga;
