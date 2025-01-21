import http from '@utils/http';
import { UpdateUserParams, UserUpdatePasswordParams } from '../interfaces/user';

export const getUserInfo = () => {
  return http.get('/user/info');
};

export const updateUserInfo = (data: UpdateUserParams) => {
  return http.post('/user/update', data);
};

export const updateUserPassword = (data: UserUpdatePasswordParams) => {
  return http.post('/user/update-password', data);
};

export const getUserList = (data: {
  username?: string;
  email?: string;
  phoneNumber?: string;
  nickName?: string;
  page?: number;
  pageSize?: number;
}) => {
  return http.get('/user/list', { params: data });
};


export const freezeUser = (id: string) => {
  return http.post('/user/freeze', { id });
};
