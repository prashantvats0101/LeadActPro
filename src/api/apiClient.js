// import axios from 'axios';
// import { API_BASE_URL } from './../utils/constant';
// import { getToken } from './../utils/storage';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });



// export default apiClient;


// apiClient.js

import axios from 'axios';

import { API_BASE_URL } from './../utils/constant';
import { getUserData } from './../components/EncryptedStorageUtil'
import { useEffect } from 'react';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getUserData("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Define common API methods
const _get = (url, config) => {
  return apiClient.get(url, config);
};

const _delete = (url, config = {}) => {
  return apiClient.delete(url, config);
};

const _put = (url, data = {}, config = {}) => {
  return apiClient.put(url, data, config);
};

const _post = (url, data = {}, config = {}) => {
  return apiClient.post(url, data, config);
};

// Export API methods
export { _get, _delete, _put, _post };
