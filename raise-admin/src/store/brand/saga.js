import { call, put, takeEvery } from "redux-saga/effects";
import { ADD_BRAND, GET_BRAND, UPDATE_BRAND } from "./actionTypes";

import { toast } from "react-toastify";
import STATUS from "../../constants/status";
import {
  createBrandUrl,
  getBrandUrl,
  updateBrandUrl,
} from "../../services/brand";
import {
  addBrandFail,
  addBrandSuccess,
  getBrandFail,
  getBrandSuccess,
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

// Add a new influencer
function* onAddBrand(action) {
  const id = toast.loading("Creating brand...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createBrandUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || "brand created successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(addBrandSuccess(response.result.data.brand));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to create brand. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      addBrandFail(
        error.message || "Failed to create brand. Please try again later."
      )
    );
    toast.update(id, {
      render: error.message || "Failed to create brand",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
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
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to update brand. Please try again later."
      );
    }
  } catch (error) {
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

function* brandsSaga() {
  yield takeEvery(GET_BRAND, fetchBrand);
  yield takeEvery(ADD_BRAND, onAddBrand);
  yield takeEvery(UPDATE_BRAND, onUpdateBrand);
}

export default brandsSaga;
