import { all, fork } from "redux-saga/effects";

import ForgetSaga from "./auth/forgetpwd/saga";
import AuthSaga from "./auth/login/saga";
import AccountSaga from "./auth/register/saga";
import ResetPasswordSaga from "./auth/reset-pwd/saga";
import ChatsSaga from "./chats/saga";
import brandsSaga from "./brand/saga";
import influencersSaga from "./influencers/saga";
import LayoutSaga from "./layout/saga";
import notificationSaga from "./notification/saga";
import opportunitySaga from "./opportunity/saga";
import rolesSaga from "./role/saga";
import userSaga from "./user/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ResetPasswordSaga),
    fork(LayoutSaga),
    fork(rolesSaga),
    fork(opportunitySaga),
    fork(userSaga),
    fork(brandsSaga),
    fork(influencersSaga),
    fork(notificationSaga),
    fork(ChatsSaga),
  ]);
}
