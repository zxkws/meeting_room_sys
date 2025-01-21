export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  id: number;
  username: string;
  nickName: string;
  email: string;
  headPic: string;
  phoneNumber: string;
  isFrozen: boolean;
  isAdmin: boolean;
  createTime: Date;
  roles: string[];
  permissions: string[];
}
