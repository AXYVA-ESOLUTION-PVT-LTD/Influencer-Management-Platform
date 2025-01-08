import { CREATE_PUBLICATION_ERROR, CREATE_PUBLICATION_REQUEST, CREATE_PUBLICATION_SUCCESS, DELETE_PUBLICATION_ERROR, DELETE_PUBLICATION_REQUEST, DELETE_PUBLICATION_SUCCESS, GET_PUBLICATION_ERROR, GET_PUBLICATION_REQUEST, GET_PUBLICATION_SUCCESS, UPDATE_PUBLICATION_ERROR, UPDATE_PUBLICATION_REQUEST, UPDATE_PUBLICATION_STATUS_ERROR, UPDATE_PUBLICATION_STATUS_REQUEST, UPDATE_PUBLICATION_STATUS_SUCCESS, UPDATE_PUBLICATION_SUCCESS } from "./actionTypes";

export const getPublication = (params) => ({
  type: GET_PUBLICATION_REQUEST,
  payload: params,
});

export const getPublicationSuccess = (data) => ({
  type: GET_PUBLICATION_SUCCESS,
  payload: data,
});

export const getPublicationError = (error) => ({
  type: GET_PUBLICATION_ERROR,
  payload: error,
});

export const createPublication = (payload) => ({
  type: CREATE_PUBLICATION_REQUEST,
  payload,
});

export const createPublicationSuccess = (data) => ({
  type: CREATE_PUBLICATION_SUCCESS,
  payload: data,
});

export const createPublicationError = (error) => ({
  type: CREATE_PUBLICATION_ERROR,
  payload: error,
});

export const updatePublication = (payload) => ({
  type: UPDATE_PUBLICATION_REQUEST,
  payload,
});

export const updatePublicationSuccess = (data) => ({
  type: UPDATE_PUBLICATION_SUCCESS,
  payload: data,
});

export const updatePublicationError = (error) => ({
  type: UPDATE_PUBLICATION_ERROR,
  payload: error,
});

export const updatePublicationStatus = (payload) => ({
  type: UPDATE_PUBLICATION_STATUS_REQUEST,
  payload,
});

export const updatePublicationStatusSuccess = (data) => ({
  type: UPDATE_PUBLICATION_STATUS_SUCCESS,
  payload: data,
});

export const updatePublicationStatusError = (error) => ({
  type: UPDATE_PUBLICATION_STATUS_ERROR,
  payload: error,
});

export const deletePublication = (payload) => ({
  type: DELETE_PUBLICATION_REQUEST,
  payload,
});

export const deletePublicationSuccess = (data) => ({
  type: DELETE_PUBLICATION_SUCCESS,
  payload: data,
});

export const deletePublicationError = (error) => ({
  type: DELETE_PUBLICATION_ERROR,
  payload: error,
});

