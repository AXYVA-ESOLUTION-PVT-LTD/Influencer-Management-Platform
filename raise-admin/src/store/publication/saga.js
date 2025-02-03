import { call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import STATUS from "../../constants/status";
import {
  createPublicationSuccess,
  createPublicationError,
  deletePublicationSuccess,
  deletePublicationError,
  getPublication,
  getPublicationSuccess,
  getPublicationError,
  updatePublicationSuccess,
  updatePublicationError,
  updatePublicationStatusError,
  updatePublicationStatusSuccess,
} from "./actions";
import {
  CREATE_PUBLICATION_REQUEST,
  DELETE_PUBLICATION_REQUEST,
  GET_PUBLICATION_REQUEST,
  UPDATE_PUBLICATION_REQUEST,
  UPDATE_PUBLICATION_STATUS_REQUEST,
} from "./actionTypes";
import { createPublicationUrl, deletePublicationUrl, readPublicationUrl, updatePublicationStatusUrl, updatePublicationUrl } from "../../services/publication";
function* fetchPublication(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(readPublicationUrl, token, action.payload);
    if (response?.status === STATUS.SUCCESS) {
      yield put(getPublicationSuccess(response?.result));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to fetch publications. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      getPublicationError(
        error.message || "Failed to fetch publications. Please try again later."
      )
    );
  }
}

function* createPublicationSaga(action) {
  const id = toast.loading("Creating Publication...");
  try {
    const token = localStorage.getItem("authUser");
 
    const payload = {
      opportunityId: action.payload.selectedTicket.opportunity._id,
      type: action.payload.publicationType,
      publicationLink: action.payload.publicationLink,
    };
    
    const response = yield call(createPublicationUrl, token, payload);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || "Publication created successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(createPublicationSuccess(response?.result?.data));
      yield put(getPublication());
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to create publication. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      createPublicationError(
        error.message || "Failed to create publication. Please try again later."
      )
    );
    toast.update(id, {
      render: error.message || "Failed to create publication",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* updatePublicationSaga(action) {
  const id = toast.loading("Updating Publication...");
  try {
    const token = localStorage.getItem("authUser");
    
    const { _id: publicationId, opportunityId, type, publicationLink, image , status} = action.payload;
    const formData = new FormData();
    formData.append("opportunityId", opportunityId);
    formData.append("type", type);
    formData.append("publicationLink", publicationLink);
    formData.append("image", image);
    formData.append("status",status);
    
    const response = yield call(updatePublicationUrl, publicationId, formData, token);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || "Publication updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updatePublicationSuccess(response?.result?.data));
      yield put(getPublication());
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to update publication. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      updatePublicationError(
        error.message || "Failed to update publication. Please try again later."
      )
    );
    toast.update(id, {
      render: error.message || "Failed to update publication",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* deletePublicationSaga(action) {
  const id = toast.loading("Deleting Publication...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(deletePublicationUrl, token, action.payload._id);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || "Publication deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(deletePublicationSuccess(response?.result?.data));
      yield put(getPublication());
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to delete publication. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      deletePublicationError(
        error.message || "Failed to delete publication. Please try again later."
      )
    );
    toast.update(id, {
      render: error.message || "Failed to delete publication",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* updatePublicationStatusSaga(action) {
  const id = toast.loading("Updating Publication Status...");
  try {
    const token = localStorage.getItem("authUser");
    const { _id : publicationId , status } = action.payload;
    const requestData = { status };
    const response = yield call(updatePublicationStatusUrl, publicationId, requestData, token);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || "Publication status updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
  
      yield put(updatePublicationStatusSuccess(response?.result?.data));
      yield put(getPublication());
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to update publication status. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      updatePublicationStatusError(
        error.message || "Failed to update publication status. Please try again later."
      )
    );
    toast.update(id, {
      render: error.message || "Failed to update publication status",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}


function* PublicationSaga() {
  yield takeEvery(GET_PUBLICATION_REQUEST, fetchPublication);
  yield takeEvery(CREATE_PUBLICATION_REQUEST, createPublicationSaga);
  yield takeEvery(UPDATE_PUBLICATION_REQUEST, updatePublicationSaga);
  yield takeEvery(DELETE_PUBLICATION_REQUEST, deletePublicationSaga);
  yield takeEvery(UPDATE_PUBLICATION_STATUS_REQUEST, updatePublicationStatusSaga);
}

export default PublicationSaga;