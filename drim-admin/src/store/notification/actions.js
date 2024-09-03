import {
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
