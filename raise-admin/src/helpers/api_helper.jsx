import axios from "axios";

export const API_URL = import.meta.env.VITE_APP_BASE_URL;

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && (error.response.status === 403 )) {

        const refreshToken = localStorage.getItem("authUser");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await axios.post(
          `${API_URL}/refresh-token`, 
          {}, 
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        
        const newAccessToken = refreshResponse.data.result.accessToken;
        
        localStorage.setItem("authUser", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosApi(originalRequest);
    }
    return Promise.reject(error);
  }
);

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

export async function post(url, data, config = {}) {

  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function postForm(url, data, config = {}) {
  return axiosApi
    .post(url, data, { ...config })
    .then((response) => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}

export async function patch(url, data, config = {}) {
  return axiosApi
    .patch(url, { ...data }, { ...config })
    .then((response) => response.data);
}
