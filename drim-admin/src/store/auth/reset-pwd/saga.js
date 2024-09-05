import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { RESET_PASSWORD } from "./actionTypes";
import { userResetPasswordSuccess, userResetPasswordError } from "./actions";
import { ResetPasswordApi } from "../../../services"; // Ensure the correct path
import { toast } from "react-toastify";
import STATUS from "../../../constants/status";
// Function to handle the reset password API call
function* resetUserPassword({ payload: { user } }) {

  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(ResetPasswordApi,token,user);
    if (response?.status === STATUS.SUCCESS) {
      yield put(userResetPasswordSuccess(response?.result?.message));
    } else {
      throw new Error(response?.result?.message || "Password reset failed. Please try again.");
    }
  } catch (error) {
    yield put(userResetPasswordError(error.message || "Password reset failed. Please try again."));
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
