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

const initialState = {
  opportunities: [],
  opportunitiesData: [],
  csvUploadResult: [],
  totalOpportunities: null,
  ticketId: null,
  totalRecords: null,
  currentPage: null,
  loading: false,
  trackingOpportunityViewLoading: false,
  error: null,
  trackingOpportunityViewError  : null
};

const Opportunity = (state = initialState, action) => {
  switch (action.type) {
    // GET
    case GET_OPPORTUNITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_OPPORTUNITY_SUCCESS:
      return {
        ...state,
        loading: false,
        opportunities: action.payload.opportunities,
        totalOpportunities: action.payload.totalOpportunities,
        currentPage: action.payload.currentPage,
        error: null,
      };
    case GET_OPPORTUNITY_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    //CREATE
    case CREATE_OPPORTUNITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_OPPORTUNITY_SUCCESS:
      return {
        ...state,
        loading: false,
        opportunities: [...state.opportunities, action.payload.opportunity],
        totalOpportunities: state.totalOpportunities + 1,
        error: null,
      };
    case CREATE_OPPORTUNITY_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    //DELETE
    case DELETE_OPPORTUNITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_OPPORTUNITY_SUCCESS:
      const deletedId = action.payload.id;
      return {
        ...state,
        loading: false,
        opportunities: state.opportunities.filter(
          (opportunity) => opportunity._id !== deletedId
        ),
        totalOpportunities: state.totalOpportunities - 1,
        error: null,
      };
    case DELETE_OPPORTUNITY_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    //DELETE
    case UPDATE_OPPORTUNITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_OPPORTUNITY_SUCCESS:
      const { opportunity } = action.payload;
      return {
        ...state,
        loading: false,
        error: null,
        opportunities: state.opportunities.map((opp) =>
          opp._id === opportunity._id ? { ...opp, ...opportunity } : opp
        ),
      };
    case UPDATE_OPPORTUNITY_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    // Reducer Case Updates
    case UPLOAD_OPPORTUNITY_IMAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPLOAD_OPPORTUNITY_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        opportunities: state.opportunities.map((opportunity) =>
          opportunity._id === action.payload.id
            ? { ...opportunity, imageUrl: action.payload.imageUrl }
            : opportunity
        ),
        error: null,
      };
    case UPLOAD_OPPORTUNITY_IMAGE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case REMOVE_OPPORTUNITY_IMAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case REMOVE_OPPORTUNITY_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        opportunities: state.opportunities.map((opportunity) =>
          opportunity._id === action.payload.id
            ? { ...opportunity, imageUrl: "" }
            : opportunity
        ),
        error: null,
      };
    case REMOVE_OPPORTUNITY_IMAGE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_TICKETS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_TICKETS_SUCCESS:
      return {
        ...state,
        loading: false,
        opportunitiesData: action.payload.data || [],
        totalRecords: action.payload.totalRecords,
        error: null,
      };
    case FETCH_TICKETS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_TICKET_REQUEST:
      return {
        ...state,
        loading: true,
        ticketId: null,
        error: null,
      };
    case CREATE_TICKET_SUCCESS:
      return {
        ...state,
        loading: false,
        ticketId: action.payload._id,
        error: null,
      };
    case CREATE_TICKET_ERROR:
      return {
        ...state,
        loading: false,
        ticketId: null,
        error: action.payload,
      };

    case UPDATE_TICKET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      case UPDATE_TICKET_SUCCESS:
        return {
          ...state,
          loading: false,
          opportunitiesData: state.opportunitiesData.map((ticket) =>
            ticket._id === action.payload.data._id ? action.payload.data : ticket
          ),
          error: null,
        };
    case UPDATE_TICKET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_TICKET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      case DELETE_TICKET_SUCCESS:
        return {
          ...state,
          loading: false,
          opportunitiesData: state.opportunitiesData.filter(
            (ticket) => ticket._id !== action.payload.id
          ),
          error: null,
        };
    case DELETE_TICKET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // UPLOAD CSV
    case UPLOAD_CSV_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPLOAD_CSV_SUCCESS:
      return {
        ...state,
        loading: false,
        csvUploadResult: action.payload,
        error: null,
      };
    case UPLOAD_CSV_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case TRACK_OPPORTUNITY_VIEW_REQUEST:
      return {
        ...state,
        trackingOpportunityViewLoading: true,
        trackingOpportunityViewError: null,
      };
    case TRACK_OPPORTUNITY_VIEW_SUCCESS:
      return {
        ...state,
        trackingOpportunityViewLoading: false,
        trackingOpportunityViewError: null,
      };
    case TRACK_OPPORTUNITY_VIEW_ERROR:
      return {
        ...state,
        trackingOpportunityViewLoading: false,
        trackingOpportunityViewError: action.payload,
      };

    default:
      return state;
  }
};

export default Opportunity;
