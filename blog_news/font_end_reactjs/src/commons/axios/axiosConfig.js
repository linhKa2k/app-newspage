import axios from "axios";
import authService from "../../redux/features/auth/authService";
let isAlreadyFetchingAccessToken = false
export const instance = axios.create({
  baseURL: 'http://localhost:3800/',
  timeout: 300000,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Cache: "no-cache",
  },
  withCredentials: true,
  credentials: 'include',
  timeout: 60000
})

instance.interceptors.response.use(response => {
  return response;
}, async function (error) {
  const { config, response: { status } } = error;
  if (status === 401 && !config._retry) {
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true
      const result = await authService.rftoken();
      if (result.message === 'create new token') {
        config._retry = true;
        isAlreadyFetchingAccessToken = false
        return await instance(config);
      } else {
        localStorage.setItem('persist:auth', false);
        isAlreadyFetchingAccessToken = false
      }
    }
  }
  else {
    return Promise.reject(error);
  }
});