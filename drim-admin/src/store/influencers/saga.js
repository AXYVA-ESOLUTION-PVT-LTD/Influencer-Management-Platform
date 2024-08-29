import { call, put, takeEvery } from "redux-saga/effects";
import { ADD_INFLUENCER } from "./actionTypes";
import { addInfluencerFail, addInfluencerSuccess } from "./actions";

import { createInfluencersUrl } from "../../services/influencer";
import { toast } from "react-toastify";

// Fetch all influencers
// function* fetchInfluencers() {
//   try {
//     const response = yield call(readInfluencers);
//     yield put(getInfluencersSuccess(response.result.data));
//   } catch (error) {
//     yield put(getInfluencersFail(error));
//   }
// }

// Add a new influencer
function* onAddNewInfluencer(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createInfluencersUrl, token, action.payload);

    if (response?.status === "Fail") {
      toast.error(response?.result?.error);
      yield put(addInfluencerFail(response?.result?.error));
    } else {
      toast.success(response?.result?.message);
      yield put(addInfluencerSuccess(response.result.data));
    }
  } catch (error) {
    yield put(addInfluencerFail(error));
    toast.error("fail to create influencer");
  }
}

// // Update an influencer
// function* onUpdateInfluencer({ payload: influencer }) {
//   try {
//     const response = yield call(updateInfluencers, influencer);
//     yield put(updateInfluencerSuccess(response.result.data));
//   } catch (error) {
//     yield put(updateInfluencerFail(error));
//   }
// }

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
  yield takeEvery(ADD_INFLUENCER, onAddNewInfluencer);
  // yield takeEvery(GET_INFLUENCERS, fetchInfluencers);
  // yield takeEvery(UPDATE_INFLUENCER, onUpdateInfluencer);
  // yield takeEvery(DELETE_INFLUENCER, onDeleteInfluencer);
  // yield takeEvery(GET_SPECIFIC_INFLUENCER, fetchInfluencerDetail);
}

export default influencersSaga;
