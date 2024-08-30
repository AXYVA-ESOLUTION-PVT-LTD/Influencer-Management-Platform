import { post, put } from "../../helpers/api_helper";
import { CREATE_CLIENT_API, GET_CLIENT_API, UPDATE_CLIENT_API } from "./routes";

export const createClientUrl = (token, data) => {
  return post(
    CREATE_CLIENT_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const getClientUrl = (token, data) => {
  return post(
    GET_CLIENT_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const updateClientUrl = (token, data) => {
  const { id, ...payload } = data;
  return put(
    `${UPDATE_CLIENT_API}/${id}`,
    { ...payload },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
