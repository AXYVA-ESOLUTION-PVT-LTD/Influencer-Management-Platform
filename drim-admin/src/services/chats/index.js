import { post } from "../../helpers/api_helper";
import { CREATE_CHAT_API, GET_CHAT_API } from "./routes";

export const getChatsUrl = (token, data) => {
  return post(
    GET_CHAT_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const createChatsUrl = (token, data) => {
  return post(
    CREATE_CHAT_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
