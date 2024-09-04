import { all, fork } from "redux-saga/effects";

import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ResetPasswordSaga from "./auth/reset-pwd/saga";
import LayoutSaga from "./layout/saga";
import rolesSaga from "./role/saga";
import userSaga from "./user/saga";
import opportunitySaga from "./opportunity/saga";
import clientsSaga from "./client/saga";
import influencersSaga from "./influencers/saga";
import notificationSaga from "./notification/saga";
import ChatsSaga from "./chats/saga";

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
    fork(clientsSaga),
    fork(influencersSaga),
    fork(notificationSaga),
    fork(ChatsSaga),
  ]);
}
