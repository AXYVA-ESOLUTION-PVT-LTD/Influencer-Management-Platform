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

    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencersSuccess(response.result.data));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to fetch influencers. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      getInfluencersFail(
        error.message || "Failed to fetch influencers. Please try again later."
      )
    );
  }
}

// Add a new influencer
function* onAddNewInfluencer(action) {
  // const id = toast.loading("Creating Influencer...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createInfluencersUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      // toast.update(id, {
      //   render: response?.result?.message || "Influencer created successfully",
      //   type: "success",
      //   isLoading: false,
      //   autoClose: true,
      // });
      toast.success(
        response?.result?.message || "Influencer created successfully",
        {
          autoClose: true,
        }
      );
      yield put(addInfluencerSuccess(response.result.data.influencer));
    } else {
      if (
        response?.result?.details &&
        Array.isArray(response.result.details) &&
        response.result.details.length > 0
      ) {
        const combinedMessage = response.result.details.join("\n");
        // const firstMessage = response.result.details[0];
        // toast.update(id, {
        //   render: firstMessage,
        //   type: "error",
        //   isLoading: false,
        //   autoClose: true,
        // });

        // response.result.details.forEach((message, index) => {
        //   if (index !== 0) {
        //     toast.error(message, {
        //       autoClose: true,
        //     });
        //   }
        // });

        throw new Error(combinedMessage);
      } else {
        const errorMessage =
          response?.result?.error ||
          "Failed to create influencer. Please try again later.";
        // toast.update(id, {
        //   render: errorMessage,
        //   type: "error",
        //   isLoading: false,
        //   autoClose: true,
        // });
        toast.error(errorMessage, {
          autoClose: true,
        });

        throw new Error(errorMessage);
      }
    }
  } catch (error) {
    yield put(
      addInfluencerFail(
        error.message || "Failed to create influencer. Please try again later."
      )
    );
  }
}

// Update an influencer
function* onUpdateInfluencer(action) {
  const id = toast.loading("Updating Influencer...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateInfluencerUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || "Influencer updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateInfluencerSuccess(response.result.data.influencer));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to update influencer. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      updateInfluencerFail(
        error.message || "Failed to update influencer. Please try again later."
      )
    );
    toast.update(id, {
      render: error.message || "Failed to update influencer",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
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

function* InfluencersSaga() {
  yield takeEvery(GET_INFLUENCERS, fetchInfluencers);
  yield takeEvery(ADD_INFLUENCER, onAddNewInfluencer);
  yield takeEvery(UPDATE_INFLUENCER, onUpdateInfluencer);
  // yield takeEvery(DELETE_INFLUENCER, onDeleteInfluencer);
  // yield takeEvery(GET_SPECIFIC_INFLUENCER, fetchInfluencerDetail);
}

export default InfluencersSaga;
