import { ApiResponse } from "./response";

export type LoginUserRequest = {
  loginId: string;
  password: string;
}

export type RegisterUserRequest = {
  loginId: string;
  password: string;
  name: string;
  age: number;
  email: string;
  phoneNum: string;
  introduction: string;
}

export type UserResponse = {
  loginId: string;
  email: string;
  introduction: string;
  phoneNum: string;
  age: number;
  name: string;
}

export type PostUserLogin = ApiResponse<UserResponse>;
export type PostUserRegister = ApiResponse<UserResponse>;
export type GetUserMe = ApiResponse<UserResponse>;