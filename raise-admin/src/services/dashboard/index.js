import { post , get } from "../../helpers/api_helper";
import {
  GET_MONTHLY_PERFORMANCE_ANALYTICS_API,
  GET_TICKET_ENGAGEMENT_STATISTICS_API,
  GET_TIKTOK_USER_DATA_API,
  GET_FACEBOOK_USER_DATA_API,
  GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_API,
  GET_INSTAGRAM_USER_DATA_API,
  GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_API,
  GET_INSTAGRAM_DEMOGRAPHICS_API
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

export const getFacebookUserDataUrl = (token) => {
  return post(
    GET_FACEBOOK_USER_DATA_API,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getFacebookMonthlyPerformanceAnalyticsUrl = (token) => {
  return get(
    GET_FACEBOOK_MONTHLY_PERFORMANCE_ANALYTICS_API,
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

export const getInstagramUserDataUrl = (token) => {
  return post(
    GET_INSTAGRAM_USER_DATA_API,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getInstagramMonthlyPerformanceAnalyticsUrl = (token) => {
  return get(
    GET_INSTAGRAM_MONTHLY_PERFORMANCE_ANALYTICS_API,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getInstagramDemographicsUrl = (token) => {
  return get(
    GET_INSTAGRAM_DEMOGRAPHICS_API,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
