import {
  ADD_BRAND,
  ADD_BRAND_FAIL,
  ADD_BRAND_SUCCESS,
  GET_BRAND,
  GET_BRAND_FAIL,
  GET_BRAND_SUCCESS,
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
