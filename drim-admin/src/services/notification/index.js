import { post, put } from "../../helpers/api_helper";
import {
  CREATE_NOTIFICATION_API,
  GET_NOTIFICATION_API,
  UPDATE_NOTIFICATION_API,
} from "./routes";

export const getNotificationUrl = (token, data) => {
  return post(
    GET_NOTIFICATION_API,
    { ...data },
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

export const updateNotificationUrl = (token, data) => {
  const { id } = data;
  return put(
    `${UPDATE_NOTIFICATION_API}/${id}`,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
