import { ApiResponse } from "./response";

// Request
export type RegisterUserRequest = {
  loginId: string;
  password: string;
  name: string;
  age: number;
  email: string;
  phoneNum: string;
  introduction: string;
}

export type LoginUserRequest = {
  loginId: string;
  password: string;
}

// Response
export type UserInfo = {
  loginId: string;
  email: string;
  introduction: string;
  phoneNum: string;
  age: number;
  name: string;
  userId: number;
}

export type PostUserLogin = ApiResponse<UserInfo>;
export type PostUserRegister = ApiResponse<UserInfo>;