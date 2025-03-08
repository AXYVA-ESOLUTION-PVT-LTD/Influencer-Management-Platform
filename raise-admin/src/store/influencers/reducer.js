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

const INIT_STATE = {
  influencers: [],
  totalInfluencers: null,
  influencerProfile: null,
  influencerBasicData: null,
  influencerPostStatistics: null,
  influencerMonthlyStatistics: null,
  influencerDemographicData: null,
  influencerPublicationData: null,
  influencerMediaData: null,
  addInfluencerSuccess : false,
  totalRecords : null,
  loading: false,
  loadingProfile: false,
  loadingBasicData: false,
  loadingPostStatistics: false,
  loadingMonthlyStatistics: false,
  loadingDemographicData: false,
  loadingPublicationData: false,
  loadingMediaData: false,
  error: {},
  errorProfile: {},
  errorBasicData: {},
  errorPostStatistics: {},
  errorMonthlyStatistics: {},
  errorDemographicData: {},
  errorPublicationData: {},
  errorMediaData: {},
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
    case GET_INFLUENCER_PROFILE:
      return { ...state, loadingProfile: true, errorProfile: null };
    case GET_INFLUENCER_PROFILE_SUCCESS:
      return {
        ...state,
        influencerProfile: action.payload,
        loadingProfile: false,
      };
    case GET_INFLUENCER_PROFILE_FAIL:
      return { ...state, error: action.payload, loadingProfile: false };
    case GET_INFLUENCER_BASIC_DATA:
      return { ...state, loadingBasicData: true, errorBasicData: null };
    case GET_INFLUENCER_BASIC_DATA_SUCCESS:
      return {
        ...state,
        influencerBasicData: action.payload,
        loadingBasicData: false,
      };
    case GET_INFLUENCER_BASIC_DATA_FAIL:
      return {
        ...state,
        errorBasicData: action.payload,
        loadingBasicData: false,
      };
    case GET_INFLUENCER_POST_STATISTICS:
      return {
        ...state,
        loadingPostStatistics: true,
        errorPostStatistics: null,
      };
    case GET_INFLUENCER_POST_STATISTICS_SUCCESS:
      return {
        ...state,
        influencerPostStatistics: action.payload,
        loadingPostStatistics: false,
      };

    case GET_INFLUENCER_POST_STATISTICS_FAIL:
      return {
        ...state,
        errorPostStatistics: action.payload,
        loadingPostStatistics: false,
      };

    case GET_INFLUENCER_MONTHLY_STATISTICS:
      return {
        ...state,
        loadingMonthlyStatistics: true,
        errorMonthlyStatistics: null,
      };

    case GET_INFLUENCER_MONTHLY_STATISTICS_SUCCESS:
      return {
        ...state,
        influencerMonthlyStatistics: action.payload,
        loadingMonthlyStatistics: false,
      };

    case GET_INFLUENCER_MONTHLY_STATISTICS_FAIL:
      return {
        ...state,
        errorMonthlyStatistics: action.payload,
        loadingMonthlyStatistics: false,
      };
    case GET_INFLUENCER_DEMOGRAPHIC_DATA:
      return {
        ...state,
        loadingDemographicData: true,
        errorDemographicData: null,
      };
    case GET_INFLUENCER_DEMOGRAPHIC_DATA_SUCCESS:
      return {
        ...state,
        influencerDemographicData: action.payload,
        loadingDemographicData: false,
      };
    case GET_INFLUENCER_DEMOGRAPHIC_DATA_FAIL:
      return {
        ...state,
        errorDemographicData: action.payload,
        loadingDemographicData: false,
      };

    case GET_INFLUENCER_PUBLICATION_DATA:
      return {
        ...state,
        loadingPublicationData: true,
        errorPublicationData: null,
      };
    case GET_INFLUENCER_PUBLICATION_DATA_SUCCESS:
      return {
        ...state,
        influencerPublicationData: action.payload.data,
        totalRecords : action.payload.totalRecords,
        loadingPublicationData: false,
      };
    case GET_INFLUENCER_PUBLICATION_DATA_FAIL:
      return {
        ...state,
        errorPublicationData: action.payload,
        loadingPublicationData: false,
      };

    case GET_INFLUENCER_MEDIA_DATA:
      return { ...state, loadingMediaData: true, errorMediaData: null };
    case GET_INFLUENCER_MEDIA_DATA_SUCCESS:
      return {
        ...state,
        influencerMediaData: action.payload,
        loadingMediaData: false,
      };
    case GET_INFLUENCER_MEDIA_DATA_FAIL:
      return {
        ...state,
        errorMediaData: action.payload,
        loadingMediaData: false,
      };

    default:
      return state;
  }
};

export default Influencer;
