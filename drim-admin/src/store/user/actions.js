import {
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from "./actionTypes";

// Update Opportunity
export const updateProfile = (payload) => {
  return {
    type: UPDATE_PROFILE_REQUEST,
    payload: payload,
  };
};
export const updateProfileSuccess = (data) => {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: data,
  };
};
export const updateProfileError = (error) => {
  return {
    type: UPDATE_PROFILE_ERROR,
    payload: error,
  };
};
