import {
  GET_INFLUENCERS_FAIL,
  GET_INFLUENCERS_SUCCESS,
  ADD_INFLUENCER_SUCCESS,
  ADD_INFLUENCER_FAIL,
  UPDATE_INFLUENCER_SUCCESS,
  UPDATE_INFLUENCER_FAIL,
  DELETE_INFLUENCER_SUCCESS,
  DELETE_INFLUENCER_FAIL,
  GET_SPECIFIC_INFLUENCER_FAIL,
  GET_SPECIFIC_INFLUENCER_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  influencers: [],
  influencerDetail: {},
  error: {},
};

const influencer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INFLUENCERS_SUCCESS:
      return {
        ...state,
        influencers: action.payload,
      };

    case GET_INFLUENCERS_FAIL:
      return {
        ...state,
        error: action.payload,
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

    case UPDATE_INFLUENCER_SUCCESS:
      return {
        ...state,
        influencers: state.influencers.map((influencer) =>
          influencer._id.toString() === action.payload._id.toString()
            ? { ...influencer, ...action.payload }
            : influencer
        ),
      };

    case UPDATE_INFLUENCER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_INFLUENCER_SUCCESS:
      return {
        ...state,
        influencers: state.influencers.filter(
          (influencer) => influencer._id.toString() !== action.payload.toString()
        ),
      };

    case DELETE_INFLUENCER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SPECIFIC_INFLUENCER_SUCCESS:
      return {
        ...state,
        influencerDetail: action.payload,
      };

    case GET_SPECIFIC_INFLUENCER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default influencer;
