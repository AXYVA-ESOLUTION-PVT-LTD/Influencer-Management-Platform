import { post, put } from "../../helpers/api_helper";
import { CREATE_BRAND_API, GET_BRAND_API, UPDATE_BRAND_API } from "./routes";

export const createBrandUrl = (token, data) => {
  return post(
    CREATE_BRAND_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getBrandUrl = (token, data) => {
  return post(
    GET_BRAND_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateBrandUrl = (token, data) => {
  const { id, ...payload } = data;
  return put(
    `${UPDATE_BRAND_API}/${id}`,
    { ...payload },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
