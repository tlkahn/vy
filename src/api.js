import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const CABLE_BASE_URL = 'http://localhost:3333/api';

export const api = axios.create({ baseURL: API_BASE_URL });
export const cable_api = axios.create({ baseURL: CABLE_BASE_URL });

export const getToken = () => localStorage.getItem('jwtToken')?.slice(7);

const setAuthHeader = (config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

api.interceptors.request.use(setAuthHeader);
cable_api.interceptors.request.use(setAuthHeader);

export default api;
