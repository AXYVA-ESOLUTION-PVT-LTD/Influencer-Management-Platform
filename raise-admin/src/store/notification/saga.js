import { call, put, takeEvery } from "redux-saga/effects";
import {
  createNotificationUrl,
  createTicketNotificationUrl, fetchUnreadNotificationsUrl, getTicketNotificationUrl, markNotificationAsReadUrl, updateTicketNotificationUrl
} from "../../services/notification";
import {
  createNotificationFail,
  createNotificationSuccess,
  createTicketNotificationFail,
  createTicketNotificationSuccess, fetchUnreadNotifications, fetchUnreadNotificationsFail, fetchUnreadNotificationsSuccess, getTicketNotification, getTicketNotificationFail,
  getTicketNotificationSuccess, markNotificationAsReadFail, markNotificationAsReadSuccess, updateTicketNotificationFail,
  updateTicketNotificationSuccess
} from "./actions";
import {
  CREATE_NOTIFICATION,
  CREATE_TICKET_NOTIFICATION,
  FETCH_UNREAD_NOTIFICATIONS,
  GET_TICKET_NOTIFICATION,
  MARK_NOTIFICATION_AS_READ,
  UPDATE_TICKET_NOTIFICATION,
} from "./actionTypes";
import { toast } from "react-toastify";
import STATUS from "../../constants/status";

function* fetchTicketNotification(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getTicketNotificationUrl, token,action.payload);
    
    if (response?.status === STATUS.SUCCESS) {
      yield put(getTicketNotificationSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || 'Failed to fetch notifications. Please try again later.');
    }
  } catch (error) {
    yield put(getTicketNotificationFail(error.message || 'Failed to fetch notifications. Please try again later.'));
  }
}


function* createTicketNotification(action) {
  const toastId = toast.loading("Creating Notification...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createTicketNotificationUrl, token, action.payload);
    if (response?.status === STATUS.SUCCESS) {
      toast.update(toastId, {
        render: 'Opportunity applied successfully',
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(createTicketNotificationSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.message || 'Failed to create notification. Please try again later.');
    }
  } catch (error) {
    yield put(createTicketNotificationFail(error.message || 'Failed to create notification. Please try again later.'));
    toast.update(toastId, {
      render: error.message || 'Failed to create notification',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* updateTicketNotifications(action) {
  const toastId = toast.loading("Updating Notification...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateTicketNotificationUrl, token, action.payload);
    if (response?.status === STATUS.SUCCESS) {
      toast.update(toastId, {
        render: response.result.message || 'Notification updated successfully',
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateTicketNotificationSuccess());

      yield put(
        getTicketNotification({
          limit: 10,
          pageCount: 0,
          title: "",
          name: "",
          email: "",
          status: "",
        })
      );
    } else {
      throw new Error(response?.result?.error || 'Failed to update notification. Please try again later.');
    }
  } catch (error) {
    yield put(updateTicketNotificationFail(error.message || 'Failed to update notification. Please try again later.'));
    toast.update(toastId, {
      render: error.message || 'Failed to update notification',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* createNotificationSaga(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createNotificationUrl, token, action.payload);

    if (response?.status === "success") {
      yield put(createNotificationSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.message || "Failed to create notification.");
    }
  } catch (error) {
    yield put(createNotificationFail(error.message || "Failed to create notification."));
  }
}

function* fetchUnreadNotificationsSaga() {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(fetchUnreadNotificationsUrl, token);

    if (response?.status === "Success") {
      yield put(fetchUnreadNotificationsSuccess(response.result));
    } else {
      throw new Error(response?.message || "Failed to fetch notifications.");
    }
  } catch (error) {
    yield put(fetchUnreadNotificationsFail(error.message || "Failed to fetch notifications."));
  }
}
function* markNotificationAsReadSaga(action) {
  try {
    const token = localStorage.getItem("authUser");
    yield call(markNotificationAsReadUrl, token, action.payload);

    yield put(markNotificationAsReadSuccess({ notificationId: action.payload }));
    // Optionally refetch unread notifications:
    yield put(fetchUnreadNotifications());
  } catch (error) {
    yield put(markNotificationAsReadFail(error.message || "Failed to mark notification as read."));
  }
}


function* NotificationSaga() {
  yield takeEvery(GET_TICKET_NOTIFICATION, fetchTicketNotification);
  yield takeEvery(CREATE_TICKET_NOTIFICATION, createTicketNotification);
  yield takeEvery(UPDATE_TICKET_NOTIFICATION, updateTicketNotifications);
  yield takeEvery(CREATE_NOTIFICATION, createNotificationSaga);
  yield takeEvery(FETCH_UNREAD_NOTIFICATIONS, fetchUnreadNotificationsSaga);
  yield takeEvery(MARK_NOTIFICATION_AS_READ, markNotificationAsReadSaga);
}

export default NotificationSaga;
