import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"

import { SignupApi } from "../../../services/index"

function* registerUser({ payload: { user, history } }) {
  try {
    const response = yield call(SignupApi, user);
    
    if (response.status === 'Success') {
      yield put(registerUserSuccessful(response));
      history('/login');
    } else if (response.status === 'Fail') {
      yield put(registerUserFailed(response.result.error)); 
    } else {
      yield put(registerUserFailed('Please try again later.'));
    }
  } catch (error) {
    yield put(registerUserFailed('Please try again later.'));
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
