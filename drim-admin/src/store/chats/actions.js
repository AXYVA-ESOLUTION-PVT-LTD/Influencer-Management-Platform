import {
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS,
  GET_CHAT,
  GET_CHAT_FAIL,
  GET_CHAT_SUCCESS,
} from "./actionTypes";

export const getChats = (payload) => {
  return {
    type: GET_CHAT,
    payload,
  };
};
export const getChatsSuccess = (payload) => {
  return {
    type: GET_CHAT_SUCCESS,
    payload,
  };
};
export const getChatsFail = (payload) => {
  return {
    type: GET_CHAT_FAIL,
    payload,
  };
};
export const createChats = (payload) => {
  return {
    type: CREATE_CHAT,
    payload,
  };
};
export const createChatsSuccess = (payload) => {
  return {
    type: CREATE_CHAT_SUCCESS,
    payload,
  };
};
export const createChatsFail = (payload) => {
  return {
    type: CREATE_CHAT_FAIL,
    payload,
  };
};
