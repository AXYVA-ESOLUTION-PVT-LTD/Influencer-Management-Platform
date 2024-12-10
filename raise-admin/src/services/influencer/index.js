import { post, put } from "../../helpers/api_helper";
import {
  CREATE_INFLUENCER_API,
  GET_INFLUENCER_API,
  UPDATE_INFLUENCER_API,
} from "./routes";

export const createInfluencersUrl = (token, data) => {
  return post(
    CREATE_INFLUENCER_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const getInfluencersUrl = (token, data) => {
  return post(
    GET_INFLUENCER_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const updateInfluencerUrl = (token, data) => {
  const { id, ...payload } = data;
  return put(
    `${UPDATE_INFLUENCER_API}/${id}`,
    { ...payload },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
