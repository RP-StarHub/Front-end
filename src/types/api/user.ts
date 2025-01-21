import { ApiResponse, ApiErrorResponse } from "./response";

// Request
export interface RegisterUserRequest {
  username: string;
  password: string;
}

export interface CheckUsernameRequest {
  username: string;
}

export interface CreateProfileRequest {
  profileImage?: File;
  nickname: string;
  name: string;
  age: number;
  bio: string;
  email: string;
  phoneNum: string;
}

export interface LoginUserRequest {
  username: string;
  password: string;
}

// Response Data (API response의 data 필드에 들어갈 타입들)
export interface RegisterUserData {
  username: string;
  isProfileComplete: boolean;
}

export interface CheckUsernameData {
  username: string;
  available: boolean;
}

export interface ProfileData {
  id: number;
  nickname: string;
}

export interface LoginUserData {
  username: string;
  nickname: string;
  isProfileComplete: boolean;
  accessToken: string;
  refreshToken: string;
}

// API Response (실제 API 응답 타입)
export type PostUserRegister = ApiResponse<RegisterUserData>;
export type PostUserCheckUsername = ApiResponse<CheckUsernameData>;
export type PostUserProfileCreate = ApiResponse<ProfileData>;
export type PostUserLogin = ApiResponse<LoginUserData>;
export type PostUserLogout = ApiResponse<null>;
export type PostTokenReissue = ApiResponse<{
  accessToken: string;
  refreshToken: string;
}>;

// API Error Response
export type PostUserRegisterError = ApiErrorResponse;