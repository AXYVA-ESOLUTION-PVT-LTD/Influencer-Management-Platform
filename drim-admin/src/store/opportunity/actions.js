import {
  CREATE_OPPORTUNITY_ERROR,
  CREATE_OPPORTUNITY_REQUEST,
  CREATE_OPPORTUNITY_SUCCESS,
  DELETE_OPPORTUNITY_ERROR,
  DELETE_OPPORTUNITY_REQUEST,
  DELETE_OPPORTUNITY_SUCCESS,
  GET_OPPORTUNITY_ERROR,
  GET_OPPORTUNITY_REQUEST,
  GET_OPPORTUNITY_SUCCESS,
  UPDATE_OPPORTUNITY_ERROR,
  UPDATE_OPPORTUNITY_REQUEST,
  UPDATE_OPPORTUNITY_SUCCESS,
} from "./actionTypes";

// Fetch opportunity
export const getOpportunity = (params) => {
  return {
    type: GET_OPPORTUNITY_REQUEST,
    payload: params,
  };
};

export const getOpportunitySuccess = (data) => {
  return {
    type: GET_OPPORTUNITY_SUCCESS,
    payload: data,
  };
};

export const getOpportunityError = (error) => {
  return {
    type: GET_OPPORTUNITY_ERROR,
    payload: error,
  };
};

//Create Opportunity
export const createOpportunity = (payload) => {
  return {
    type: CREATE_OPPORTUNITY_REQUEST,
    payload: payload,
  };
};
export const createOpportunitySuccess = (data) => {
  return {
    type: CREATE_OPPORTUNITY_SUCCESS,
    payload: data,
  };
};
export const createOpportunityError = (error) => {
  return {
    type: CREATE_OPPORTUNITY_ERROR,
    payload: error,
  };
};

// Delete Opportunity
export const deleteOpportunity = (payload) => {
  return {
    type: DELETE_OPPORTUNITY_REQUEST,
    payload: payload,
  };
};

export const deleteOpportunitySuccess = (data) => {
  return {
    type: DELETE_OPPORTUNITY_SUCCESS,
    payload: data,
  };
};

export const deleteOpportunityError = (error) => {
  return {
    type: DELETE_OPPORTUNITY_ERROR,
    payload: error,
  };
};

// Update Opportunity
export const updateOpportunity = (payload) => {
  return {
    type: UPDATE_OPPORTUNITY_REQUEST,
    payload: payload,
  };
};
export const updateOpportunitySuccess = (data) => {
  return {
    type: UPDATE_OPPORTUNITY_SUCCESS,
    payload: data,
  };
};
export const updateOpportunityError = (error) => {
  return {
    type: UPDATE_OPPORTUNITY_ERROR,
    payload: error,
  };
};
