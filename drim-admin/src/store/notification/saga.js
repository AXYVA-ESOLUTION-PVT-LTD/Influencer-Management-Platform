import { call, call, put, takeEvery } from "redux-saga/effects";
import {
  createNotificationUrl,
  getNotificationUrl,
  updateNotificationUrl,
} from "../../services/notification";
import { getNotificationFail } from "./actions";
import {
  CREATE_NOTIFICATION,
  GET_NOTIFICATION,
  UPDATE_NOTIFICATION,
} from "./actionTypes";

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

function* updateNotification(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateNotificationUrl, token);
    console.log(response);
  } catch (error) {
    yield put(getNotificationFail(error));
  }
}

function* notificationSaga() {
  yield takeEvery(GET_NOTIFICATION, fetchNotification);
  yield takeEvery(CREATE_NOTIFICATION, createNotification);
  yield takeEvery(UPDATE_NOTIFICATION, updateNotification);
}

export default notificationSaga;
