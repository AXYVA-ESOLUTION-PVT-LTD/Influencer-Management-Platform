import {
  GET_ROLE_FAIL,
  GET_ROLE_SUCCESS,
  ADD_ROLE_SUCCESS,
  ADD_ROLE_FAIL,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAIL,
  GET_SPECIFIC_ROLE_FAIL,
  GET_SPECIFIC_ROLE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  roles: [],
  roleDetail: {},
  error: {},
};

const role = (state = INIT_STATE, action) => {
  switch (action.type) {
  
    case GET_ROLE_SUCCESS:
      return {
        ...state,
        roles: action.payload,
      };

    case GET_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ROLE_SUCCESS:
      return {
        ...state,
        roles: [...state.roles, action.payload],
      };

    case ADD_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        roles: state.roles.map(role =>
          role.id.toString() === action.payload.id.toString()
            ? { ...role, ...action.payload }
            : role
        ),
      };

    case UPDATE_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ROLE_SUCCESS:
      return {
        ...state,
        roles: state.roles.filter(
          role => role.id.toString() !== action.payload.toString()
        ),
      };

    case DELETE_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SPECIFIC_ROLE_SUCCESS:
      return {
        ...state,
        roleDetail: action.payload,
      };

    case GET_SPECIFIC_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default role;
