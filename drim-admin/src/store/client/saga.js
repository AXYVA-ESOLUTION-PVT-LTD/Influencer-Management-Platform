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
    yield put(getClientSuccess(response.result.data));
  } catch (error) {
    yield put(getClientFail(error));
  }
}
// Add a new influencer
function* onAddNewClient(action) {
  try {
    const token = localStorage.getItem("authUser");
    const id = toast.loading("Creating Client...");
    const response = yield call(createClientUrl, token, action.payload);

    if (response?.status === STATUS.FAIL) {
      toast.update(id, {
        render: response?.result?.error,
        type: "error",
        isLoading: false,
        autoClose: true,
      });
      yield put(addClientFail(response?.result?.error));
    } else {
      toast.update(id, {
        render: response?.result?.message,
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      yield put(addClientSuccess(response.result.data.client));
    }
  } catch (error) {
    yield put(addClientFail(error));
    toast.error("fail to create client");
  }
}

// Update an influencer
function* onUpdateClient(action) {
  const id = toast.loading("Creating Client...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateClientUrl, token, action.payload);
    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message,
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateClientSuccess(response?.result?.data?.client));
    } else {
      toast.update(id, {
        render: response?.result?.error,
        type: "error",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateClientFail(response?.result?.error));
    }
  } catch (error) {
    yield put(updateClientFail(error));
    toast.update(id, {
      render: "Fail to Update Client",
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
