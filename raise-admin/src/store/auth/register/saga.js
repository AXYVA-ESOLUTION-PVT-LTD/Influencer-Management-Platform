import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { FETCH_CITIES, FETCH_COUNTRIES, REGISTER_USER, UPDATE_USERNAME } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed, updateUserNameFailed, updateUserNameSuccessful, fetchCountriesSuccess, fetchCountriesFailure, fetchCitiesSuccess, fetchCitiesFailure } from "./actions"

import { fetchCitiesApi, fetchCountriesApi, SignupApi, updateUserNameApi } from "../../../services/index"
import STATUS from "../../../constants/status";

function* registerUser({ payload: { user } }) {
  try {
    const response = yield call(SignupApi, user);
    
    if (response?.status === STATUS.SUCCESS) {
      yield put(registerUserSuccessful(response?.result?.message));
      localStorage.setItem('authUser',response?.result?.token);
    } 
    else {
      const combinedMessage = response.result.details.join("\n");

      throw new Error(combinedMessage || "Failed to register. Try again.");
      // throw new Error(response?.result?.message || "Failed to send OTP. Try again.");
    }
  } catch (error) {
    yield put(registerUserFailed(error.message || 'Please try again later.'));
  }
}

function* updateUserName({ payload: { userId, username, platform , history } }) {
  try {
    const response = yield call(updateUserNameApi, userId, username, platform);
    
    if (response?.status === "Success") {
      yield put(updateUserNameSuccessful(response?.result?.data?.user));
      localStorage.setItem("authUser", response.result.data.token);
      localStorage.setItem("user", JSON.stringify(response.result.data.user));
      history("/overview/influencer");
    } else {
      if(response?.result?.details && 
        Array.isArray(response.result.details)){
          const combinedMessage = response.result.details.join("\n");
          throw new Error(combinedMessage);
        }
        else{
          throw new Error(response?.result?.message || "Failed to update username.");
        }
    }
  } catch (error) {
    yield put(updateUserNameFailed(error.message || 'Failed to update username. Please try again later.'));
  }
}

function* fetchCountriesSaga() {
  try {
    const response = yield call(fetchCountriesApi);
    
    const countries = response.map((country) => ({
      name: country.name.common,
      code: country.cca2,
    }));
    yield put(fetchCountriesSuccess(countries));
  } catch (error) {
    yield put(fetchCountriesFailure("Error fetching countries"));
  }
}

function* fetchCitiesSaga(action) {
  try {
    const response = yield call(fetchCitiesApi,action.payload);
    const citiesList = response?.geonames;
    yield put(fetchCitiesSuccess(citiesList));
  } catch (error) {
    yield put(fetchCitiesFailure("Error fetching cities"));
  }
}

function* AccountSaga() {
  yield takeEvery(REGISTER_USER, registerUser)
  yield takeEvery(UPDATE_USERNAME, updateUserName)
  yield takeEvery(FETCH_COUNTRIES, fetchCountriesSaga);
  yield takeEvery(FETCH_CITIES, fetchCitiesSaga);
}

export default AccountSaga
