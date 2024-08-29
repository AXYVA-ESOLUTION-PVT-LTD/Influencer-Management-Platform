import {
  ADD_INFLUENCER,
  ADD_INFLUENCER_FAIL,
  ADD_INFLUENCER_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  influencers: [],
  loading: false,
  error: {},
};

const influencer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_INFLUENCER:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_INFLUENCER_SUCCESS:
      return {
        ...state,
        influencers: [...state.influencers, action.payload],
      };

    case ADD_INFLUENCER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default influencer;
