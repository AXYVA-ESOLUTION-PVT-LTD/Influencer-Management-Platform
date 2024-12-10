// Auth
export const SIGNUP_API = '/user/signUp';

export const LOGIN_API = "/user/login";

export const FORGET_PASSWORD_API = "/user/forgotPassword";

export const OTP_VERIFICATION_API = "/user/OTPVerfication";

export const SET_NEW_PASSWORD_API = "/user/changePassword";

// Reset Password API method
export const RESET_PASSWORD_API = "/user/resetPassword";

// Role CRUD
export const CREATE_ROLE_API = "/role/addRole";

export const READ_ROLE_API = "/role/getRoles";

export const READ_ROLE_DETAIL_API = (id) => `/role/getRoleById/${id}`;

export const UPDATE_ROLE_API = (id) => `/role/updateRoleById/${id}`;

export const DELETE_ROLE_API = (id) => `/role/deleteRoleById/${id}`;

// Influencers CRUD methods

export const CREATE_INFLUENCER_API = "/influencer/addInfluencer";

export const READ_INFLUENCERS_API = "/influencer/getInfluencers";

export const READ_SPECIFIC_INFLUENCER_API = (id) => `/influencer/getInfluencerById/${id}`;

export const UPDATE_INFLUENCER_API = (id) => `/influencer/updateInfluencerById/${id}`;

export const DELETE_INFLUENCER_API = (id) => `/influencer/deleteInfluencerById/${id}`;