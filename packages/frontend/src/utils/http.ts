import axios from 'axios';
import { refreshToken } from '../services/auth';
import { message } from 'antd';

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

instance.interceptors.response.use((response) => {
  return response.data.data;
}, async (error) => {
  const { data, config } = error.response;
  if (data.code === 401 && !config.url.includes('/user/refresh')) {
    const res = await refreshToken(localStorage.getItem('refreshToken') || '');
    if (res.status === 200) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      return axios(config);
    } else {
      message.error(res.data);
      localStorage.clear();
      window.location.href = '/login';
    }
  }
  return error.response;
});

export default instance;
