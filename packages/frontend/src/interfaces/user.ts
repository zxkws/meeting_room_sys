export interface UpdateUserParams {
  nickname?: string;
  email: string;
  phoneNumber?: string;
  headPic?: string;
  captcha: string;
}

export interface UserUpdatePasswordParams {
  password: string;
  captcha: string;
}
