import { post } from "../../helpers/api_helper";
import { CREATE_INFLUENCER_API } from "./routes";

export const createInfluencersUrl = (token, data) => {
  return post(
    CREATE_INFLUENCER_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
