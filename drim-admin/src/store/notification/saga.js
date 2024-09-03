import { call, call, put, takeEvery } from "redux-saga/effects";
import {
  createNotificationUrl,
  getNotificationUrl,
} from "../../services/notification";
import { getNotificationFail } from "./actions";
import { CREATE_NOTIFICATION, GET_NOTIFICATION } from "./actionTypes";

function* fetchNotification(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getNotificationUrl, token);
    console.log(response);
  } catch (error) {
    yield put(getNotificationFail(error));
  }
}
function* createNotification(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createNotificationUrl, token);
    console.log(response);
  } catch (error) {
    yield put(getNotificationFail(error));
  }
}

function* notificationSaga() {
  yield takeEvery(GET_NOTIFICATION, fetchNotification);
  yield takeEvery(CREATE_NOTIFICATION, createNotification);
}

export default notificationSaga;
