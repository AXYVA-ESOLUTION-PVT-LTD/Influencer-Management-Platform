import { call, put, takeEvery } from "redux-saga/effects";

import { updateProfileError, updateProfileSuccess } from "./actions";
import { UPDATE_PROFILE_REQUEST } from "./actionTypes";
import { toast } from "react-toastify";
import { updateProfileUrl } from "../../services/user";
import STATUS from "../../constants/status";

function* onUpdateProfile(action) {
  const toastId = toast.loading("Updating Profile...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateProfileUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      const updatedUser = response?.result?.data?.updatedUser;
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      yield put(updateProfileSuccess(response?.result?.data));
      toast.update(toastId, {
        render: response?.result?.message || "Profile updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
    } else {
      throw new Error(response?.result?.message || 'Failed to update profile. Please try again later.');
    }
  } catch (error) {
    yield put(updateProfileError(error.message || 'Failed to update profile. Please try again later.'));
    toast.update(toastId, {
      render: error.message || 'Failed to update profile',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* UserSaga() {
  yield takeEvery(UPDATE_PROFILE_REQUEST, onUpdateProfile);
}

export default UserSaga;
