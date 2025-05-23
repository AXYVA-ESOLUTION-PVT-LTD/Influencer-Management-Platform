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
  GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_FACEBOOK_USER_DATA_FAIL,
  GET_FACEBOOK_USER_DATA_SUCCESS,
  GET_FACEBOOK_USER_DATA,
  GET_INSTAGRAM_USER_DATA,
  GET_INSTAGRAM_USER_DATA_SUCCESS,
  GET_INSTAGRAM_USER_DATA_FAIL,
  GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  GET_INSTAGRAM_DEMOGRAPHICS,
  GET_INSTAGRAM_DEMOGRAPHICS_SUCCESS,
  GET_INSTAGRAM_DEMOGRAPHICS_FAIL,
  GET_YOUTUBE_USER_DATA,
  GET_YOUTUBE_USER_DATA_SUCCESS,
  GET_YOUTUBE_USER_DATA_FAIL,
  GET_YOUTUBE_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_YOUTUBE_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  GET_YOUTUBE_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  GET_YOUTUBE_DEMOGRAPHICS,
  GET_YOUTUBE_DEMOGRAPHICS_SUCCESS,
  GET_YOUTUBE_DEMOGRAPHICS_FAIL,
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

export const getFacebookUserData = () => ({
  type: GET_FACEBOOK_USER_DATA,
});

export const getFacebookUserDataSuccess = (userData) => ({
  type: GET_FACEBOOK_USER_DATA_SUCCESS,
  payload: userData,
});

export const getFacebookUserDataFail = (error) => ({
  type: GET_FACEBOOK_USER_DATA_FAIL,
  payload: error,
});

export const getFacebookMonthlyPerformanceAnalytics = () => ({
  type: GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS,
});

export const getFacebookMonthlyPerformanceAnalyticsSuccess = (analyticsData) => ({
  type: GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  payload: analyticsData,
});

export const getFacebookMonthlyPerformanceAnalyticsFail = (error) => ({
  type: GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  payload: error,
});

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

export const getInstagramUserData = () => ({
  type: GET_INSTAGRAM_USER_DATA,
});

export const getInstagramUserDataSuccess = (userData) =>  
  ({
  type: GET_INSTAGRAM_USER_DATA_SUCCESS,
  payload: userData,
});

export const getInstagramUserDataFail = (error) => ({
  type: GET_INSTAGRAM_USER_DATA_FAIL,
  payload: error,
});

export const getInstagramMonthlyPerformanceAnalytics = () => ({
  type: GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS,
});

export const getInstagramMonthlyPerformanceAnalyticsSuccess = (analyticsData) => ({
  type: GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  payload: analyticsData,
});

export const getInstagramMonthlyPerformanceAnalyticsFail = (error) => ({
  type: GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  payload: error,
});

export const getInstagramDemographics = () => ({
  type: GET_INSTAGRAM_DEMOGRAPHICS,
});

export const getInstagramDemographicsSuccess = (demographicsData) => ({
  type: GET_INSTAGRAM_DEMOGRAPHICS_SUCCESS,
  payload: demographicsData,
});

export const getInstagramDemographicsFail = (error) => ({
  type: GET_INSTAGRAM_DEMOGRAPHICS_FAIL,
  payload: error,
});

export const getYouTubeUserData = () => ({
  type: GET_YOUTUBE_USER_DATA,
});

export const getYouTubeUserDataSuccess = (userData) => ({
  type: GET_YOUTUBE_USER_DATA_SUCCESS,
  payload: userData,
});

export const getYouTubeUserDataFail = (error) => ({
  type: GET_YOUTUBE_USER_DATA_FAIL,
  payload: error,
});

export const getYouTubeMonthlyPerformanceAnalytics = () => ({
  type: GET_YOUTUBE_MONTHLY_PERFORMANCE_ANALYTICS,
});

export const getYouTubeMonthlyPerformanceAnalyticsSuccess = (analyticsData) => ({
  type: GET_YOUTUBE_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  payload: analyticsData,
});

export const getYouTubeMonthlyPerformanceAnalyticsFail = (error) => ({
  type: GET_YOUTUBE_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  payload: error,
});

export const getYouTubeDemographics = () => ({
  type: GET_YOUTUBE_DEMOGRAPHICS,
});

export const getYouTubeDemographicsSuccess = (demographicsData) => ({
  type: GET_YOUTUBE_DEMOGRAPHICS_SUCCESS,
  payload: demographicsData,
});

export const getYouTubeDemographicsFail = (error) => ({
  type: GET_YOUTUBE_DEMOGRAPHICS_FAIL,
  payload: error,
});
