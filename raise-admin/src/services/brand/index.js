import { post, put } from "../../helpers/api_helper";
import { CREATE_BRAND_API, GET_ALL_PUBLICATIONS_BY_BRAND_API, GET_BRAND_API, GET_BRAND_STATISTICS_API, GET_INFLUENCER_STATISTICS_API, GET_INFLUENCER_STATISTICS_BY_COUNTRY_API, GET_INFLUENCER_STATISTICS_BY_PLATFORM_API, GET_OPPORTUNITY_STATISTICS_API, UPDATE_BRAND_API } from "./routes";

export const createBrandUrl = (token, data) => {
  return post(
    CREATE_BRAND_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getBrandUrl = (token, data) => {
  return post(
    GET_BRAND_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateBrandUrl = (token, data) => {
  const { id, ...payload } = data;
  return put(
    `${UPDATE_BRAND_API}/${id}`,
    { ...payload },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getBrandStatisticsUrl = (token) => {
  return post(
    GET_BRAND_STATISTICS_API,
    {  },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getOpportunityStatisticsUrl = (token) => {
  return post(
    GET_OPPORTUNITY_STATISTICS_API,
    { },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getInfluencerStatisticsUrl = (token) => {
  return post(
    GET_INFLUENCER_STATISTICS_API,
    {  },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getInfluencerStatisticsByPlatformUrl = (token) => {
  return post(
    GET_INFLUENCER_STATISTICS_BY_PLATFORM_API,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getInfluencerStatisticsByCountryUrl = (token) => {
  return post(
    GET_INFLUENCER_STATISTICS_BY_COUNTRY_API,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getAllPublicationsByBrandApi = (payload, token) => {
  return post(
    GET_ALL_PUBLICATIONS_BY_BRAND_API,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};