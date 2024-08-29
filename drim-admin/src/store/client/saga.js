import { call, put, takeEvery } from "redux-saga/effects";
import { ADD_CLIENT } from "./actionTypes";

import { toast } from "react-toastify";
import { createClientUrl } from "../../services/client";
import { addClientFail, addClientSuccess } from "./actions";

// Add a new influencer
function* onAddNewClient(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createClientUrl, token, action.payload);

    if (response?.status === "Fail") {
      toast.error(response?.result?.error);
      yield put(addClientFail(response?.result?.error));
    } else {
      toast.success(response?.result?.message);
      yield put(addClientSuccess(response.result.data));
    }
  } catch (error) {
    yield put(addClientFail(error));
    toast.error("fail to create client");
  }
}

function* clientsSaga() {
  yield takeEvery(ADD_CLIENT, onAddNewClient);
}

export default clientsSaga;
