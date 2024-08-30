import {
  ADD_CLIENT,
  ADD_CLIENT_FAIL,
  ADD_CLIENT_SUCCESS,
  GET_CLIENT,
  GET_CLIENT_FAIL,
  GET_CLIENT_SUCCESS,
  UPDATE_CLIENT,
  UPDATE_CLIENT_FAIL,
  UPDATE_CLIENT_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  clients: [],
  totalClient: null,
  loading: false,
  error: {},
};

const client = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CLIENT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_CLIENT_SUCCESS:
      return {
        ...state,
        clients: [...action.payload.clients],
        totalClient: action.payload.totalClient,
        loading: false,
        error: null,
      };
    case GET_CLIENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_CLIENT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_CLIENT_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        clients: [...state.clients, action.payload],
        loading: false,
      };
    case ADD_CLIENT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case UPDATE_CLIENT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_CLIENT_SUCCESS:
      const { _id: updatedClientId } = action.payload;
      console.log({ updatedClientId });
      console.log({ payload: action.payload });
      return {
        ...state,
        clients: state.clients.map((client) =>
          client._id === updatedClientId ? { ...action.payload } : client
        ),
        loading: false,
      };
    case UPDATE_CLIENT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default client;
