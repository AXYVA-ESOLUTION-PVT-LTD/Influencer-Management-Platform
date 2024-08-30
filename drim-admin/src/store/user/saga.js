import { call, put, takeEvery } from "redux-saga/effects";

import { updateProfileError, updateProfileSuccess } from "./actions";
import { UPDATE_PROFILE_REQUEST } from "./actionTypes";
import { toast } from "react-toastify";
import { updateProfileUrl } from "../../services/user";

function* onUpdateProfile(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateProfileUrl, token, action.payload);
    if (response?.result?.data?.updatedUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(response.result.data.updatedUser)
      );
      yield put(updateProfileSuccess(response?.result?.data));
      toast.success("Profile update successfully");
    } else {
      toast.error(response.result.message);
      throw new Error("fail to update user");
    }
  } catch (error) {
    yield put(updateProfileError(error));
  }
}

function* userSaga() {
  yield takeEvery(UPDATE_PROFILE_REQUEST, onUpdateProfile);
}

export default userSaga;
