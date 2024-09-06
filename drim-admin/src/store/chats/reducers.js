import {
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS,
  GET_CHAT,
  GET_CHAT_FAIL,
  GET_CHAT_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  chats: [],
  loading: false,
  error: {},
};

const chats = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CHAT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_CHAT_SUCCESS:
      return {
        ...state,
        chats: [...action.payload.chats],
        loading: false,
        error: null,
      };
    case GET_CHAT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_CHAT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_CHAT_SUCCESS:
      return {
        ...state,
        chats: [...state.chats, action.payload.chat],
        loading: false,
        error: null,
      };
    case CREATE_CHAT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default chats;
