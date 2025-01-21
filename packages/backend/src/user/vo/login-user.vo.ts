interface UserInfo {
  id: number;
  username: string;
  nickName: string;
  headPic: string;
  phoneNumber: string;
  email: string;
  createTime: Date;
  isFrozen: boolean;
  isAdmin: boolean;
  roles: string[];
  permissions: string[];
}

export class LoginUserVo {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}
