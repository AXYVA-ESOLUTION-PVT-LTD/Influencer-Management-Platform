import { post, put } from "../../helpers/api_helper";
import {
  CREATE_INFLUENCER_API,
  GET_INFLUENCER_API,
  GET_INFLUENCER_BASIC_DATA_API,
  GET_INFLUENCER_DEMOGRAPHIC_DATA_API,
  GET_INFLUENCER_MEDIA_DATA_API,
  GET_INFLUENCER_MONTHLY_STATISTICS_API,
  GET_INFLUENCER_POST_STATISTICS_API,
  GET_INFLUENCER_PROFILE_API,
  GET_INFLUENCER_PUBLICATION_DATA_API,
  UPDATE_INFLUENCER_API,
} from "./routes";

export const createInfluencersUrl = (token, data) => {
  return post(
    CREATE_INFLUENCER_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const getInfluencersUrl = (token, data) => {
  return post(
    GET_INFLUENCER_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const updateInfluencerUrl = (token, data) => {
  const { id, ...payload } = data;
  return put(
    `${UPDATE_INFLUENCER_API}/${id}`,
    { ...payload },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getInfluencerProfileUrl = (id , token) => {
  return post(`${GET_INFLUENCER_PROFILE_API}/${id}`, { }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getInfluencerBasicDataUrl = (id , token) => {
  return post(`${GET_INFLUENCER_BASIC_DATA_API}/${id}`, { }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getInfluencerPostStatisticsUrl = (id, token) => {
  return post(`${GET_INFLUENCER_POST_STATISTICS_API}/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getInfluencerMonthlyStatisticsUrl = (id, token) => {
  return post(`${GET_INFLUENCER_MONTHLY_STATISTICS_API}/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getInfluencerDemographicDataUrl = (id, token) => {
  return post(`${GET_INFLUENCER_DEMOGRAPHIC_DATA_API}/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getInfluencerPublicationDataUrl = (id, data , token) => {
  return post(`${GET_INFLUENCER_PUBLICATION_DATA_API}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getInfluencerMediaDataUrl = (id, token) => {
  return post(`${GET_INFLUENCER_MEDIA_DATA_API}/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
