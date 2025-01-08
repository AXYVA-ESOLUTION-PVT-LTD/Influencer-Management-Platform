import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
  UPDATE_USERNAME,
  UPDATE_USERNAME_SUCCESSFUL,
  UPDATE_USERNAME_FAILED,
  FETCH_COUNTRIES,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_FAILURE,
  FETCH_CITIES,
  FETCH_CITIES_SUCCESS,
  FETCH_CITIES_FAILURE,
} from "./actionTypes";

const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  user: null,
  isAuthenticated: false,
  token: null,
  userRole: null,
  userPermissions: null,
  userProfile: null,
  updateUsernameError: null,
  countries: [],
  cities: [],
  loadingCountries: false,
  loadingCities: false,
  countryError: null,
  cityError: null,
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        loading: true,
        registrationError: null,
      };
    case REGISTER_USER_SUCCESSFUL:
      return {
        ...state,
        loading: false,
        user: action.payload,
        registrationError: null,
      };
    case REGISTER_USER_FAILED:
      return {
        ...state,
        user: null,
        loading: false,
        registrationError: action.payload,
      };
    case FETCH_COUNTRIES:
      return {
        ...state,
        loadingCountries: true,
        countryError: null,
      };
    case FETCH_COUNTRIES_SUCCESS:
      return {
        ...state,
        loadingCountries: false,
        countries: action.payload,
      };
    case FETCH_COUNTRIES_FAILURE:
      return {
        ...state,
        loadingCountries: false,
        countryError: action.payload,
      };
    case FETCH_CITIES:
      return {
        ...state,
        loadingCities: true,
        cityError: null,
      };
    case FETCH_CITIES_SUCCESS:
      return {
        ...state,
        loadingCities: false,
        cities: action.payload,
      };
    case FETCH_CITIES_FAILURE:
      return {
        ...state,
        loadingCities: false,
        cityError: action.payload,
      };
    case UPDATE_USERNAME:
      return {
        ...state,
        loading: true,
        updateUsernameError: null,
      };
    case UPDATE_USERNAME_SUCCESSFUL:
      return {
        ...state,
        loading: false,
        user: action.payload,
        updateUsernameError: null,
      };
    case UPDATE_USERNAME_FAILED:
      return {
        ...state,
        loading: false,
        updateUsernameError: action.payload,
      };
    default:
      return { ...state };
  }
};

export default account;
