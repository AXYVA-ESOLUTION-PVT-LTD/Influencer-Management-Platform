import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { RESET_PASSWORD } from "./actionTypes";
import { userResetPasswordSuccess, userResetPasswordError } from "./actions";
import { ResetPasswordApi } from "../../../services"; // Ensure the correct path
import { toast } from "react-toastify";
// Function to handle the reset password API call
function* resetUserPassword({ payload: { user } }) {

  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(ResetPasswordApi,token,user);
    if (response.status === "Success") {
      yield put(userResetPasswordSuccess("Password has been reset successfully."));
      // toast.success("Password has been reset successfully.");
    } else if (response.status === "Fail") {
      yield put(userResetPasswordError(response.result.message));
      // toast.error(response.result.message);
    } else {
      yield put(userResetPasswordError("Please try again later."));
      // toast.error("Fail to reset password");
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
