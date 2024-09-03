import {
  CREATE_NOTIFICATION,
  CREATE_NOTIFICATION_FAIL,
  CREATE_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION,
  GET_NOTIFICATION_FAIL,
  GET_NOTIFICATION_SUCCESS,
} from "./actionTypes";

export const getNotification = (payload) => {
  return {
    type: GET_NOTIFICATION,
    payload,
  };
};

export const getNotificationSuccess = (payload) => {
  return {
    type: GET_NOTIFICATION_SUCCESS,
    payload,
  };
};

export const getNotificationFail = (payload) => {
  return {
    type: GET_NOTIFICATION_FAIL,
    payload,
  };
};

export const createNotification = (payload) => {
  return {
    type: CREATE_NOTIFICATION,
    payload,
  };
};

export const createNotificationSuccess = (payload) => {
  return {
    type: CREATE_NOTIFICATION_SUCCESS,
    payload,
  };
};

export const createNotificationFail = (payload) => {
  return {
    type: CREATE_NOTIFICATION_FAIL,
    payload,
  };
};
