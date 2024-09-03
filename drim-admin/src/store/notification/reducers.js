import {
  CREATE_NOTIFICATION,
  CREATE_NOTIFICATION_FAIL,
  CREATE_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION,
  GET_NOTIFICATION_FAIL,
  GET_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION,
  UPDATE_NOTIFICATION_FAIL,
  UPDATE_NOTIFICATION_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  notifications: [],
  loading: false,
  error: {},
};

const notification = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [...action.payload.notifications],
        loading: false,
        error: null,
      };
    case GET_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_NOTIFICATION:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [ action.payload.notification,...state.notifications],
        loading: false,
        error: null,
      };
    case CREATE_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_NOTIFICATION:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [state.notifications, ...action.payload.notification],
        loading: false,
        error: null,
      };
    case UPDATE_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default notification;
