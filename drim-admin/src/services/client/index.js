import { post } from "../../helpers/api_helper";
import { CREATE_CLIENT_API } from "./routes";

export const createClientUrl = (token, data) => {
  return post(
    CREATE_CLIENT_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
