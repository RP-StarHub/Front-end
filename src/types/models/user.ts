export interface User {
  userId: number;
  loginId: string;
  name: string;
  email: string;
  phoneNum: string;
  introduction: string;
  age: number;
}

export interface UserInfo {
  username: string;
  nickname: string | null;
  isProfileComplete: boolean;
}