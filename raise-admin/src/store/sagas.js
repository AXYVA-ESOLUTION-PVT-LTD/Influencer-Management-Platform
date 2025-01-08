import { all, fork } from "redux-saga/effects";

import ForgetSaga from "./auth/forgetpwd/saga";
import AuthSaga from "./auth/login/saga";
import AccountSaga from "./auth/register/saga";
import ResetPasswordSaga from "./auth/reset-pwd/saga";
import ChatsSaga from "./chats/saga";
import LayoutSaga from "./layout/saga";
import DashboardSaga from "./dashboard/saga";
import NotificationSaga from "./notification/saga";
import OpportunitySaga from "./opportunity/saga";
import InfluencersSaga from "./influencers/saga";
import BrandsSaga from "./brand/saga";
import RolesSaga from "./role/saga";
import UserSaga from "./user/saga";
import PublicationSaga from "./publication/saga";
import PaymentSaga from "./payment/saga";


export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ResetPasswordSaga),
    fork(LayoutSaga),
    fork(RolesSaga),
    fork(OpportunitySaga),
    fork(UserSaga),
    fork(BrandsSaga),
    fork(InfluencersSaga),
    fork(NotificationSaga),
    fork(ChatsSaga),
    fork(DashboardSaga),
    fork(PublicationSaga),
    fork(PaymentSaga)
  ]);
}
