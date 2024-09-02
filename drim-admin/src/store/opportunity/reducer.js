
import {
  CREATE_OPPORTUNITY_ERROR,
  CREATE_OPPORTUNITY_REQUEST,
  CREATE_OPPORTUNITY_SUCCESS,
  DELETE_OPPORTUNITY_ERROR,
  DELETE_OPPORTUNITY_REQUEST,
  DELETE_OPPORTUNITY_SUCCESS,
  GET_OPPORTUNITY_ERROR,
  GET_OPPORTUNITY_REQUEST,
  GET_OPPORTUNITY_SUCCESS,
  UPDATE_OPPORTUNITY_ERROR,
  UPDATE_OPPORTUNITY_REQUEST,
  UPDATE_OPPORTUNITY_SUCCESS,
} from "./actionTypes";

const initialState = {
  opportunities: [],
  totalOpportunities: null,
  currentPage: null,
  loading: false,
  error: null,
};

const opportunity = (state = initialState, action) => {
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

    default:
      return state;
  }
};

export default opportunity;
