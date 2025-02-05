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
  profileImage: string;
  nickname: string;
  name: string;
  age: number;
  bio: string;
  email: string;
  phoneNumber: string;
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
  profileImage: string;
}

export interface LoginUserData {
  username: string;
  isProfileComplete: boolean;
  nickname?: string;
  profileImage?: string;
  accessToken: string;
  refreshToken: string;
}

// API Response (실제 API 응답 타입)
export type UserRegisterResponse = ApiResponse<RegisterUserData>;
export type UserCheckUsernameResponse = ApiResponse<CheckUsernameData>;
export type UserProfileCreateResponse = ApiResponse<ProfileData>;
export type UserLoginResponse = ApiResponse<LoginUserData>;
export type UserLogoutResponse = ApiResponse<null>;
export type TokenReissueResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
}>;

// API Error Response
export type UserRegisterError = ApiErrorResponse;