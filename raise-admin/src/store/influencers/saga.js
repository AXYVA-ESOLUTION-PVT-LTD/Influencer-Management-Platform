import { call, put, takeEvery } from "redux-saga/effects";
import {
  ADD_INFLUENCER,
  GET_INFLUENCER_BASIC_DATA,
  GET_INFLUENCER_DEMOGRAPHIC_DATA,
  GET_INFLUENCER_MEDIA_DATA,
  GET_INFLUENCER_MONTHLY_STATISTICS,
  GET_INFLUENCER_POST_STATISTICS,
  GET_INFLUENCER_PROFILE,
  GET_INFLUENCER_PUBLICATION_DATA,
  GET_INFLUENCERS,
  UPDATE_INFLUENCER,
} from "./actionTypes";
import {
  addInfluencerFail,
  addInfluencerSuccess,
  getInfluencerBasicDataFail,
  getInfluencerBasicDataSuccess,
  getInfluencerDemographicDataFail,
  getInfluencerDemographicDataSuccess,
  getInfluencerMediaDataFail,
  getInfluencerMediaDataSuccess,
  getInfluencerMonthlyStatisticsFail,
  getInfluencerMonthlyStatisticsSuccess,
  getInfluencerPostStatisticsFail,
  getInfluencerPostStatisticsSuccess,
  getInfluencerProfileFail,
  getInfluencerProfileSuccess,
  getInfluencerPublicationDataFail,
  getInfluencerPublicationDataSuccess,
  getInfluencers,
  getInfluencersFail,
  getInfluencersSuccess,
  updateInfluencerFail,
  updateInfluencerSuccess,
} from "./actions";

import { toast } from "react-toastify";
import {
  createInfluencersUrl,
  getInfluencerBasicDataUrl,
  getInfluencerDemographicDataUrl,
  getInfluencerMediaDataUrl,
  getInfluencerMonthlyStatisticsUrl,
  getInfluencerPostStatisticsUrl,
  getInfluencerProfileUrl,
  getInfluencerPublicationDataUrl,
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
      yield put(
        getInfluencers({
          roleName: "Influencer",
          limit: 10,
          pageCount: 0,
          firstName: "",
          lastName: "",
          email: "",
          status: "",
          sortBy: "",
          sortOrder: "",
          allrecord: false,
        })
      );
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
      yield put(
        getInfluencers({
          roleName: "Influencer",
          limit: 10,
          pageCount: 0,
          firstName: "",
          lastName: "",
          email: "",
          status: "",
          sortBy: "",
          sortOrder: "",
          allrecord: false,
        })
      );
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

function* fetchInfluencerProfile(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getInfluencerProfileUrl, action.payload, token);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerProfileSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || "Failed to fetch profile.");
    }
  } catch (error) {
    yield put(
      getInfluencerProfileFail(error.message || "Failed to fetch profile.")
    );
  }
}

function* fetchInfluencerBasicData(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(
      getInfluencerBasicDataUrl,
      action.payload,
      token
    );
    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerBasicDataSuccess(response.result.data.platforms));
    } else {
      throw new Error(response?.data?.error || "Failed to fetch basic data.");
    }
  } catch (error) {
    yield put(
      getInfluencerBasicDataFail(error.message || "Failed to fetch basic data.")
    );
  }
}

function* fetchInfluencerPostStatistics(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(
      getInfluencerPostStatisticsUrl,
      action.payload,
      token
    );
    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerPostStatisticsSuccess(response.result.data));
    } else {
      throw new Error(
        response?.data?.error || "Failed to fetch post statistics."
      );
    }
  } catch (error) {
    yield put(
      getInfluencerPostStatisticsFail(
        error.message || "Failed to fetch post statistics."
      )
    );
  }
}

function* fetchInfluencerMonthlyStatistics(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(
      getInfluencerMonthlyStatisticsUrl,
      action.payload,
      token
    );
    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerMonthlyStatisticsSuccess(response.result.data));
    } else {
      throw new Error(
        response?.data?.error || "Failed to fetch monthly statistics."
      );
    }
  } catch (error) {
    yield put(
      getInfluencerMonthlyStatisticsFail(
        error.message || "Failed to fetch monthly statistics."
      )
    );
  }
}

function* fetchInfluencerDemographicData(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(
      getInfluencerDemographicDataUrl,
      action.payload,
      token
    );
    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerDemographicDataSuccess(response.result.data));
    } else {
      throw new Error(
        response?.result?.error || "Failed to fetch demographic data."
      );
    }
  } catch (error) {
    yield put(
      getInfluencerDemographicDataFail(
        error.message || "Failed to fetch demographic data."
      )
    );
  }
}

function* fetchInfluencerPublicationData(action) {
  try {
    const token = localStorage.getItem("authUser");
    const { id, limit, pageCount } = action.payload;

    const response = yield call(
      getInfluencerPublicationDataUrl,
      id,
      { limit, pageCount },
      token
    );
    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerPublicationDataSuccess(response.result));
    } else {
      throw new Error(
        response?.result?.error || "Failed to fetch publication data."
      );
    }
  } catch (error) {
    yield put(
      getInfluencerPublicationDataFail(
        error.message || "Failed to fetch publication data."
      )
    );
  }
}

function* fetchInfluencerMediaData(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(
      getInfluencerMediaDataUrl,
      action.payload,
      token
    );
    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerMediaDataSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || "Failed to fetch media data.");
    }
  } catch (error) {
    yield put(
      getInfluencerMediaDataFail(error.message || "Failed to fetch media data.")
    );
  }
}

function* InfluencersSaga() {
  yield takeEvery(GET_INFLUENCERS, fetchInfluencers);
  yield takeEvery(ADD_INFLUENCER, onAddNewInfluencer);
  yield takeEvery(UPDATE_INFLUENCER, onUpdateInfluencer);
  yield takeEvery(GET_INFLUENCER_PROFILE, fetchInfluencerProfile);
  yield takeEvery(GET_INFLUENCER_BASIC_DATA, fetchInfluencerBasicData);
  yield takeEvery(
    GET_INFLUENCER_POST_STATISTICS,
    fetchInfluencerPostStatistics
  );
  yield takeEvery(
    GET_INFLUENCER_MONTHLY_STATISTICS,
    fetchInfluencerMonthlyStatistics
  );
  yield takeEvery(
    GET_INFLUENCER_DEMOGRAPHIC_DATA,
    fetchInfluencerDemographicData
  );
  yield takeEvery(
    GET_INFLUENCER_PUBLICATION_DATA,
    fetchInfluencerPublicationData
  );
  yield takeEvery(GET_INFLUENCER_MEDIA_DATA, fetchInfluencerMediaData);
}

export default InfluencersSaga;
