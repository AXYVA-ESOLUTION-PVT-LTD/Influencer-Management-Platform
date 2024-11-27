import { call, put, takeEvery } from "redux-saga/effects";
import {
  createOpportunityUrl,
  createTicketUrl,
  deleteOpportunityUrl,
  fetchTicketsUrl,
  readOpportunityUrl,
  removeOpportunityImageUrl,
  updateOpportunityUrl,
  updateTicketUrl,
  uploadOpportunityImageUrl,
} from "../../services/opportunity/index";
import { addRoleFail } from "../actions";
import {
  createOpportunitySuccess,
  createTicketError,
  createTicketSuccess,
  deleteOpportunityError,
  deleteOpportunitySuccess,
  fetchTicketsError,
  fetchTicketsSuccess,
  getOpportunity,
  getOpportunityError,
  getOpportunitySuccess,
  removeOpportunityImageError,
  removeOpportunityImageSuccess,
  updateOpportunityError,
  updateOpportunitySuccess,
  updateTicketError,
  updateTicketSuccess,
  uploadOpportunityImageError,
  uploadOpportunityImageSuccess,
} from "./actions";
import {
  CREATE_OPPORTUNITY_REQUEST,
  CREATE_TICKET_REQUEST,
  DELETE_OPPORTUNITY_REQUEST,
  FETCH_TICKETS_REQUEST,
  GET_OPPORTUNITY_REQUEST,
  REMOVE_OPPORTUNITY_IMAGE_REQUEST,
  UPDATE_OPPORTUNITY_REQUEST,
  UPDATE_TICKET_REQUEST,
  UPLOAD_OPPORTUNITY_IMAGE_REQUEST,
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

function* onUploadOpportunityImage(action) {
  const toastId = toast.loading("Uploading image...");
  try {
    const token = localStorage.getItem("authUser");
    const formData = new FormData();
    formData.append("file", action.payload);
    
    const response = yield call(uploadOpportunityImageUrl, token, formData);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(toastId, {
        render: "Image uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(uploadOpportunityImageSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || "Failed to upload image.");
    }
  } catch (error) {
    yield put(uploadOpportunityImageError(error.message));
    toast.update(toastId, {
      render: error.message,
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

// Remove Opportunity Image
function* onRemoveOpportunityImage(action) {
  const toastId = toast.loading("Removing image...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(removeOpportunityImageUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(toastId, {
        render: "Image removed successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(removeOpportunityImageSuccess(response.result.data));
    } else {
      throw new Error(response?.result?.error || "Failed to remove image.");
    }
  } catch (error) {
    yield put(removeOpportunityImageError(error.message));
    toast.update(toastId, {
      render: error.message,
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* onFetchTickets(action) {
  const { influencerId, limit, pageCount } = action.payload;
  const token = localStorage.getItem("authUser");
  try {
    const response = yield call(fetchTicketsUrl, { influencerId, limit, pageCount }, token);
    if (response?.status === STATUS.SUCCESS) {
      yield put(fetchTicketsSuccess(response?.result));
    }
  } catch (error) {
    yield put(fetchTicketsError(error.message || "Failed to fetch tickets"));
  }
}

function* onCreateTicket(action) {
  const { influencerId, opportunityId, description } = action.payload;
  const token = localStorage.getItem("authUser");
  try {
    const response = yield call(createTicketUrl, { influencerId, opportunityId, description }, token);
    yield put(createTicketSuccess(response.data.result));
  } catch (error) {
    yield put(createTicketError(error.message || "Failed to create ticket"));
  }
}

function* onUpdateTicket(action) {
  const { influencerId, opportunityId, couponCode ,id } = action.payload;
  const token = localStorage.getItem("authUser");
  try {
    const response = yield call(updateTicketUrl, { influencerId, opportunityId, couponCode ,id }, token);
    yield put(updateTicketSuccess(response.data));
  } catch (error) {
    yield put(updateTicketError(error.response?.data || "Failed to update ticket"));
  }
}

function* opportunitySaga() {
  yield takeEvery(GET_OPPORTUNITY_REQUEST, fetchOpportunity);
  yield takeEvery(CREATE_OPPORTUNITY_REQUEST, onAddOpportunity);
  yield takeEvery(DELETE_OPPORTUNITY_REQUEST, onDeleteOpportunity);
  yield takeEvery(UPDATE_OPPORTUNITY_REQUEST, onUpdateOpportunity);
  yield takeEvery(UPLOAD_OPPORTUNITY_IMAGE_REQUEST, onUploadOpportunityImage);
  yield takeEvery(REMOVE_OPPORTUNITY_IMAGE_REQUEST, onRemoveOpportunityImage);
  yield takeEvery(FETCH_TICKETS_REQUEST, onFetchTickets);
  yield takeEvery(CREATE_TICKET_REQUEST, onCreateTicket);
  yield takeEvery(UPDATE_TICKET_REQUEST, onUpdateTicket);
}

export default opportunitySaga;
