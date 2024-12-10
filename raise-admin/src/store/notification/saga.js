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
import STATUS from "../../constants/status";

function* fetchNotification(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getNotificationUrl, token,action.payload);
    
    if (response?.status === STATUS.SUCCESS) {
      yield put(getNotificationSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || 'Failed to fetch notifications. Please try again later.');
    }
  } catch (error) {
    yield put(getNotificationFail(error.message || 'Failed to fetch notifications. Please try again later.'));
  }
}


function* createNotification(action) {
  const toastId = toast.loading("Creating Notification...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createNotificationUrl, token, action.payload);
    if (response?.status === STATUS.SUCCESS) {
      toast.update(toastId, {
        render: response.result.message || 'Notification created successfully',
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(createNotificationSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.message || 'Failed to create notification. Please try again later.');
    }
  } catch (error) {
    yield put(createNotificationFail(error.message || 'Failed to create notification. Please try again later.'));
    toast.update(toastId, {
      render: error.message || 'Failed to create notification',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* updateNotifications(action) {
  const toastId = toast.loading("Updating Notification...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateNotificationUrl, token, action.payload);
    if (response?.status === STATUS.SUCCESS) {
      toast.update(toastId, {
        render: response.result.message || 'Notification updated successfully',
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateNotificationSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || 'Failed to update notification. Please try again later.');
    }
  } catch (error) {
    yield put(updateNotificationFail(error.message || 'Failed to update notification. Please try again later.'));
    toast.update(toastId, {
      render: error.message || 'Failed to update notification',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* notificationSaga() {
  yield takeEvery(GET_NOTIFICATION, fetchNotification);
  yield takeEvery(CREATE_NOTIFICATION, createNotification);
  yield takeEvery(UPDATE_NOTIFICATION, updateNotifications);
}

export default notificationSaga;
