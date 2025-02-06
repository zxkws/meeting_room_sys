import axios from 'axios';
import { refreshToken } from '../services/auth';
import { message } from 'antd';

const instance = axios.create({
  baseURL: process.env.NODE_ENV ? 'https://backend.lookli.nyc.mn/api' : '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  async (error) => {
    const { data, config } = error.response;
    if (data.code === 401 && !config.url.includes('/user/refresh')) {
      const res = await refreshToken(localStorage.getItem('refreshToken') || '');
      if (res.accessToken && res.refreshToken) {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        return axios(config);
      } else {
        localStorage.clear();
        window.location.href = '/meeting_room_sys/login';
      }
    }
    if (data.code === 403) {
      message.error(data.message);
      return Promise.reject(data);
    }
    return error.response;
  },
);

export default instance;
