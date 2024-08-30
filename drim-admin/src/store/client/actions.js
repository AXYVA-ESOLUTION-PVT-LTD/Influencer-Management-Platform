import {
  ADD_CLIENT,
  ADD_CLIENT_FAIL,
  ADD_CLIENT_SUCCESS,
  GET_CLIENT,
  GET_CLIENT_FAIL,
  GET_CLIENT_SUCCESS,
  UPDATE_CLIENT,
  UPDATE_CLIENT_FAIL,
  UPDATE_CLIENT_SUCCESS,
} from "./actionTypes";

// Fetch all Client
export const getClient = (payload) => ({
  type: GET_CLIENT,
  payload,
});

export const getClientSuccess = (influencers) => ({
  type: GET_CLIENT_SUCCESS,
  payload: influencers,
});

export const getClientFail = (error) => ({
  type: GET_CLIENT_FAIL,
  payload: error,
});

// Add a new influencer
export const addNewClient = (client) => {
  return {
    type: ADD_CLIENT,
    payload: client,
  };
};

export const addClientSuccess = (client) => {
  return {
    type: ADD_CLIENT_SUCCESS,
    payload: client,
  };
};

export const addClientFail = (error) => ({
  type: ADD_CLIENT_FAIL,
  payload: error,
});

// Update an influencer
export const updateClient = (payload) => ({
  type: UPDATE_CLIENT,
  payload: payload,
});

export const updateClientSuccess = (payload) => ({
  type: UPDATE_CLIENT_SUCCESS,
  payload: payload,
});

export const updateClientFail = (error) => ({
  type: UPDATE_CLIENT_FAIL,
  payload: error,
});
