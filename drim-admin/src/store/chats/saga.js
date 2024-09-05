import { call, put, takeEvery } from "redux-saga/effects";
import { createChatsUrl, getChatsUrl } from "../../services/chats";
import {
  createChatsFail,
  createChatsSuccess,
  getChatsFail,
  getChatsSuccess,
} from "./actions";
import { CREATE_CHAT, GET_CHAT } from "./actionTypes";
import STATUS from "../../constants/status";

function* fetchChats(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getChatsUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getChatsSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || 'Failed to fetch chats. Please try again later.');
    }
  } catch (error) {
    yield put(getChatsFail(error.message || 'Failed to fetch chats. Please try again later.'));
  }
}

function* createChats(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createChatsUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(createChatsSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || 'Failed to create chat. Please try again later.');
    }
  } catch (error) {
    yield put(createChatsFail(error.message || 'Failed to create chat. Please try again later.'));
  }
}


function* ChatsSaga() {
  yield takeEvery(GET_CHAT, fetchChats);
  yield takeEvery(CREATE_CHAT, createChats);
}

export default ChatsSaga;
