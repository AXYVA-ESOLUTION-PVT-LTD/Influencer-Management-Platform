import { call, put, takeEvery } from "redux-saga/effects";
import { createChatsUrl, getChatsUrl } from "../../services/chats";
import {
  createChatsFail,
  createChatsSuccess,
  getChatsFail,
  getChatsSuccess,
} from "./actions";
import { CREATE_CHAT, GET_CHAT } from "./actionTypes";

function* fetchChats(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getChatsUrl, token, action.payload);
    yield put(getChatsSuccess(response.result.data));
  } catch (error) {
    yield put(getChatsFail(error));
  }
}

function* createChats(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createChatsUrl, token, action.payload);
    yield put(createChatsSuccess(response.result.data));
  } catch (error) {
    yield put(createChatsFail(error));
  }
}

function* ChatsSaga() {
  yield takeEvery(GET_CHAT, fetchChats);
  yield takeEvery(CREATE_CHAT, createChats);
}

export default ChatsSaga;
