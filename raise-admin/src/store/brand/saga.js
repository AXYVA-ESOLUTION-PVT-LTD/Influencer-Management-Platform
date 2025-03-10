import { call, put, takeEvery } from "redux-saga/effects";
import { ADD_BRAND, GET_ALL_PUBLICATIONS_BY_BRAND, GET_BRAND, GET_BRAND_LIST, GET_BRAND_STATISTICS, GET_INFLUENCER_STATISTICS, GET_INFLUENCER_STATISTICS_BY_COUNTRY, GET_INFLUENCER_STATISTICS_BY_PLATFORM, GET_OPPORTUNITY_STATISTICS, UPDATE_BRAND } from "./actionTypes";

import { toast } from "react-toastify";
import STATUS from "../../constants/status";
import {
  createBrandUrl,
  getAllPublicationsByBrandApi,
  getBrandStatisticsUrl,
  getBrandUrl,
  getInfluencerStatisticsByCountryUrl,
  getInfluencerStatisticsByPlatformUrl,
  getInfluencerStatisticsUrl,
  getOpportunityStatisticsUrl,
  updateBrandUrl,
} from "../../services/brand";
import {
  addBrandFail,
  addBrandSuccess,
  getAllPublicationsByBrandFail,
  getAllPublicationsByBrandSuccess,
  getBrand,
  getBrandFail,
  getBrandListFail,
  getBrandListSuccess,
  getBrandStatisticsFail,
  getBrandStatisticsSuccess,
  getBrandSuccess,
  getInfluencerStatisticsByCountryFail,
  getInfluencerStatisticsByCountrySuccess,
  getInfluencerStatisticsByPlatformFail,
  getInfluencerStatisticsByPlatformSuccess,
  getInfluencerStatisticsFail,
  getInfluencerStatisticsSuccess,
  getOpportunityStatisticsFail,
  getOpportunityStatisticsSuccess,
  updateBrandFail,
  updateBrandSuccess,
} from "./actions";

// Fetch All Brand
function* fetchBrand(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getBrandUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getBrandSuccess(response.result.data));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to fetch brand data. Please try again later"
      );
    }
  } catch (error) {
    yield put(
      getBrandFail(
        error.message || "Failed to fetch brand data. Please try again later"
      )
    );
  }
}

function* fetchBrandList(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getBrandUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getBrandListSuccess(response.result.data));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to fetch brand list data. Please try again later"
      );
    }
  } catch (error) {
    yield put(
      getBrandListFail(
        error.message || "Failed to fetch brand list data. Please try again later"
      )
    );
  }
}

// Add a new influencer
function* onAddBrand(action) {
  // const id = toast.loading("Creating brand...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createBrandUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      // toast.update(id, {
      //   render: response?.result?.message || "brand created successfully",
      //   type: "success",
      //   isLoading: false,
      //   autoClose: true,
      // });
      toast.success(
        response?.result?.message || "Brand created successfully",
        {
          autoClose: true,
        }
      );
      yield put(addBrandSuccess(response.result.data.brand));
      yield put(getBrand({ roleName: "Brand", limit: 10, pageCount: 0, allrecord: false }));
    } else {
      if (
        response?.result?.details &&
        Array.isArray(response.result.details) &&
        response.result.details.length > 0
      ) {
        const combinedMessage = response.result.details.join("\n");
        throw new Error(combinedMessage);
      } else {
        const errorMessage =
          response?.result?.error ||
          "Failed to create brand. Please try again later.";
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
      addBrandFail(
        error.message || "Failed to create brand. Please try again later."
      )
    );
  }
}

// Update an influencer
function* onUpdateBrand(action) {
  const id = toast.loading("Updating brand...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateBrandUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || "brand updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateBrandSuccess(response?.result?.data?.brand));
      yield put(getBrand({ roleName: "Brand", limit: 10, pageCount: 0, allrecord: false }));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to update brand. Please try again later."
      );
    }
  } catch (error) {
    console.log(error);

    yield put(
      updateBrandFail(
        error.message || "Failed to update brand. Please try again later."
      )
    );
    toast.update(id, {
      render: error.message || "Failed to update brand",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

// Fetch Brand Statistics
function* fetchBrandStatistics(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getBrandStatisticsUrl, token);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getBrandStatisticsSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || "Failed to fetch brand statistics.");
    }
  } catch (error) {
    yield put(getBrandStatisticsFail(error.message || "Failed to fetch brand statistics."));
  }
}

// Fetch Opportunity Statistics
function* fetchOpportunityStatistics(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getOpportunityStatisticsUrl, token);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getOpportunityStatisticsSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || "Failed to fetch opportunity statistics.");
    }
  } catch (error) {
    yield put(getOpportunityStatisticsFail(error.message || "Failed to fetch opportunity statistics."));
  }
}

// Fetch Influencer Statistics
function* fetchInfluencerStatistics(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getInfluencerStatisticsUrl, token);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerStatisticsSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || "Failed to fetch influencer statistics.");
    }
  } catch (error) {
    yield put(getInfluencerStatisticsFail(error.message || "Failed to fetch influencer statistics."));
  }
}

// Fetch Influencer Statistics
function* fetchInfluencerStatisticsByPlatform() {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getInfluencerStatisticsByPlatformUrl,token);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerStatisticsByPlatformSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || "Failed to fetch influencer statistics.");
    }
  } catch (error) {
    yield put(getInfluencerStatisticsByPlatformFail(error.message || "Failed to fetch influencer statistics."));
  }
}

// Fetch Influencer Statistics by Country
function* fetchInfluencerStatisticsByCountry() {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getInfluencerStatisticsByCountryUrl, token);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getInfluencerStatisticsByCountrySuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || "Failed to fetch influencer statistics by country.");
    }
  } catch (error) {
    yield put(getInfluencerStatisticsByCountryFail(error.message || "Failed to fetch influencer statistics by country."));
  }
}

function* fetchAllPublicationsByBrand(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getAllPublicationsByBrandApi, action.payload, token);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getAllPublicationsByBrandSuccess(response.result));
    } else {
      throw new Error(response?.result?.message || "Failed to fetch publications.");
    }
  } catch (error) {
    yield put(getAllPublicationsByBrandFail(error.message || "Failed to fetch publications."));
  }
}

function* BrandsSaga() {
  yield takeEvery(GET_BRAND, fetchBrand);
  yield takeEvery(GET_BRAND_LIST, fetchBrandList);
  yield takeEvery(ADD_BRAND, onAddBrand);
  yield takeEvery(UPDATE_BRAND, onUpdateBrand);
  yield takeEvery(GET_BRAND_STATISTICS, fetchBrandStatistics);
  yield takeEvery(GET_OPPORTUNITY_STATISTICS, fetchOpportunityStatistics);
  yield takeEvery(GET_INFLUENCER_STATISTICS, fetchInfluencerStatistics);
  yield takeEvery(GET_INFLUENCER_STATISTICS_BY_PLATFORM, fetchInfluencerStatisticsByPlatform);
  yield takeEvery(GET_INFLUENCER_STATISTICS_BY_COUNTRY, fetchInfluencerStatisticsByCountry);
  yield takeEvery(GET_ALL_PUBLICATIONS_BY_BRAND, fetchAllPublicationsByBrand);
}

export default BrandsSaga;
