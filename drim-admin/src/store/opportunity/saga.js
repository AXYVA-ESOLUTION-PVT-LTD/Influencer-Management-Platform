import { call, put, takeEvery } from "redux-saga/effects";
import {
  createOpportunityUrl,
  deleteOpportunityUrl,
  readOpportunityUrl,
  updateOpportunityUrl,
} from "../../services/opportunity/index";
import { addRoleFail } from "../actions";
import {
  createOpportunitySuccess,
  deleteOpportunityError,
  deleteOpportunitySuccess,
  getOpportunity,
  getOpportunityError,
  getOpportunitySuccess,
  updateOpportunityError,
  updateOpportunitySuccess,
} from "./actions";
import {
  CREATE_OPPORTUNITY_REQUEST,
  DELETE_OPPORTUNITY_REQUEST,
  GET_OPPORTUNITY_REQUEST,
  UPDATE_OPPORTUNITY_REQUEST,
} from "./actionTypes";
import { toast } from "react-toastify";

function* fetchOpportunity(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(readOpportunityUrl, token, action.payload);
    yield put(getOpportunitySuccess(response?.result?.data));
  } catch (error) {
    yield put(getOpportunityError(error));
  }
}

function* onAddOpportunity(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createOpportunityUrl, token, action.payload);
    yield put(createOpportunitySuccess(response?.result?.data));
    toast.success("Opportutnity Added successfully");
    yield put(getOpportunity());
  } catch (error) {
    yield put(addRoleFail(error));
    toast.error("Fail to add Opportutnity");
  }
}

function* onDeleteOpportunity(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(deleteOpportunityUrl, token, action.payload);
    yield put(deleteOpportunitySuccess(response?.result?.data));
    toast.success("Opportutnity Deleted successfully");
    yield put(getOpportunity());
  } catch (error) {
    yield put(deleteOpportunityError(error));
    toast.error("Fail to delete Opportutnity");
  }
}

function* onUpdateOpportunity(action) {
  try {
    const token = localStorage.getItem("authUser");
    const { _id: id, ...data } = action.payload;
    const response = yield call(updateOpportunityUrl, id, data, token);
    yield put(updateOpportunitySuccess(response?.result?.data));
    toast.success("Opportutnity Updated successfully");
    yield put(getOpportunity());
  } catch (error) {
    yield put(updateOpportunityError(error));
    toast.error("Fail to update Opportutnity");
  }
}

function* opportunitySaga() {
  yield takeEvery(GET_OPPORTUNITY_REQUEST, fetchOpportunity);
  yield takeEvery(CREATE_OPPORTUNITY_REQUEST, onAddOpportunity);
  yield takeEvery(DELETE_OPPORTUNITY_REQUEST, onDeleteOpportunity);
  yield takeEvery(UPDATE_OPPORTUNITY_REQUEST, onUpdateOpportunity);
}

export default opportunitySaga;
