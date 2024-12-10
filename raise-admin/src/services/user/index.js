import { postForm } from "../../helpers/api_helper";
import { UPDATE_PROFILE_URL } from "./routes";

// Update profile
export const updateProfileUrl = (token, data) => {
  return postForm(`${UPDATE_PROFILE_URL}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
