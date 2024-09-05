import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"

import { SignupApi } from "../../../services/index"
import STATUS from "../../../constants/status";

function* registerUser({ payload: { user, history } }) {
  try {
    const response = yield call(SignupApi, user);
    
    if (response?.status === STATUS.SUCCESS) {
      yield put(registerUserSuccessful(response?.result?.message));
      history('/login');
    } 
    else {
      throw new Error(response?.result?.message || "Failed to send OTP. Try again.");
    }
  } catch (error) {
    yield put(registerUserFailed(error.message || 'Please try again later.'));
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
