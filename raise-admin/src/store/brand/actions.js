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

// Fetch all Brands
export const getBrand = (payload) => ({
  type: GET_BRAND,
  payload,
});

export const getBrandSuccess = (influencers) => ({
  type: GET_BRAND_SUCCESS,
  payload: influencers,
});

export const getBrandFail = (error) => ({
  type: GET_BRAND_FAIL,
  payload: error,
});

// Fetch all Brand Lists
export const getBrandList = (payload) => ({
  type: GET_BRAND_LIST,
  payload,
});

export const getBrandListSuccess = (brandLists) => ({
  type: GET_BRAND_LIST_SUCCESS,
  payload: brandLists,
});

export const getBrandListFail = (error) => ({
  type: GET_BRAND_LIST_FAIL,
  payload: error,
});

// Add a new Brand
export const addNewBrand = (brand) => {
  return {
    type: ADD_BRAND,
    payload: brand,
  };
};

export const addBrandSuccess = (brand) => {
  return {
    type: ADD_BRAND_SUCCESS,
    payload: brand,
  };
};

export const addBrandFail = (error) => ({
  type: ADD_BRAND_FAIL,
  payload: error,
});

// Update an influencer
export const updateBrand = (payload) => ({
  type: UPDATE_BRAND,
  payload: payload,
});

export const updateBrandSuccess = (payload) => ({
  type: UPDATE_BRAND_SUCCESS,
  payload: payload,
});

export const updateBrandFail = (error) => ({
  type: UPDATE_BRAND_FAIL,
  payload: error,
});

export const getBrandStatistics = (payload) => ({
  type: GET_BRAND_STATISTICS,
  payload,
});

export const getBrandStatisticsSuccess = (data) => ({
  type: GET_BRAND_STATISTICS_SUCCESS,
  payload: data,
});

export const getBrandStatisticsFail = (error) => ({
  type: GET_BRAND_STATISTICS_FAIL,
  payload: error,
});

// Get Opportunity Statistics
export const getOpportunityStatistics = (payload) => ({
  type: GET_OPPORTUNITY_STATISTICS,
  payload,
});

export const getOpportunityStatisticsSuccess = (data) => ({
  type: GET_OPPORTUNITY_STATISTICS_SUCCESS,
  payload: data,
});

export const getOpportunityStatisticsFail = (error) => ({
  type: GET_OPPORTUNITY_STATISTICS_FAIL,
  payload: error,
});

// Get Influencer Statistics
export const getInfluencerStatistics = (payload) => ({
  type: GET_INFLUENCER_STATISTICS,
  payload,
});

export const getInfluencerStatisticsSuccess = (data) => ({
  type: GET_INFLUENCER_STATISTICS_SUCCESS,
  payload: data,
});

export const getInfluencerStatisticsFail = (error) => ({
  type: GET_INFLUENCER_STATISTICS_FAIL,
  payload: error,
});


// Get Influencer Statistics
export const getInfluencerStatisticsByPlatform = (payload) => ({
  type: GET_INFLUENCER_STATISTICS_BY_PLATFORM,
  payload,
});

export const getInfluencerStatisticsByPlatformSuccess = (data) => ({
  type: GET_INFLUENCER_STATISTICS_BY_PLATFORM_SUCCESS,
  payload: data,
});

export const getInfluencerStatisticsByPlatformFail = (error) => ({
  type: GET_INFLUENCER_STATISTICS_BY_PLATFORM_FAIL,
  payload: error,
});

// Get Influencer Statistics by Country
export const getInfluencerStatisticsByCountry = (payload) => ({
  type: GET_INFLUENCER_STATISTICS_BY_COUNTRY,
  payload,
});

export const getInfluencerStatisticsByCountrySuccess = (data) => ({
  type: GET_INFLUENCER_STATISTICS_BY_COUNTRY_SUCCESS,
  payload: data,
});

export const getInfluencerStatisticsByCountryFail = (error) => ({
  type: GET_INFLUENCER_STATISTICS_BY_COUNTRY_FAIL,
  payload: error,
});

// Get Publications by Brand
export const getAllPublicationsByBrand = (payload) => ({
  type: GET_ALL_PUBLICATIONS_BY_BRAND,
  payload,
});

export const getAllPublicationsByBrandSuccess = (data) => ({
  type: GET_ALL_PUBLICATIONS_BY_BRAND_SUCCESS,
  payload: data,
});

export const getAllPublicationsByBrandFail = (error) => ({
  type: GET_ALL_PUBLICATIONS_BY_BRAND_FAIL,
  payload: error,
});
