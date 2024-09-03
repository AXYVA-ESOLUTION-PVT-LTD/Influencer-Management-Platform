import { post } from "../../helpers/api_helper";
import { GET_NOTIFICATION_API } from "./routes";

export const getNotificationUrl = (token, data) => {
  return post(
    GET_NOTIFICATION_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
