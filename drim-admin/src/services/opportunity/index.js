import { del, post, put } from "../../helpers/api_helper";
import {
  CREATE_OPPORTUNITY_URL,
  DELETE_OPPORTUNITY_URL,
  GET_OPPORTUNITY_URL,
} from "./routes";

//fetch all opportunity
export const readOpportunityUrl = (token, params) => {
  return post(
    GET_OPPORTUNITY_URL,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Create Opportunity
export const createOpportunityUrl = (token, data) => {
  return post(
    CREATE_OPPORTUNITY_URL,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Delete Opportunity
export const deleteOpportunityUrl = (token, data) => {
  return del(`${DELETE_OPPORTUNITY_URL}/${data}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update Opportunity
export const updateOpportunityUrl = (id, data, token) => {
  return put(
    `${DELETE_OPPORTUNITY_URL}/${id}`,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
