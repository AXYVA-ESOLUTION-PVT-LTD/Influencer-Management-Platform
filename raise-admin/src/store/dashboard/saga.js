// saga.js
import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_FACEBOOK_USER_DATA,
  GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_INSTAGRAM_USER_DATA,
  GET_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_TICKET_ENGAGEMENT_STATISTICS,
  GET_TIKTOK_USER_DATA
} from "./actionTypes";
import { getTikTokUserDataSuccess, getTikTokUserDataFail, getMonthlyPerformanceAnalyticsSuccess, getMonthlyPerformanceAnalyticsFail, getTicketEngagementStatisticsSuccess, getTicketEngagementStatisticsFail, getFacebookUserDataSuccess, getFacebookUserDataFail, getFacebookMonthlyPerformanceAnalyticsSuccess, getFacebookMonthlyPerformanceAnalyticsFail, getInstagramUserDataSuccess, getInstagramUserDataFail, getInstagramMonthlyPerformanceAnalyticsSuccess, getInstagramMonthlyPerformanceAnalyticsFail } from "./actions";
import { getFacebookMonthlyPerformanceAnalyticsUrl, getFacebookUserDataUrl, getInstagramMonthlyPerformanceAnalyticsUrl, getInstagramUserDataUrl, getMonthlyPerformanceAnalyticsUrl, getTicketEngagementStatisticsUrl, getTikTokUserDataUrl } from "../../services/dashboard";


function* fetchTikTokUserData() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    if (!accessToken) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getTikTokUserDataUrl, accessToken);
    
    if (response?.status == "Success") {
      yield put(getTikTokUserDataSuccess(response.result));
      
    } else {
      throw new Error(response?.result?.message || "Failed to fetch TikTok user data.");
    }
  } catch (error) {
    yield put(getTikTokUserDataFail(error.message || "An error occurred."));
  }
}

function* fetchMonthlyPerformanceAnalytics() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    if (!accessToken) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getMonthlyPerformanceAnalyticsUrl, accessToken);

    if (response?.status === "Success") {
      yield put(getMonthlyPerformanceAnalyticsSuccess(response.result));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch monthly performance analytics.");
    }
  } catch (error) {
    yield put(getMonthlyPerformanceAnalyticsFail(error.message || "An error occurred."));
  }
}

function* fetchFacebookUserData() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    if (!accessToken) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getFacebookUserDataUrl, accessToken);

    if (response?.status === "Success") {
      yield put(getFacebookUserDataSuccess(response.userInfo));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch Facebook user data.");
    }
  } catch (error) {
    yield put(getFacebookUserDataFail(error.message || "An error occurred."));
  }
}

function* fetchFacebookMonthlyPerformanceAnalytics() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    if (!accessToken) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getFacebookMonthlyPerformanceAnalyticsUrl, accessToken);

    if (response?.status === "Success") {
      yield put(getFacebookMonthlyPerformanceAnalyticsSuccess(response.result));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch Facebook monthly performance analytics.");
    }
  } catch (error) {
    yield put(getFacebookMonthlyPerformanceAnalyticsFail(error.message || "An error occurred."));
  }
}

function* fetchTicketEngagementStatistics() {
  try {
    const token = localStorage.getItem("authUser");

    if (!token) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getTicketEngagementStatisticsUrl, token);

    if (response?.status === "Success") {
      yield put(getTicketEngagementStatisticsSuccess(response?.result?.data));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch ticket engagement statistics.");
    }
  } catch (error) {
    yield put(getTicketEngagementStatisticsFail(error.message || "An error occurred."));
  }
}

function* fetchInstagramUserData() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    if (!accessToken) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getInstagramUserDataUrl, accessToken);

    if (response?.status === "Success") {
      yield put(getInstagramUserDataSuccess(response.userInfo));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch Instagram user data.");
    }
  } catch (error) {
    yield put(getInstagramUserDataFail(error.message || "An error occurred."));
  }
}

function* fetchInstagramMonthlyPerformanceAnalytics() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;
    
    if (!accessToken) { 
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getInstagramMonthlyPerformanceAnalyticsUrl, accessToken);

    if (response?.status === "Success") {
      yield put(getInstagramMonthlyPerformanceAnalyticsSuccess(response.result));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch Instagram monthly performance analytics.");
    }
  } catch (error) {
    yield put(getInstagramMonthlyPerformanceAnalyticsFail(error.message || "An error occurred."));
  }
}

function* DashboardSaga() {
  yield takeEvery(GET_TIKTOK_USER_DATA, fetchTikTokUserData);
  yield takeEvery(GET_MONTHLY_PERFORMANCE_ANALYTICS, fetchMonthlyPerformanceAnalytics);
  yield takeEvery(GET_TICKET_ENGAGEMENT_STATISTICS, fetchTicketEngagementStatistics);
  yield takeEvery(GET_FACEBOOK_USER_DATA, fetchFacebookUserData);
  yield takeEvery(GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS, fetchFacebookMonthlyPerformanceAnalytics);
  yield takeEvery(GET_INSTAGRAM_USER_DATA, fetchInstagramUserData);
  yield takeEvery(GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS, fetchInstagramMonthlyPerformanceAnalytics);
}

export default DashboardSaga;