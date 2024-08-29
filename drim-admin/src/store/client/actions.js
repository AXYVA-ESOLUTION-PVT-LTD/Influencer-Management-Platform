import { ADD_CLIENT, ADD_CLIENT_FAIL, ADD_CLIENT_SUCCESS } from "./actionTypes";

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
