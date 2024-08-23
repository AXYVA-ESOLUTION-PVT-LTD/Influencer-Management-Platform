import {
  ADD_ROLE,
  ADD_ROLE_SUCCESS,
  ADD_ROLE_FAIL,
  DELETE_ROLE,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAIL,
  GET_ROLE,
  GET_ROLE_SUCCESS,
  GET_ROLE_FAIL,
  UPDATE_ROLE,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,
  GET_SPECIFIC_ROLE,
  GET_SPECIFIC_ROLE_SUCCESS,
  GET_SPECIFIC_ROLE_FAIL,
} from "./actionTypes";

export const getRole = () => ({
  type: GET_ROLE,
});

export const getRoleSuccess = (role) => ({
  type: GET_ROLE_SUCCESS,
  payload: role,
});

export const getRoleFail = error => ({
  type: GET_ROLE_FAIL,
  payload: error,
});

export const addNewRole = role => ({
  type: ADD_ROLE,
  payload: role,
});

export const addRoleSuccess = role => ({
  type: ADD_ROLE_SUCCESS,
  payload: role,
});

export const addRoleFail = error => ({
  type: ADD_ROLE_FAIL,
  payload: error,
});

export const updateRole = role => ({
  type: UPDATE_ROLE,
  payload: role,
});

export const updateRoleSuccess = role => ({
  type: UPDATE_ROLE_SUCCESS,
  payload: role,
});

export const updateRoleFail = error => ({
  type: UPDATE_ROLE_FAIL,
  payload: error,
});

export const deleteRole = roleId => ({
  type: DELETE_ROLE,
  payload: roleId,
});

export const deleteRoleSuccess = roleId => ({
  type: DELETE_ROLE_SUCCESS,
  payload: roleId,
});

export const deleteRoleFail = error => ({
  type: DELETE_ROLE_FAIL,
  payload: error,
});

export const getRoleDetail = roleId => ({
  type: GET_SPECIFIC_ROLE,
  roleId,
});

export const getRoleDetailSuccess = roleDetails => ({
  type: GET_SPECIFIC_ROLE_SUCCESS,
  payload: roleDetails,
});

export const getRoleDetailFail = error => ({
  type: GET_SPECIFIC_ROLE_FAIL,
  payload: error,
});
