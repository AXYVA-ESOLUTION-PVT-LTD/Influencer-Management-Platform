import { del, post, postForm, put ,get} from "../../helpers/api_helper";
import {
  CREATE_PUBLICATION_URL,
  DELETE_PUBLICATION_URL,
  GET_PUBLICATION_URL,
  UPDATE_PUBLICATION_STATUS_URL,
  UPDATE_PUBLICATION_URL,
} from "./routes";

export const readPublicationUrl = (token, params) => {
  return post(
    GET_PUBLICATION_URL,
    params ,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const createPublicationUrl = (token, data, isFormData) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" }),
  };

  return postForm(CREATE_PUBLICATION_URL, data, { headers });
};

export const updatePublicationUrl = (id, data, token) => {
  return postForm(
    `${UPDATE_PUBLICATION_URL}/${id}`,
    data ,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deletePublicationUrl = (token, id) => {
  return get(`${DELETE_PUBLICATION_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updatePublicationStatusUrl = (id, data, token) => {
  return post(
    `${UPDATE_PUBLICATION_STATUS_URL}/${id}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

