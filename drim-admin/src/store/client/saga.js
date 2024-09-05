import { call, put, takeEvery } from "redux-saga/effects";
import { ADD_CLIENT, GET_CLIENT, UPDATE_CLIENT } from "./actionTypes";

import { toast } from "react-toastify";
import {
  createClientUrl,
  getClientUrl,
  updateClientUrl,
} from "../../services/client";
import {
  addClientFail,
  addClientSuccess,
  getClientFail,
  getClientSuccess,
  updateClientFail,
  updateClientSuccess,
} from "./actions";
import STATUS from "../../constants/status";

// Fetch All Client
function* fetchClient(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getClientUrl, token, action.payload);
    
    if (response?.status === STATUS.SUCCESS) {
      yield put(getClientSuccess(response.result.data));
    } else {

      throw new Error(response?.result?.error || 'Failed to fetch brand data. Please try again later');
    }
  } catch (error) {
    yield put(getClientFail(error.message || 'Failed to fetch brand data. Please try again later'));
  }
}

// Add a new influencer
function* onAddNewClient(action) {
  const id = toast.loading("Creating brand...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createClientUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || 'brand created successfully',
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(addClientSuccess(response.result.data.client));
    } else {

      throw new Error(response?.result?.error || 'Failed to create brand. Please try again later.');
    }
  } catch (error) {
    yield put(addClientFail(error.message || 'Failed to create brand. Please try again later.'));
    toast.update(id, {
      render: error.message || 'Failed to create brand',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

// Update an influencer
function* onUpdateClient(action) {
  const id = toast.loading("Updating brand...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateClientUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || 'brand updated successfully',
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateClientSuccess(response?.result?.data?.client));
    } else {
      throw new Error(response?.result?.error || 'Failed to update brand. Please try again later.');
    }
  } catch (error) {
    yield put(updateClientFail(error.message || 'Failed to update brand. Please try again later.'));
    toast.update(id, {
      render: error.message || 'Failed to update brand',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}


function* clientsSaga() {
  yield takeEvery(ADD_CLIENT, onAddNewClient);
  yield takeEvery(GET_CLIENT, fetchClient);
  yield takeEvery(UPDATE_CLIENT, onUpdateClient);
}

export default clientsSaga;
