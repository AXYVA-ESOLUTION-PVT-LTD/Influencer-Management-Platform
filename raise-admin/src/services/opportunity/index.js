import { del, formpost, post, postForm, put } from "../../helpers/api_helper";
import {
  CREATE_OPPORTUNITY_URL,
  CREATE_TICKET,
  DELETE_OPPORTUNITY_URL,
  DELETE_TICKET,
  GET_OPPORTUNITY_URL,
  GET_TICKET,
  REMOVE_OPPORTUNITY_IMAGE_URL,
  TRACK_OPPORTUNITY_VIEW_URL,
  UPDATE_TICKET,
  UPLOAD_CSV_URL,
  UPLOAD_OPPORTUNITY_IMAGE_URL,
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

export const uploadOpportunityImageUrl = (token, formData) => {
  return postForm(
    UPLOAD_OPPORTUNITY_IMAGE_URL,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Remove Opportunity Image
export const removeOpportunityImageUrl = (token, payload) => {
  return post(
    REMOVE_OPPORTUNITY_IMAGE_URL,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const fetchTicketsUrl = (data,token) => {
  return post(
    GET_TICKET,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Create Ticket
export const createTicketUrl = ( data,token) => {
  return post(
    CREATE_TICKET,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateTicketUrl = (data, token) => {
  return put(
    `${UPDATE_TICKET}/${data.id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteTicketUrl = async (ticketId, token) => {
  return del(`${DELETE_TICKET}/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const uploadCsvUrl = (formData, token) => {  
  return formpost(UPLOAD_CSV_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const trackOpportunityViewApi = (opportunityId, token) => {
  return post(
    `${TRACK_OPPORTUNITY_VIEW_URL}/${opportunityId}`,
    {}, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};