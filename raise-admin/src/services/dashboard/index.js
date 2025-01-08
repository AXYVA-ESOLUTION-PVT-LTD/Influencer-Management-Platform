import { post , get } from "../../helpers/api_helper";
import {
  GET_MONTHLY_PERFORMANCE_ANALYTICS_API,
  GET_TICKET_ENGAGEMENT_STATISTICS_API,
  GET_TIKTOK_USER_DATA_API,
} from "./routes";


export const getTikTokUserDataUrl = (token) => {
  return post(
    GET_TIKTOK_USER_DATA_API,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getMonthlyPerformanceAnalyticsUrl = (token) => {
  return get(
    GET_MONTHLY_PERFORMANCE_ANALYTICS_API,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getTicketEngagementStatisticsUrl = (token) => {
  return get(
    GET_TICKET_ENGAGEMENT_STATISTICS_API,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};