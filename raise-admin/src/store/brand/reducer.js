import {
  ADD_BRAND,
  ADD_BRAND_FAIL,
  ADD_BRAND_SUCCESS,
  GET_BRAND,
  GET_BRAND_FAIL,
  GET_BRAND_SUCCESS,
  UPDATE_BRAND,
  UPDATE_BRAND_FAIL,
  UPDATE_BRAND_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  brands: [],
  totalBrands: null,
  loading: false,
  error: {},
};

const brand = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BRAND:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_BRAND_SUCCESS:
      return {
        ...state,
        brands: [...action.payload.brands],
        totalBrands: action.payload.totalBrands,
        loading: false,
        error: null,
      };
    case GET_BRAND_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_BRAND:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_BRAND_SUCCESS:
      return {
        ...state,
        brands: [...state.brands, action.payload],
        loading: false,
      };
    case ADD_BRAND_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case UPDATE_BRAND:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_BRAND_SUCCESS:
      const { _id: updatedBrandId } = action.payload;
      return {
        ...state,
        brands: state.brands.map((brand) =>
          brand._id === updatedBrandId ? { ...action.payload } : brand
        ),
        loading: false,
      };
    case UPDATE_BRAND_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default brand;
