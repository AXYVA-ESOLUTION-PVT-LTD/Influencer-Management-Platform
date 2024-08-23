import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_INFLUENCERS,
  ADD_INFLUENCER,
  UPDATE_INFLUENCER,
  DELETE_INFLUENCER,
  GET_SPECIFIC_INFLUENCER,
} from "./actionTypes";
import {
  getInfluencersSuccess,
  getInfluencersFail,
  addInfluencerSuccess,
  addInfluencerFail,
  updateInfluencerSuccess,
  updateInfluencerFail,
  deleteInfluencerSuccess,
  deleteInfluencerFail,
  getInfluencerDetailSuccess,
  getInfluencerDetailFail,
} from "./actions";

import {
  createInfluencers,
  readInfluencers,
  updateInfluencers,
  deleteInfluencers,
  readInfluencersDetail,
} from "../../services/auth/index";

// Fetch all influencers
function* fetchInfluencers() {
  try {
    const response = yield call(readInfluencers);
    yield put(getInfluencersSuccess(response.result.data));
  } catch (error) {
    yield put(getInfluencersFail(error));
  }
}

// Add a new influencer
function* onAddNewInfluencer({ payload: influencer }) {
  try {
    const response = yield call(createInfluencers, influencer);
    yield put(addInfluencerSuccess(response.result.data));
  } catch (error) {
    yield put(addInfluencerFail(error));
  }
}

// Update an influencer
function* onUpdateInfluencer({ payload: influencer }) {
  try {
    const response = yield call(updateInfluencers, influencer);
    yield put(updateInfluencerSuccess(response.result.data));
  } catch (error) {
    yield put(updateInfluencerFail(error));
  }
}

// Delete an influencer
function* onDeleteInfluencer({ payload: influencerId }) {
  try {
    yield call(deleteInfluencers, influencerId);
    yield put(deleteInfluencerSuccess(influencerId));
  } catch (error) {
    yield put(deleteInfluencerFail(error));
  }
}

// Fetch details of a specific influencer
function* fetchInfluencerDetail({ influencerId }) {
  try {
    const response = yield call(readInfluencersDetail, influencerId);
    yield put(getInfluencerDetailSuccess(response.result.data));
  } catch (error) {
    yield put(getInfluencerDetailFail(error));
  }
}

function* influencersSaga() {
  yield takeEvery(GET_INFLUENCERS, fetchInfluencers);
  yield takeEvery(ADD_INFLUENCER, onAddNewInfluencer);
  yield takeEvery(UPDATE_INFLUENCER, onUpdateInfluencer);
  yield takeEvery(DELETE_INFLUENCER, onDeleteInfluencer);
  yield takeEvery(GET_SPECIFIC_INFLUENCER, fetchInfluencerDetail);
}

export default influencersSaga;
