import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_ROLE,
  ADD_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  GET_SPECIFIC_ROLE,
} from "./actionTypes";
import {
  getRoleSuccess,
  getRoleFail,
  addRoleSuccess,
  addRoleFail,
  updateRoleSuccess,
  updateRoleFail,
  deleteRoleSuccess,
  deleteRoleFail,
  getRoleDetailSuccess,
  getRoleDetailFail,
} from "./actions";

import {
  createRole,
  readRoles,
  updateRole,
  deleteRole,
} from "../../services/index";

function* fetchRoles() {
  try {
    const response = yield call(readRoles);
    console.log(response.result.data);
    yield put(getRoleSuccess(response.result.data));
  } catch (error) {
    console.log(error);
    yield put(getRoleFail(error));
  }
}

function* onAddNewRole({ payload: role }) {
  try {
    const response = yield call(createRole, role);
    yield put(addRoleSuccess(response));
  } catch (error) {
    yield put(addRoleFail(error));
  }
}

function* onUpdateRole({ payload: role }) {
  try {
    const response = yield call(updateRole, role);
    yield put(updateRoleSuccess(response));
  } catch (error) {
    yield put(updateRoleFail(error));
  }
}

function* onDeleteRole({ payload: roleId }) {
  try {
    yield call(deleteRole, roleId);
    yield put(deleteRoleSuccess(roleId));
  } catch (error) {
    yield put(deleteRoleFail(error));
  }
}

function* fetchRoleDetail({ roleId }) {
  try {
    const response = yield call(getRoleDetail, roleId);
    yield put(getRoleDetailSuccess(response));
  } catch (error) {
    yield put(getRoleDetailFail(error));
  }
}

function* rolesSaga() {
  yield takeEvery(GET_ROLE, fetchRoles);
  yield takeEvery(ADD_ROLE, onAddNewRole);
  yield takeEvery(UPDATE_ROLE, onUpdateRole);
  yield takeEvery(DELETE_ROLE, onDeleteRole);
  yield takeEvery(GET_SPECIFIC_ROLE, fetchRoleDetail);
}

export default rolesSaga;
