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
import STATUS from "../../constants/status";

function* fetchOpportunity(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(readOpportunityUrl, token, action.payload);  // TODO: Error handling
    if (response?.status === STATUS.SUCCESS) {
      yield put(getOpportunitySuccess(response?.result?.data));
    } else {
      throw new Error(response?.result?.error || 'Failed to fetch opportunity. Please try again later.');
    }
  } catch (error) {
    yield put(getOpportunityError(error.message || 'Failed to fetch opportunity. Please try again later.'));
  }
}

function* onAddOpportunity(action) {
  const id = toast.loading("Adding Opportunity...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createOpportunityUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || 'Opportunity added successfully',
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(createOpportunitySuccess(response?.result?.data));
      yield put(getOpportunity()); 
    } else {
      throw new Error(response?.result?.error || 'Failed to add opportunity. Please try again later.');
    }
  } catch (error) {
    yield put(addRoleFail(error.message || 'Failed to add opportunity. Please try again later.'));
    toast.update(id, {
      render: error.message || 'Failed to add opportunity',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* onDeleteOpportunity(action) {
  const id = toast.loading("Deleting Opportunity...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(deleteOpportunityUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || 'Opportunity deleted successfully',
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(deleteOpportunitySuccess(response?.result?.data));
      yield put(getOpportunity()); 
    } else {
      throw new Error(response?.result?.error || 'Failed to delete opportunity. Please try again later.');
    }
  } catch (error) {
    yield put(deleteOpportunityError(error.message || 'Failed to delete opportunity. Please try again later.'));
    toast.update(id, {
      render: error.message || 'Failed to delete opportunity',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* onUpdateOpportunity(action) {
  const toastId = toast.loading("Updating Opportunity...");
  try {
    const token = localStorage.getItem("authUser");
    const { _id: id, ...data } = action.payload;
    const response = yield call(updateOpportunityUrl, id, data, token);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(toastId, {
        render: response?.result?.message || 'Opportunity updated successfully',
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateOpportunitySuccess(response?.result?.data));
      yield put(getOpportunity()); // Refresh opportunities list
    } else {
      throw new Error(response?.result?.error || 'Failed to update opportunity. Please try again later.');
    }
  } catch (error) {
    yield put(updateOpportunityError(error.message || 'Failed to update opportunity. Please try again later.'));
    toast.update(toastId, {
      render: error.message || 'Failed to update opportunity',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}


function* opportunitySaga() {
  yield takeEvery(GET_OPPORTUNITY_REQUEST, fetchOpportunity);
  yield takeEvery(CREATE_OPPORTUNITY_REQUEST, onAddOpportunity);
  yield takeEvery(DELETE_OPPORTUNITY_REQUEST, onDeleteOpportunity);
  yield takeEvery(UPDATE_OPPORTUNITY_REQUEST, onUpdateOpportunity);
}

export default opportunitySaga;
