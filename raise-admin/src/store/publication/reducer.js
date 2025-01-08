import { CREATE_PUBLICATION_ERROR, CREATE_PUBLICATION_REQUEST, CREATE_PUBLICATION_SUCCESS, DELETE_PUBLICATION_ERROR, DELETE_PUBLICATION_REQUEST, DELETE_PUBLICATION_SUCCESS, GET_PUBLICATION_ERROR, GET_PUBLICATION_REQUEST, GET_PUBLICATION_SUCCESS, UPDATE_PUBLICATION_ERROR, UPDATE_PUBLICATION_REQUEST, UPDATE_PUBLICATION_STATUS_ERROR, UPDATE_PUBLICATION_STATUS_REQUEST, UPDATE_PUBLICATION_STATUS_SUCCESS, UPDATE_PUBLICATION_SUCCESS } from "./actionTypes";

const initialState = {
  publications: [],
  totalPublications: null,
  currentPage: null,
  loading: false,
  error: null,
};

const Publication = (state = initialState, action) => {
  switch (action.type) {
    case GET_PUBLICATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PUBLICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        publications: action.payload.data,
        totalPublications: action.payload.totalRecords,
        // currentPage: action.payload.currentPage,
        error: null,
      };
    case GET_PUBLICATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_PUBLICATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_PUBLICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        publications: [...state.publications, action.payload.publication],
        totalPublications: state.totalPublications + 1,
        error: null,
      };
    case CREATE_PUBLICATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_PUBLICATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PUBLICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        publications: state.publications.map((pub) =>
          pub._id === action.payload.publication._id
            ? { ...pub, ...action.payload.publication }
            : pub
        ),
        error: null,
      };
    case UPDATE_PUBLICATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case UPDATE_PUBLICATION_STATUS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case UPDATE_PUBLICATION_STATUS_SUCCESS:
        return {
          ...state,
          loading: false,
          publications: state.publications.map((pub) =>
            pub._id === action.payload._id
              ? { ...pub, ...action.payload }
              : pub
          ),
          error: null,
        };
      case UPDATE_PUBLICATION_STATUS_ERROR:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };      

    case DELETE_PUBLICATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_PUBLICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        publications: state.publications.filter(
          (pub) => pub._id !== action.payload.id
        ),
        totalPublications: state.totalPublications - 1,
        error: null,
      };
    case DELETE_PUBLICATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default Publication;