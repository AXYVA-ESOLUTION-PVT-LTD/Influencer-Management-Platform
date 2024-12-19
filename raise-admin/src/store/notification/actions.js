import {
  CREATE_NOTIFICATION,
  CREATE_NOTIFICATION_FAIL,
  CREATE_NOTIFICATION_SUCCESS,
  CREATE_TICKET_NOTIFICATION,
  CREATE_TICKET_NOTIFICATION_FAIL,
  CREATE_TICKET_NOTIFICATION_SUCCESS,
  FETCH_UNREAD_NOTIFICATIONS,
  FETCH_UNREAD_NOTIFICATIONS_FAIL,
  FETCH_UNREAD_NOTIFICATIONS_SUCCESS,
  GET_TICKET_NOTIFICATION,
  GET_TICKET_NOTIFICATION_FAIL,
  GET_TICKET_NOTIFICATION_SUCCESS,
  MARK_NOTIFICATION_AS_READ,
  MARK_NOTIFICATION_AS_READ_FAIL,
  MARK_NOTIFICATION_AS_READ_SUCCESS,
  UPDATE_TICKET_NOTIFICATION,
  UPDATE_TICKET_NOTIFICATION_FAIL,
  UPDATE_TICKET_NOTIFICATION_SUCCESS,
} from "./actionTypes";

export const getTicketNotification = (payload) => {
  return {
    type: GET_TICKET_NOTIFICATION,
    payload,
  };
};

export const getTicketNotificationSuccess = (payload) => {
  return {
    type: GET_TICKET_NOTIFICATION_SUCCESS,
    payload,
  };
};

export const getTicketNotificationFail = (payload) => {
  return {
    type: GET_TICKET_NOTIFICATION_FAIL,
    payload,
  };
};

export const createTicketNotification = (payload) => {
  return {
    type: CREATE_TICKET_NOTIFICATION,
    payload,
  };
};

export const createTicketNotificationSuccess = (payload) => {
  return {
    type: CREATE_TICKET_NOTIFICATION_SUCCESS,
    payload,
  };
};

export const createTicketNotificationFail = (payload) => {
  return {
    type: CREATE_TICKET_NOTIFICATION_FAIL,
    payload,
  };
};

export const updateTicketNotification = (payload) => {
  return {
    type: UPDATE_TICKET_NOTIFICATION,
    payload,
  };
};

export const updateTicketNotificationSuccess = (payload) => {
  return {
    type: UPDATE_TICKET_NOTIFICATION_SUCCESS,
    payload,
  };
};

export const updateTicketNotificationFail = (payload) => {
  return {
    type: UPDATE_TICKET_NOTIFICATION_FAIL,
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

export const createNotificationFail = (error) => {
  return {
    type: CREATE_NOTIFICATION_FAIL,
    payload: error,
  };
};

export const fetchUnreadNotifications = () => ({
  type: FETCH_UNREAD_NOTIFICATIONS,
});

export const fetchUnreadNotificationsSuccess = (payload) => ({
  type: FETCH_UNREAD_NOTIFICATIONS_SUCCESS,
  payload,
});

export const fetchUnreadNotificationsFail = (error) => ({
  type: FETCH_UNREAD_NOTIFICATIONS_FAIL,
  payload: error,
});

export const markNotificationAsRead = (notificationId) => ({
  type: MARK_NOTIFICATION_AS_READ,
  payload: notificationId,
});

export const markNotificationAsReadSuccess = (payload) => ({
  type: MARK_NOTIFICATION_AS_READ_SUCCESS,
  payload,
});

export const markNotificationAsReadFail = (error) => ({
  type: MARK_NOTIFICATION_AS_READ_FAIL,
  payload: error,
});
