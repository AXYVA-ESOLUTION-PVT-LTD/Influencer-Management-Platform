
import { post, put , get, patch} from "../../helpers/api_helper";
import {
  CREATE_NOTIFICATION_API,
  CREATE_TICKET_NOTIFICATION_API,
  FETCH_UNREAD_NOTIFICATIONS_API,
  GET_TICKET_NOTIFICATION_API,
  MARK_NOTIFICATION_AS_READ_API,
  UPDATE_TICKET_NOTIFICATION_API,
} from "./routes";

export const getTicketNotificationUrl = (token, data) => {
  return post(
    GET_TICKET_NOTIFICATION_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const createTicketNotificationUrl = (token, data) => {
  return post(
    CREATE_TICKET_NOTIFICATION_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateTicketNotificationUrl = (token, data) => {
  const { id,status } = data;

  return put(
    `${UPDATE_TICKET_NOTIFICATION_API}/${id}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const createNotificationUrl = (token, data) => {
  return post(
    CREATE_NOTIFICATION_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const markNotificationAsReadUrl = (token, notificationId) => {
  return patch(
    `${MARK_NOTIFICATION_AS_READ_API}/${notificationId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const fetchUnreadNotificationsUrl = (token) => {
  return get(
    FETCH_UNREAD_NOTIFICATIONS_API,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};