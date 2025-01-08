import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
  UPDATE_USERNAME,
  UPDATE_USERNAME_SUCCESSFUL,
  UPDATE_USERNAME_FAILED,
  FETCH_CITIES_SUCCESS,
  FETCH_CITIES,
  FETCH_COUNTRIES_FAILURE,
  FETCH_COUNTRIES,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_CITIES_FAILURE,
} from "./actionTypes"

export const registerUser = ( user ) => {
  return {
    type: REGISTER_USER,
    payload: { user  },
  }
}

export const registerUserSuccessful = user => {
  return {
    type: REGISTER_USER_SUCCESSFUL,
    payload: user,
  }
}

export const registerUserFailed = error => {
  return {
    type: REGISTER_USER_FAILED,
    payload: error,
  }
}

export const fetchCountries = () => {
  return {
    type: FETCH_COUNTRIES,
  };
};

export const fetchCountriesSuccess = (countries) => {
  return {
    type: FETCH_COUNTRIES_SUCCESS,
    payload: countries,
  };
};

export const fetchCountriesFailure = (error) => {
  return {
    type: FETCH_COUNTRIES_FAILURE,
    payload: error,
  };
};

export const fetchCities = (countryCode) => {
  return {
    type: FETCH_CITIES,
    payload: countryCode,
  };
};

export const fetchCitiesSuccess = (cities) => {
  return {
    type: FETCH_CITIES_SUCCESS,
    payload: cities,
  };
};

export const fetchCitiesFailure = (error) => {
  return {
    type: FETCH_CITIES_FAILURE,
    payload: error,
  };
};


export const updateUserName = (mergedData ,history) => {
  const userId = localStorage.getItem('authUserId'); 
  return {
    type: UPDATE_USERNAME,
    payload: {
      userId,
      username: mergedData.username,
      platform: mergedData.platform,
      history : history
    },
  };
};

export const updateUserNameSuccessful = user => {
  return {
    type: UPDATE_USERNAME_SUCCESSFUL,
    payload: user,
  };
};

export const updateUserNameFailed = error => {
  return {
    type: UPDATE_USERNAME_FAILED,
    payload: error,
  };
};
