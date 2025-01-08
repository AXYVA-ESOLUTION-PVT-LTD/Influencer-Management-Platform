// saga.js
import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_TICKET_ENGAGEMENT_STATISTICS,
  GET_TIKTOK_USER_DATA
} from "./actionTypes";
import { getTikTokUserDataSuccess, getTikTokUserDataFail, getMonthlyPerformanceAnalyticsSuccess, getMonthlyPerformanceAnalyticsFail, getTicketEngagementStatisticsSuccess, getTicketEngagementStatisticsFail } from "./actions";
import { getMonthlyPerformanceAnalyticsUrl, getTicketEngagementStatisticsUrl, getTikTokUserDataUrl } from "../../services/dashboard";


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


function* DashboardSaga() {
  yield takeEvery(GET_TIKTOK_USER_DATA, fetchTikTokUserData);
  yield takeEvery(GET_MONTHLY_PERFORMANCE_ANALYTICS, fetchMonthlyPerformanceAnalytics);
  yield takeEvery(GET_TICKET_ENGAGEMENT_STATISTICS, fetchTicketEngagementStatistics);
}

export default DashboardSaga;