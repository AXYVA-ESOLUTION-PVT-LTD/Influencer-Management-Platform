import { del, get, post, put } from "../../helpers/api_helper";
import { CREATE_INFLUENCER_API, CREATE_ROLE_API, DELETE_INFLUENCER_API, DELETE_ROLE_API, FORGET_PASSWORD_API, LOGIN_API, OTP_VERIFICATION_API, READ_INFLUENCERS_API, READ_ROLE_API, READ_ROLE_DETAIL_API, READ_SPECIFIC_INFLUENCER_API, RESET_PASSWORD_API, SET_NEW_PASSWORD_API, SIGNUP_API, UPDATE_INFLUENCER_API, UPDATE_ROLE_API } from "../constants";

// const baseUrl = import.meta.env.VITE_APP_base_url;
export const SignupApi = data => post(SIGNUP_API, data);

export const LoginApi = data => post(LOGIN_API, data);

export const ForgetPasswordApi = data => post(FORGET_PASSWORD_API, data);

export const OTPVerificationApi = data => post(OTP_VERIFICATION_API, data);

export const SetNewPasswordApi = data => post(SET_NEW_PASSWORD_API, data);

export const ResetPasswordApi = data => post(RESET_PASSWORD_API, data);
// Role
export const createRole = (data) => post(CREATE_ROLE_API, data);

export const readRoles = () => post(READ_ROLE_API);

export const readRoleDetail = (id) => get(READ_ROLE_DETAIL_API(id));

export const updateRole = (data) => post(UPDATE_ROLE_API(data._id), data);

export const deleteRole = (id) => get(DELETE_ROLE_API(id));

//Influencersexport const createInfluencers = (data) => post(CREATE_INFLUENCER_API, data);

export const readInfluencers = () => post(READ_INFLUENCERS_API);

export const readInfluencersDetail = (id) => get(READ_SPECIFIC_INFLUENCER_API(id));

export const updateInfluencers = (data) => post(UPDATE_INFLUENCER_API(data._id), data);

export const deleteInfluencers = (id) => get(DELETE_INFLUENCER_API(id));


