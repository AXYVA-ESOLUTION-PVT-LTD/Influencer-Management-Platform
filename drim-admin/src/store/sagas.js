import { all, fork } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ResetPasswordSaga from "./auth/reset-pwd/saga";
import LayoutSaga from "./layout/saga";
import rolesSaga from "./role/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ResetPasswordSaga),
    fork(LayoutSaga),
    fork(rolesSaga)
  ]);
}
