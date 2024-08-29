import {
  ADD_INFLUENCER,
  ADD_INFLUENCER_SUCCESS,
  ADD_INFLUENCER_FAIL,
  DELETE_INFLUENCER,
  DELETE_INFLUENCER_SUCCESS,
  DELETE_INFLUENCER_FAIL,
  GET_INFLUENCERS,
  GET_INFLUENCERS_SUCCESS,
  GET_INFLUENCERS_FAIL,
  UPDATE_INFLUENCER,
  UPDATE_INFLUENCER_SUCCESS,
  UPDATE_INFLUENCER_FAIL,
  GET_SPECIFIC_INFLUENCER,
  GET_SPECIFIC_INFLUENCER_SUCCESS,
  GET_SPECIFIC_INFLUENCER_FAIL,
} from "./actionTypes";

// Fetch all influencers
export const getInfluencers = () => ({
  type: GET_INFLUENCERS,
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
export const updateInfluencer = (influencer) => ({
  type: UPDATE_INFLUENCER,
  payload: influencer,
});

export const updateInfluencerSuccess = (influencer) => ({
  type: UPDATE_INFLUENCER_SUCCESS,
  payload: influencer,
});

export const updateInfluencerFail = (error) => ({
  type: UPDATE_INFLUENCER_FAIL,
  payload: error,
});

// Delete an influencer
export const deleteInfluencer = (influencerId) => ({
  type: DELETE_INFLUENCER,
  payload: influencerId,
});

export const deleteInfluencerSuccess = (influencerId) => ({
  type: DELETE_INFLUENCER_SUCCESS,
  payload: influencerId,
});

export const deleteInfluencerFail = (error) => ({
  type: DELETE_INFLUENCER_FAIL,
  payload: error,
});

// Get details of a specific influencer
export const getInfluencerDetail = (influencerId) => ({
  type: GET_SPECIFIC_INFLUENCER,
  influencerId,
});

export const getInfluencerDetailSuccess = (influencerDetails) => ({
  type: GET_SPECIFIC_INFLUENCER_SUCCESS,
  payload: influencerDetails,
});

export const getInfluencerDetailFail = (error) => ({
  type: GET_SPECIFIC_INFLUENCER_FAIL,
  payload: error,
});
