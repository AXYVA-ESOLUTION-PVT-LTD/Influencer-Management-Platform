import { call, call, put, takeEvery } from "redux-saga/effects";
import { getNotificationUrl } from "../../services/notification";
import { getNotificationFail } from "./actions";
import { GET_NOTIFICATION } from "./actionTypes";

function* fetchNotification(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getNotificationUrl, token);
    console.log(response);
  } catch (error) {
    yield put(getNotificationFail(error));
  }
}

function* notificationSaga() {
  yield takeEvery(GET_NOTIFICATION, fetchNotification);
}

export default notificationSaga;
