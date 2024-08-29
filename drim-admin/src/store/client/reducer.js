import { ADD_CLIENT, ADD_CLIENT_FAIL, ADD_CLIENT_SUCCESS } from "./actionTypes";

const INIT_STATE = {
  clients: [],
  loading: false,
  error: {},
};

const client = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_CLIENT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_CLIENT_SUCCESS:
      return {
        ...state,
        clients: [...state.clients, action.payload],
      };

    case ADD_CLIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default client;
