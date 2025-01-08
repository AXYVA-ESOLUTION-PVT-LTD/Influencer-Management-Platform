// actions.js
import {
  GET_TIKTOK_USER_DATA,
  GET_TIKTOK_USER_DATA_SUCCESS,
  GET_TIKTOK_USER_DATA_FAIL,
  GET_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  GET_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  GET_TICKET_ENGAGEMENT_STATISTICS,
  GET_TICKET_ENGAGEMENT_STATISTICS_SUCCESS,
  GET_TICKET_ENGAGEMENT_STATISTICS_FAIL,
} from "./actionTypes";

export const getTikTokUserData = () => ({
  type: GET_TIKTOK_USER_DATA,
});

export const getTikTokUserDataSuccess = (userData) => ({
  type: GET_TIKTOK_USER_DATA_SUCCESS,
  payload: userData,
});

export const getTikTokUserDataFail = (error) => ({
  type: GET_TIKTOK_USER_DATA_FAIL,
  payload: error,
});

export const getMonthlyPerformanceAnalytics = () => ({
  type: GET_MONTHLY_PERFORMANCE_ANALYTICS,
});

export const getMonthlyPerformanceAnalyticsSuccess = (analyticsData) => ({
  type: GET_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  payload: analyticsData,
});

export const getMonthlyPerformanceAnalyticsFail = (error) => ({
  type: GET_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  payload: error,
});

// actions.js
export const getTicketEngagementStatistics = () => ({
  type: GET_TICKET_ENGAGEMENT_STATISTICS,
});

export const getTicketEngagementStatisticsSuccess = (statisticsData) => ({
  type: GET_TICKET_ENGAGEMENT_STATISTICS_SUCCESS,
  payload: statisticsData,
});

export const getTicketEngagementStatisticsFail = (error) => ({
  type: GET_TICKET_ENGAGEMENT_STATISTICS_FAIL,
  payload: error,
});

