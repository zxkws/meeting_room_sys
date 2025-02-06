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

export interface UserData {
  id: string;
  username: string;
  email: string;
  nickName: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
}

export const getUserList = (data: {
  username?: string;
  email?: string;
  phoneNumber?: string;
  nickName?: string;
  page?: number;
  pageSize?: number;
}): Promise<{total: number; users: Array<UserData>}> => {
  return http.post('/user/list', data);
};


export const freezeUser = (id: string) => {
  return http.post('/user/freeze', { id });
};
