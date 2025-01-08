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
} from "./actionTypes";

const INIT_STATE = {
  dashboardData: null, 
  monthlyPostCount: null,
  monthlyEngagementRate: null,
  monthlyCommentCount: null,
  loadingUserData: false, 
  loadingAnalytics: false,
  loadingTicketStatistics: false,
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
    default:
      return state;
  }
};

export default Dashboard;
