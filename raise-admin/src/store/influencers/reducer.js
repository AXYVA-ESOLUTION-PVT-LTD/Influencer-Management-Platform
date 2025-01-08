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

const INIT_STATE = {
  influencers: [],
  totalInfluencers: null,
  currentPage: null,
  loading: false,
  error: {},
};

const Influencer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INFLUENCERS:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_INFLUENCERS_SUCCESS:
      return {
        ...state,
        influencers: [...action.payload.influencers],
        totalInfluencers: action.payload.totalInfluencers,
        loading:false,
      };
    case GET_INFLUENCERS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading:false,
      };

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
        totalInfluencers : state.totalInfluencers + 1,
        loading:false
      };
    case ADD_INFLUENCER_FAIL:
      return {
        ...state,
        error: action.payload,
        loading:false
      };

    case UPDATE_INFLUENCER:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_INFLUENCER_SUCCESS:
      const { _id: updatedInfluencerId } = action.payload;
      return {
        ...state,
        influencers: state.influencers.map((influencer) =>
          influencer._id === updatedInfluencerId
            ? { ...action.payload }
            : influencer
        ),
        loading: false,
      };
    case UPDATE_INFLUENCER_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default Influencer;
