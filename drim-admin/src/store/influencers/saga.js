import { call, put, takeEvery } from "redux-saga/effects";
import {
  ADD_INFLUENCER,
  GET_INFLUENCERS,
  UPDATE_INFLUENCER,
} from "./actionTypes";
import {
  addInfluencerFail,
  addInfluencerSuccess,
  getInfluencersFail,
  getInfluencersSuccess,
  updateInfluencerFail,
  updateInfluencerSuccess,
} from "./actions";

import { toast } from "react-toastify";
import {
  createInfluencersUrl,
  getInfluencersUrl,
  updateInfluencerUrl,
} from "../../services/influencer";
import STATUS from "../../constants/status";

// Fetch all influencers
function* fetchInfluencers(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getInfluencersUrl, token, action.payload);
    yield put(getInfluencersSuccess(response.result.data));
  } catch (error) {
    yield put(getInfluencersFail(error));
  }
}

// Add a new influencer
function* onAddNewInfluencer(action) {
  const id = toast.loading("Creating Influencer...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createInfluencersUrl, token, action.payload);

    if (response?.status === STATUS.FAIL) {
      toast.update(id, {
        render: response?.result?.error,
        type: "error",
        isLoading: false,
        autoClose: true,
      });
      yield put(addInfluencerFail(response?.result?.error));
    } else {
      toast.update(id, {
        render: response?.result?.message,
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(addInfluencerSuccess(response?.result?.data?.influencer));
    }
  } catch (error) {
    yield put(addInfluencerFail(error));
    toast.update(id, {
      render: "fail to create influencer",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

// Update an influencer
function* onUpdateInfluencer(action) {
  try {
    const token = localStorage.getItem("authUser");
    const id = toast.loading("Creating Influencer...");
    const response = yield call(updateInfluencerUrl, token, action.payload);
    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message,
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateInfluencerSuccess(response?.result?.data?.influencer));
    } else {
      toast.update(id, {
        render: response?.result?.error,
        type: "error",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateInfluencerFail(response?.result?.error));
    }
  } catch (error) {
    yield put(updateInfluencerFail(error));
  }
}

// // Delete an influencer
// function* onDeleteInfluencer({ payload: influencerId }) {
//   try {
//     yield call(deleteInfluencers, influencerId);
//     yield put(deleteInfluencerSuccess(influencerId));
//   } catch (error) {
//     yield put(deleteInfluencerFail(error));
//   }
// }

// // Fetch details of a specific influencer
// function* fetchInfluencerDetail({ influencerId }) {
//   try {
//     const response = yield call(readInfluencersDetail, influencerId);
//     yield put(getInfluencerDetailSuccess(response.result.data));
//   } catch (error) {
//     yield put(getInfluencerDetailFail(error));
//   }
// }

function* influencersSaga() {
  yield takeEvery(GET_INFLUENCERS, fetchInfluencers);
  yield takeEvery(ADD_INFLUENCER, onAddNewInfluencer);
  yield takeEvery(UPDATE_INFLUENCER, onUpdateInfluencer);
  // yield takeEvery(DELETE_INFLUENCER, onDeleteInfluencer);
  // yield takeEvery(GET_SPECIFIC_INFLUENCER, fetchInfluencerDetail);
}

export default influencersSaga;
