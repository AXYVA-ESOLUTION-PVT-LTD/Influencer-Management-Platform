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

const INIT_STATE = {
  notifications: [],
  notificationsData: [],
  notificationsDataCount: null,
  totalNotifications: null,
  loading: false,
  error: {},
};

const Notification = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TICKET_NOTIFICATION:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_TICKET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [...action.payload.notifications],
        totalNotifications: action.payload.totalTicketNotifications,
        loading: false,
        error: null,
      };
    case GET_TICKET_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_TICKET_NOTIFICATION:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_TICKET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [action.payload.notification, ...state.notifications],
        loading: false,
        error: null,
      };
    case CREATE_TICKET_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_TICKET_NOTIFICATION:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_TICKET_NOTIFICATION_SUCCESS:
      const { _id: updatedNotificationId } = action.payload.notification;
      return {
        ...state,
        notifications: state.notifications.map((ntf) =>
          ntf._id === updatedNotificationId ? action.payload.notification : ntf
        ),
        loading: false,
        error: null,
      };
    case UPDATE_TICKET_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_UNREAD_NOTIFICATIONS:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_UNREAD_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notificationsData: [...action.payload.data],
        notificationsDataCount: action.payload.count,
        loading: false,
        error: null,
      };
    case FETCH_UNREAD_NOTIFICATIONS_FAIL:
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
        notificationsData: [
          action.payload.notification,
          ...state.notificationsData,
        ],
        loading: false,
        error: null,
      };
    case CREATE_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case MARK_NOTIFICATION_AS_READ:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case MARK_NOTIFICATION_AS_READ_SUCCESS:
      return {
        ...state,
        notificationsData: state.notificationsData.filter(
          (notification) => notification.id !== action.payload.notificationId
        ),
        notificationsDataCount: state.notificationsDataCount - 1,
        loading: false,
        error: null,
      };
    case MARK_NOTIFICATION_AS_READ_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default Notification;
