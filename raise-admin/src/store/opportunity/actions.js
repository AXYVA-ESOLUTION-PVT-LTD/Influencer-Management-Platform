import {
  CREATE_OPPORTUNITY_ERROR,
  CREATE_OPPORTUNITY_REQUEST,
  CREATE_OPPORTUNITY_SUCCESS,
  CREATE_TICKET_ERROR,
  CREATE_TICKET_REQUEST,
  CREATE_TICKET_SUCCESS,
  DELETE_OPPORTUNITY_ERROR,
  DELETE_OPPORTUNITY_REQUEST,
  DELETE_OPPORTUNITY_SUCCESS,
  DELETE_TICKET_ERROR,
  DELETE_TICKET_REQUEST,
  DELETE_TICKET_SUCCESS,
  FETCH_TICKETS_ERROR,
  FETCH_TICKETS_REQUEST,
  FETCH_TICKETS_SUCCESS,
  GET_OPPORTUNITY_ERROR,
  GET_OPPORTUNITY_REQUEST,
  GET_OPPORTUNITY_SUCCESS,
  REMOVE_OPPORTUNITY_IMAGE_ERROR,
  REMOVE_OPPORTUNITY_IMAGE_REQUEST,
  REMOVE_OPPORTUNITY_IMAGE_SUCCESS,
  TRACK_OPPORTUNITY_VIEW_ERROR,
  TRACK_OPPORTUNITY_VIEW_REQUEST,
  TRACK_OPPORTUNITY_VIEW_SUCCESS,
  UPDATE_OPPORTUNITY_ERROR,
  UPDATE_OPPORTUNITY_REQUEST,
  UPDATE_OPPORTUNITY_SUCCESS,
  UPDATE_TICKET_ERROR,
  UPDATE_TICKET_REQUEST,
  UPDATE_TICKET_SUCCESS,
  UPLOAD_CSV_ERROR,
  UPLOAD_CSV_REQUEST,
  UPLOAD_CSV_SUCCESS,
  UPLOAD_OPPORTUNITY_IMAGE_ERROR,
  UPLOAD_OPPORTUNITY_IMAGE_REQUEST,
  UPLOAD_OPPORTUNITY_IMAGE_SUCCESS,
} from "./actionTypes";

// Fetch opportunity
export const getOpportunity = (params) => {
  return {
    type: GET_OPPORTUNITY_REQUEST,
    payload: params,
  };
};

export const getOpportunitySuccess = (data) => {
  return {
    type: GET_OPPORTUNITY_SUCCESS,
    payload: data,
  };
};

export const getOpportunityError = (error) => {
  return {
    type: GET_OPPORTUNITY_ERROR,
    payload: error,
  };
};

//Create Opportunity
export const createOpportunity = (payload) => {
  return {
    type: CREATE_OPPORTUNITY_REQUEST,
    payload: payload,
  };
};
export const createOpportunitySuccess = (data) => {
  return {
    type: CREATE_OPPORTUNITY_SUCCESS,
    payload: data,
  };
};
export const createOpportunityError = (error) => {
  return {
    type: CREATE_OPPORTUNITY_ERROR,
    payload: error,
  };
};

// Delete Opportunity
export const deleteOpportunity = (payload) => {
  return {
    type: DELETE_OPPORTUNITY_REQUEST,
    payload: payload,
  };
};

export const deleteOpportunitySuccess = (data) => {
  return {
    type: DELETE_OPPORTUNITY_SUCCESS,
    payload: data,
  };
};

export const deleteOpportunityError = (error) => {
  return {
    type: DELETE_OPPORTUNITY_ERROR,
    payload: error,
  };
};

// Update Opportunity
export const updateOpportunity = (payload) => {
  return {
    type: UPDATE_OPPORTUNITY_REQUEST,
    payload: payload,
  };
};

export const updateOpportunitySuccess = (data) => {
  return {
    type: UPDATE_OPPORTUNITY_SUCCESS,
    payload: data,
  };
};

export const updateOpportunityError = (error) => {
  return {
    type: UPDATE_OPPORTUNITY_ERROR,
    payload: error,
  };
};

// Upload Opportunity Image
export const uploadOpportunityImage = (payload) => ({
  type: UPLOAD_OPPORTUNITY_IMAGE_REQUEST,
  payload,
});

export const uploadOpportunityImageSuccess = (data) => ({
  type: UPLOAD_OPPORTUNITY_IMAGE_SUCCESS,
  payload: data,
});

export const uploadOpportunityImageError = (error) => ({
  type: UPLOAD_OPPORTUNITY_IMAGE_ERROR,
  payload: error,
});

// Remove Opportunity Image
export const removeOpportunityImage = (payload) => ({
  type: REMOVE_OPPORTUNITY_IMAGE_REQUEST,
  payload,
});

export const removeOpportunityImageSuccess = (data) => ({
  type: REMOVE_OPPORTUNITY_IMAGE_SUCCESS,
  payload: data,
});

export const removeOpportunityImageError = (error) => ({
  type: REMOVE_OPPORTUNITY_IMAGE_ERROR,
  payload: error,
});

// Fetch Tickets
export const fetchTicketsRequest = (payload) => ({
  type: FETCH_TICKETS_REQUEST,
  payload,
});

export const fetchTicketsSuccess = (data) => ({
  type: FETCH_TICKETS_SUCCESS,
  payload: data,
});

export const fetchTicketsError = (error) => ({
  type: FETCH_TICKETS_ERROR,
  payload: error,
});

// Create Ticket
export const createTicketRequest = (payload) => ({
  type: CREATE_TICKET_REQUEST,
  payload,
});

export const createTicketSuccess = (data) => ({
  type: CREATE_TICKET_SUCCESS,
  payload: data,
});

export const createTicketError = (error) => ({
  type: CREATE_TICKET_ERROR,
  payload: error,
});

export const updateTicketRequest = (payload) => ({
  type: UPDATE_TICKET_REQUEST,
  payload,
});

export const updateTicketSuccess = (data) => ({
  type: UPDATE_TICKET_SUCCESS,
  payload: data,
});

export const updateTicketError = (error) => ({
  type: UPDATE_TICKET_ERROR,
  payload: error,
});

export const deleteTicketRequest = (payload) => ({
  type: DELETE_TICKET_REQUEST,
  payload,
});

export const deleteTicketSuccess = (data) => ({
  type: DELETE_TICKET_SUCCESS,
  payload: data,
});

export const deleteTicketError = (error) => ({
  type: DELETE_TICKET_ERROR,
  payload: error,
});

// CSV Upload
export const uploadCsvRequest = (payload) => {
  return {
    type: UPLOAD_CSV_REQUEST,
    payload: payload,
  };
};

export const uploadCsvSuccess = (data) => {
  return {
    type: UPLOAD_CSV_SUCCESS,
    payload: data,
  };
};

export const uploadCsvError = (error) => {
  return {
    type: UPLOAD_CSV_ERROR,
    payload: error,
  };
};

export const trackOpportunityViewRequest = (opportunityId) => ({
  type: TRACK_OPPORTUNITY_VIEW_REQUEST,
  payload: opportunityId,
});

export const trackOpportunityViewSuccess = (data) => ({
  type: TRACK_OPPORTUNITY_VIEW_SUCCESS,
  payload: data,
});

export const trackOpportunityViewError = (error) => ({
  type: TRACK_OPPORTUNITY_VIEW_ERROR,
  payload: error,
});
