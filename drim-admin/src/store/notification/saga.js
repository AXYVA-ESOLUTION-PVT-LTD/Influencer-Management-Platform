import { call, put, takeEvery } from "redux-saga/effects";
import {
  createNotificationUrl,
  getNotificationUrl,
  updateNotificationUrl,
} from "../../services/notification";
import {
  createNotificationFail,
  createNotificationSuccess,
  getNotificationFail,
  getNotificationSuccess,
  updateNotificationFail,
  updateNotificationSuccess,
} from "./actions";
import {
  CREATE_NOTIFICATION,
  GET_NOTIFICATION,
  UPDATE_NOTIFICATION,
} from "./actionTypes";
import { toast } from "react-toastify";

function* fetchNotification(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getNotificationUrl, token);
    yield put(getNotificationSuccess(response.result.data));
  } catch (error) {
    yield put(getNotificationFail(error));
  }
}
function* createNotification(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createNotificationUrl, token,action.payload);
    toast.success(response.result.message);
    yield put(createNotificationSuccess(response.result.data));
  } catch (error) {
    yield put(createNotificationFail(error));
    toast.error(response.result.error);
  }
}

function* updateNotifications(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateNotificationUrl, token,action.payload);
    toast.success(response.result.message);
    yield put(updateNotificationSuccess(response.result.data));
  } catch (error) {
    yield put(updateNotificationFail(error));
    toast.error(response.result.error);
  }
}

function* notificationSaga() {
  yield takeEvery(GET_NOTIFICATION, fetchNotification);
  yield takeEvery(CREATE_NOTIFICATION, createNotification);
  yield takeEvery(UPDATE_NOTIFICATION, updateNotifications);
}

export default notificationSaga;
