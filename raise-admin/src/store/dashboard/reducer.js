// dashboardReducer.js
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
  GET_FACEBOOK_USER_DATA,
  GET_FACEBOOK_USER_DATA_SUCCESS,
  GET_FACEBOOK_USER_DATA_FAIL,
  GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  GET_INSTAGRAM_USER_DATA,
  GET_INSTAGRAM_USER_DATA_SUCCESS,
  GET_INSTAGRAM_USER_DATA_FAIL,
  GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS,
  GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS,
  GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_FAIL,
  GET_INSTAGRAM_DEMOGRAPHICS,
  GET_INSTAGRAM_DEMOGRAPHICS_SUCCESS,
  GET_INSTAGRAM_DEMOGRAPHICS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  dashboardData: null,
  facebookUserData: null,
  instagramUserData : null,
  monthlyPostCount: null,
  monthlyEngagementRate: null,
  monthlyCommentCount: null,
  monthlyFacebookPostCount: null,
  monthlyFacebookEngagementRate: null,
  monthlyFacebookCommentCount: null,
  ageDemographics: null,
  genderDemographics: null,
  locationDemographics: null,
  demographicsData: null,
  loadingUserData: false,
  loadingAnalytics: false,
  loadingTicketStatistics: false,
  loadingInstagramAnalytics: false,
  loadingInstagramUserData: false,
  loadingDemographics: false,
  approvedCounts: null,
  declinedCounts: null,
  onHoldCounts: null,
  error: null,
};

const Dashboard = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TIKTOK_USER_DATA:
      return {
        ...state,
        loadingUserData: true,
        error: null,
      };
    case GET_TIKTOK_USER_DATA_SUCCESS:
      return {
        ...state,
        dashboardData: action.payload,
        loadingUserData: false,
      };
    case GET_TIKTOK_USER_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
        loadingUserData: false,
      };
    case GET_MONTHLY_PERFORMANCE_ANALYTICS:
      return {
        ...state,
        loadingAnalytics: true,
        error: null,
      };
    case GET_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS:
      return {
        ...state,
        monthlyPostCount: action.payload.postCountArray,
        monthlyEngagementRate: action.payload.engagementRateArray,
        monthlyCommentCount: action.payload.commentCountArray,
        loadingAnalytics: false,
      };
    case GET_MONTHLY_PERFORMANCE_ANALYTICS_FAIL:
      return {
        ...state,
        error: action.payload,
        loadingAnalytics: false,
      };

    case GET_FACEBOOK_USER_DATA:
      return {
        ...state,
        loadingUserData: true,
        error: null,
      };
    case GET_FACEBOOK_USER_DATA_SUCCESS:
      return {
        ...state,
        facebookUserData: action.payload,
        loadingUserData: false,
      };
    case GET_FACEBOOK_USER_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
        loadingUserData: false,
      };
    case GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS:
      return {
        ...state,
        loadingAnalytics: true,
        error: null,
      };
    case GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS:
      return {
        ...state,
        monthlyPostCount: action.payload.postCountArray,
        monthlyEngagementRate: action.payload.engagementRateArray,
        monthlyCommentCount: action.payload.commentCountArray,
        loadingAnalytics: false,
      };
    case GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_FAIL:
      return {
        ...state,
        error: action.payload,
        loadingAnalytics: false,
      };
    case GET_TICKET_ENGAGEMENT_STATISTICS:
      return {
        ...state,
        loadingTicketStatistics: true,
        error: null,
      };
    case GET_TICKET_ENGAGEMENT_STATISTICS_SUCCESS:
      return {
        ...state,
        approvedCounts: action.payload.approvedCounts,
        declinedCounts: action.payload.declinedCounts,
        onHoldCounts: action.payload.onHoldCounts,
        loadingTicketStatistics: false,
      };
    case GET_TICKET_ENGAGEMENT_STATISTICS_FAIL:
      return {
        ...state,
        error: action.payload,
        loadingTicketStatistics: false,
      };
    case GET_INSTAGRAM_USER_DATA:
      return {
        ...state,
        loadingUserData: true,
        error: null,
      };
    case GET_INSTAGRAM_USER_DATA_SUCCESS:
      return {
        ...state,
        instagramUserData: action.payload,
        loadingUserData: false,
      };
    case GET_INSTAGRAM_USER_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
        loadingUserData: false,
      };
    case GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS:
      return {
        ...state,
        loadingAnalytics: true,
        error: null,
      };
    case GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_SUCCESS:
      return {
        ...state,
        monthlyPostCount: action.payload.postCountArray,
        monthlyEngagementRate: action.payload.engagementRateArray,
        monthlyCommentCount: action.payload.commentCountArray,
        loadingAnalytics: false,
      };
    case GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_FAIL:
      return {
        ...state,
        error: action.payload,
        loadingAnalytics: false,
      };
    case GET_INSTAGRAM_DEMOGRAPHICS:
      return {
        ...state,
        loadingDemographics: true,
        error: null,
      };
    case GET_INSTAGRAM_DEMOGRAPHICS_SUCCESS:
      return {
        ...state,
        ageDemographics: action.payload.ageDemographics,
        genderDemographics: action.payload.genderDemographics,
        locationDemographics: action.payload.locationDemographics,
        loadingDemographics: false,
      };
    case GET_INSTAGRAM_DEMOGRAPHICS_FAIL:
      return {
        ...state,
        error: action.payload,
        ageDemographics: null,
        genderDemographics: null,
        locationDemographics: null,
        loadingDemographics: false,
      };

    default:
      return state;
  }
};

export default Dashboard;
