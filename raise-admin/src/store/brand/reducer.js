import {
  ADD_BRAND,
  ADD_BRAND_FAIL,
  ADD_BRAND_SUCCESS,
  GET_ALL_PUBLICATIONS_BY_BRAND,
  GET_ALL_PUBLICATIONS_BY_BRAND_FAIL,
  GET_ALL_PUBLICATIONS_BY_BRAND_SUCCESS,
  GET_BRAND,
  GET_BRAND_FAIL,
  GET_BRAND_LIST,
  GET_BRAND_LIST_FAIL,
  GET_BRAND_LIST_SUCCESS,
  GET_BRAND_STATISTICS,
  GET_BRAND_STATISTICS_FAIL,
  GET_BRAND_STATISTICS_SUCCESS,
  GET_BRAND_SUCCESS,
  GET_INFLUENCER_STATISTICS,
  GET_INFLUENCER_STATISTICS_BY_COUNTRY,
  GET_INFLUENCER_STATISTICS_BY_COUNTRY_FAIL,
  GET_INFLUENCER_STATISTICS_BY_COUNTRY_SUCCESS,
  GET_INFLUENCER_STATISTICS_BY_PLATFORM,
  GET_INFLUENCER_STATISTICS_BY_PLATFORM_FAIL,
  GET_INFLUENCER_STATISTICS_BY_PLATFORM_SUCCESS,
  GET_INFLUENCER_STATISTICS_FAIL,
  GET_INFLUENCER_STATISTICS_SUCCESS,
  GET_OPPORTUNITY_STATISTICS,
  GET_OPPORTUNITY_STATISTICS_FAIL,
  GET_OPPORTUNITY_STATISTICS_SUCCESS,
  UPDATE_BRAND,
  UPDATE_BRAND_FAIL,
  UPDATE_BRAND_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  brands: [],
  totalBrands: null,
  brandLists :[],
  totalBrandLists :null,
  loading: false,
  brandStatisticsLoading: false,
  opportunityStatisticsLoading: false,
  influencerStatisticsLoading: false,
  publicationsLoading: false,
  brandStatistics: null,
  opportunityStatistics: null,
  influencerStatistics: null,
  totalPublications: null,
  publications: null,
  influencerStatisticsByPlatform: null,
  influencerStatisticsByPlatformLoading: false,
  influencerStatisticsByCountry: null,
  influencerStatisticsByCountryLoading: false,
  brandListLoading: false,
  addBrandLoading: false,
  updateBrandLoading: false,
  error: {},
};

const Brand = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BRAND:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_BRAND_SUCCESS:
      return {
        ...state,
        brands: [...action.payload.brands],
        totalBrands: action.payload.totalBrands,
        loading: false,
        error: null,
      };
    case GET_BRAND_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_BRAND_LIST:
      return {
        ...state,
        brandListLoading: true,
        error: null,
      };
    case GET_BRAND_LIST_SUCCESS:
      return {
        ...state,
        brandLists: [...action.payload.brands],
        totalBrandLists: action.payload.totalBrands,
        brandListLoading: false,
        error: null,
      };
    case GET_BRAND_LIST_FAIL:
      return {
        ...state,
        brandListLoading: false,
        error: action.payload,
      };

    case ADD_BRAND:
      return {
        ...state,
        addBrandLoading: true,
        error: null,
      };
    case ADD_BRAND_SUCCESS:
      return {
        ...state,
        addBrandLoading: false,
      };
    case ADD_BRAND_FAIL:
      return {
        ...state,
        addBrandLoading: false,
        error: action.payload,
      };

    case UPDATE_BRAND:
      return {
        ...state,
        updateBrandLoading: true,
        error: null,
      };
    case UPDATE_BRAND_SUCCESS:
      return {
        ...state,
        updateBrandLoading: false,
      };
    case UPDATE_BRAND_FAIL:
      return {
        ...state,
        updateBrandLoading: false,
        error: action.payload,
      };
    case GET_BRAND_STATISTICS:
      return {
        ...state,
        brandStatisticsLoading: true,
        error: null,
      };
    case GET_BRAND_STATISTICS_SUCCESS:
      return {
        ...state,
        brandStatistics: action.payload,
        brandStatisticsLoading: false,
        error: null,
      };
    case GET_BRAND_STATISTICS_FAIL:
      return {
        ...state,
        brandStatisticsLoading: false,
        error: action.payload,
      };

    case GET_OPPORTUNITY_STATISTICS:
      return {
        ...state,
        opportunityStatisticsLoading: true,
        error: null,
      };
    case GET_OPPORTUNITY_STATISTICS_SUCCESS:
      return {
        ...state,
        opportunityStatistics: action.payload,
        opportunityStatisticsLoading: false,
        error: null,
      };
    case GET_OPPORTUNITY_STATISTICS_FAIL:
      return {
        ...state,
        opportunityStatisticsLoading: false,
        error: action.payload,
      };

    case GET_INFLUENCER_STATISTICS:
      return {
        ...state,
        influencerStatisticsLoading: true,
        error: null,
      };
    case GET_INFLUENCER_STATISTICS_SUCCESS:
      return {
        ...state,
        influencerStatistics: action.payload,
        influencerStatisticsLoading: false,
        error: null,
      };
    case GET_INFLUENCER_STATISTICS_FAIL:
      return {
        ...state,
        influencerStatisticsLoading: false,
        error: action.payload,
      };
    case GET_INFLUENCER_STATISTICS_BY_PLATFORM:
      return {
        ...state,
        influencerStatisticsByPlatformLoading: true,
        error: null,
      };
    case GET_INFLUENCER_STATISTICS_BY_PLATFORM_SUCCESS:
      return {
        ...state,
        influencerStatisticsByPlatform: action.payload,
        influencerStatisticsByPlatformLoading: false,
        error: null,
      };
    case GET_INFLUENCER_STATISTICS_BY_PLATFORM_FAIL:
      return {
        ...state,
        influencerStatisticsByPlatformLoading: false,
        error: action.payload,
      };

    case GET_INFLUENCER_STATISTICS_BY_COUNTRY:
      return {
        ...state,
        influencerStatisticsByCountryLoading: true,
        error: null,
      };
    case GET_INFLUENCER_STATISTICS_BY_COUNTRY_SUCCESS:
      return {
        ...state,
        influencerStatisticsByCountry: action.payload,
        influencerStatisticsByCountryLoading: false,
        error: null,
      };
    case GET_INFLUENCER_STATISTICS_BY_COUNTRY_FAIL:
      return {
        ...state,
        influencerStatisticsByCountryLoading: false,
        error: action.payload,
      };
    case GET_ALL_PUBLICATIONS_BY_BRAND:
      return {
        ...state,
        publicationsLoading: true,
        error: null,
      };
    case GET_ALL_PUBLICATIONS_BY_BRAND_SUCCESS:
      return {
        ...state,
        publications: action.payload.publications,
        totalPublications: action.payload.totalPublications,
        publicationsLoading: false,
        error: null,
      };
    case GET_ALL_PUBLICATIONS_BY_BRAND_FAIL:
      return {
        ...state,
        publicationsLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default Brand;
