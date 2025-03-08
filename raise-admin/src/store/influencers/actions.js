import {
  ADD_INFLUENCER,
  ADD_INFLUENCER_FAIL,
  ADD_INFLUENCER_SUCCESS,
  GET_INFLUENCER_BASIC_DATA,
  GET_INFLUENCER_BASIC_DATA_FAIL,
  GET_INFLUENCER_BASIC_DATA_SUCCESS,
  GET_INFLUENCER_DEMOGRAPHIC_DATA,
  GET_INFLUENCER_DEMOGRAPHIC_DATA_FAIL,
  GET_INFLUENCER_DEMOGRAPHIC_DATA_SUCCESS,
  GET_INFLUENCER_MEDIA_DATA,
  GET_INFLUENCER_MEDIA_DATA_FAIL,
  GET_INFLUENCER_MEDIA_DATA_SUCCESS,
  GET_INFLUENCER_MONTHLY_STATISTICS,
  GET_INFLUENCER_MONTHLY_STATISTICS_FAIL,
  GET_INFLUENCER_MONTHLY_STATISTICS_SUCCESS,
  GET_INFLUENCER_POST_STATISTICS,
  GET_INFLUENCER_POST_STATISTICS_FAIL,
  GET_INFLUENCER_POST_STATISTICS_SUCCESS,
  GET_INFLUENCER_PROFILE,
  GET_INFLUENCER_PROFILE_FAIL,
  GET_INFLUENCER_PROFILE_SUCCESS,
  GET_INFLUENCER_PUBLICATION_DATA,
  GET_INFLUENCER_PUBLICATION_DATA_FAIL,
  GET_INFLUENCER_PUBLICATION_DATA_SUCCESS,
  GET_INFLUENCERS,
  GET_INFLUENCERS_FAIL,
  GET_INFLUENCERS_SUCCESS,
  UPDATE_INFLUENCER,
  UPDATE_INFLUENCER_FAIL,
  UPDATE_INFLUENCER_SUCCESS,
} from "./actionTypes";

// Fetch all influencers
export const getInfluencers = (payload) => ({
  type: GET_INFLUENCERS,
  payload,
});

export const getInfluencersSuccess = (influencers) => ({
  type: GET_INFLUENCERS_SUCCESS,
  payload: influencers,
});

export const getInfluencersFail = (error) => ({
  type: GET_INFLUENCERS_FAIL,
  payload: error,
});

// Add a new influencer
export const addNewInfluencer = (influencer) => {
  return {
    type: ADD_INFLUENCER,
    payload: influencer,
  };
};

export const addInfluencerSuccess = (influencer) => {
  return {
    type: ADD_INFLUENCER_SUCCESS,
    payload: influencer,
  };
};

export const addInfluencerFail = (error) => ({
  type: ADD_INFLUENCER_FAIL,
  payload: error,
});

// Update an influencer
export const updateInfluencer = (payload) => ({
  type: UPDATE_INFLUENCER,
  payload: payload,
});

export const updateInfluencerSuccess = (payload) => ({
  type: UPDATE_INFLUENCER_SUCCESS,
  payload: payload,
});

export const updateInfluencerFail = (error) => ({
  type: UPDATE_INFLUENCER_FAIL,
  payload: error,
});

export const getInfluencerProfile = (id) => ({
  type: GET_INFLUENCER_PROFILE,
  payload: id,
});

export const getInfluencerProfileSuccess = (profile) => ({
  type: GET_INFLUENCER_PROFILE_SUCCESS,
  payload: profile,
});

export const getInfluencerProfileFail = (error) => ({
  type: GET_INFLUENCER_PROFILE_FAIL,
  payload: error,
});

export const getInfluencerBasicData = (id) => ({
  type: GET_INFLUENCER_BASIC_DATA,
  payload: id,
});
export const getInfluencerBasicDataSuccess = (data) => ({
  type: GET_INFLUENCER_BASIC_DATA_SUCCESS,
  payload: data,
});
export const getInfluencerBasicDataFail = (error) => ({
  type: GET_INFLUENCER_BASIC_DATA_FAIL,
  payload: error,
});

export const getInfluencerPostStatistics = (id) => ({
  type: GET_INFLUENCER_POST_STATISTICS,
  payload: id,
});
export const getInfluencerPostStatisticsSuccess = (data) => ({
  type: GET_INFLUENCER_POST_STATISTICS_SUCCESS,
  payload: data,
});
export const getInfluencerPostStatisticsFail = (error) => ({
  type: GET_INFLUENCER_POST_STATISTICS_FAIL,
  payload: error,
});

export const getInfluencerMonthlyStatistics = (id) => ({
  type: GET_INFLUENCER_MONTHLY_STATISTICS,
  payload: id,
});
export const getInfluencerMonthlyStatisticsSuccess = (data) => ({
  type: GET_INFLUENCER_MONTHLY_STATISTICS_SUCCESS,
  payload: data,
});
export const getInfluencerMonthlyStatisticsFail = (error) => ({
  type: GET_INFLUENCER_MONTHLY_STATISTICS_FAIL,
  payload: error,
});

export const getInfluencerDemographicData = (id) => ({
  type: GET_INFLUENCER_DEMOGRAPHIC_DATA,
  payload: id,
});
export const getInfluencerDemographicDataSuccess = (data) => ({
  type: GET_INFLUENCER_DEMOGRAPHIC_DATA_SUCCESS,
  payload: data,
});
export const getInfluencerDemographicDataFail = (error) => ({
  type: GET_INFLUENCER_DEMOGRAPHIC_DATA_FAIL,
  payload: error,
});

export const getInfluencerPublicationData = (id) => ({
  type: GET_INFLUENCER_PUBLICATION_DATA,
  payload: id,
});
export const getInfluencerPublicationDataSuccess = (data) => ({
  type: GET_INFLUENCER_PUBLICATION_DATA_SUCCESS,
  payload: data,
});
export const getInfluencerPublicationDataFail = (error) => ({
  type: GET_INFLUENCER_PUBLICATION_DATA_FAIL,
  payload: error,
});

export const getInfluencerMediaData = (id) => ({
  type: GET_INFLUENCER_MEDIA_DATA,
  payload: id,
});
export const getInfluencerMediaDataSuccess = (data) => ({
  type: GET_INFLUENCER_MEDIA_DATA_SUCCESS,
  payload: data,
});
export const getInfluencerMediaDataFail = (error) => ({
  type: GET_INFLUENCER_MEDIA_DATA_FAIL,
  payload: error,
});
