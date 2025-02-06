import http from '@utils/http';
import { LoginResponse } from '@/interfaces/auth';

export const login = (data: { username: string; password: string }) => {
  return http.post<LoginResponse>('/user/login', data).then((res: unknown) => {
    const { accessToken, refreshToken, userInfo } = res as LoginResponse;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    return res as LoginResponse;
  });
};

export const register = (data: { username: string; password: string; email: string; captcha: string }) => {
  return http.post('/user/register', data);
};

export const getCaptcha = (email: string) => {
  return http.get('/user/register-captcha', { params: { address: email } });
};

export const updatePassword = (data: { password: string; captcha: string }) => {
  return http.post('/user/update-password', data);
};

export const refreshToken = (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  return http.get('/user/refresh-token', { params: { refreshToken } });
};

export const logout = () => {
  return http.post('/user/logout');
};
