import {
  ADD_INFLUENCER,
  ADD_INFLUENCER_FAIL,
  ADD_INFLUENCER_SUCCESS,
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
