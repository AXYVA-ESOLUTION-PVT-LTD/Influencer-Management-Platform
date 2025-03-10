// saga.js
import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_FACEBOOK_USER_DATA,
  GET_INSTAGRAM_DEMOGRAPHICS,
  GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_INSTAGRAM_USER_DATA,
  GET_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_TICKET_ENGAGEMENT_STATISTICS,
  GET_TIKTOK_USER_DATA,
  GET_YOUTUBE_DEMOGRAPHICS,
  GET_YOUTUBE_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_YOUTUBE_USER_DATA
} from "./actionTypes";
import { getTikTokUserDataSuccess, getTikTokUserDataFail, getMonthlyPerformanceAnalyticsSuccess, getMonthlyPerformanceAnalyticsFail, getTicketEngagementStatisticsSuccess, getTicketEngagementStatisticsFail, getFacebookUserDataSuccess, getFacebookUserDataFail, getFacebookMonthlyPerformanceAnalyticsSuccess, getFacebookMonthlyPerformanceAnalyticsFail, getInstagramUserDataSuccess, getInstagramUserDataFail, getInstagramMonthlyPerformanceAnalyticsSuccess, getInstagramMonthlyPerformanceAnalyticsFail, getInstagramDemographicsSuccess, getInstagramDemographicsFail, getYouTubeMonthlyPerformanceAnalyticsSuccess, getYouTubeMonthlyPerformanceAnalyticsFail, getYouTubeUserDataFail, getYouTubeUserDataSuccess, getYouTubeDemographicsSuccess, getYouTubeDemographicsFail } from "./actions";
import { getFacebookMonthlyPerformanceAnalyticsUrl, getFacebookUserDataUrl, getInstagramDemographicsUrl, getInstagramMonthlyPerformanceAnalyticsUrl, getInstagramUserDataUrl, getMonthlyPerformanceAnalyticsUrl, getTicketEngagementStatisticsUrl, getTikTokUserDataUrl, getYouTubeDemographicsUrl, getYouTubeMonthlyPerformanceAnalyticsUrl, getYouTubeUserDataUrl } from "../../services/dashboard";
import STATUS from "../../constants/status";

function* fetchTikTokUserData() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    if (!accessToken) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getTikTokUserDataUrl, accessToken);
    
    if (response?.status == STATUS.SUCCESS) {
      yield put(getTikTokUserDataSuccess(response?.result?.userInfo?.user));
      
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

    if (response?.status === STATUS.SUCCESS) {
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

    if (response?.status === STATUS.SUCCESS) {
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

    if (response?.status === STATUS.SUCCESS) {
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

    if (response?.status === STATUS.SUCCESS) {
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

    if (response?.status === STATUS.SUCCESS) {
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

    if (response?.status === STATUS.SUCCESS) {
      yield put(getInstagramMonthlyPerformanceAnalyticsSuccess(response.result));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch Instagram monthly performance analytics.");
    }
  } catch (error) {
    yield put(getInstagramMonthlyPerformanceAnalyticsFail(error.message || "An error occurred."));
  }
}

function* fetchInstagramDemographics() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    if (!accessToken) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getInstagramDemographicsUrl, accessToken);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getInstagramDemographicsSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch Instagram demographics.");
    }
  } catch (error) {
    yield put(getInstagramDemographicsFail(error.message || "An error occurred."));
  }
}

function* fetchYouTubeUserData() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.refreshToken;

    if (!accessToken) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getYouTubeUserDataUrl, accessToken);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getYouTubeUserDataSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch YouTube user data.");
    }
  } catch (error) {
    yield put(getYouTubeUserDataFail(error.message || "An error occurred."));
  }
}

function* fetchYouTubeMonthlyPerformanceAnalytics() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.refreshToken;
    
    if (!accessToken) { 
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getYouTubeMonthlyPerformanceAnalyticsUrl, accessToken);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getYouTubeMonthlyPerformanceAnalyticsSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch YouTube monthly performance analytics.");
    }
  } catch (error) {
    yield put(getYouTubeMonthlyPerformanceAnalyticsFail(error.message || "An error occurred."));
  }
}

function* fetchYouTubeDemographics() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.refreshToken;

    if (!accessToken) {
      throw new Error("Access token not found in localStorage");
    }

    const response = yield call(getYouTubeDemographicsUrl, accessToken);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getYouTubeDemographicsSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch YouTube demographics.");
    }
  } catch (error) {
    yield put(getYouTubeDemographicsFail(error.message || "An error occurred."));
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
  yield takeEvery(GET_INSTAGRAM_DEMOGRAPHICS, fetchInstagramDemographics);
  yield takeEvery(GET_YOUTUBE_USER_DATA, fetchYouTubeUserData);
  yield takeEvery(GET_YOUTUBE_MONTHLY_PERFORMANCE_ANALYTICS, fetchYouTubeMonthlyPerformanceAnalytics);
  yield takeEvery(GET_YOUTUBE_DEMOGRAPHICS, fetchYouTubeDemographics);
}

export default DashboardSaga;