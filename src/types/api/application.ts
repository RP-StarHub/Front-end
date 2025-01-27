import { Application } from "../models/application";
import { ApiResponse } from "./response";

// Request
export interface PostApplicationRequest {
  content: string;
}

export interface PatchApplicationRequest {
  content: string;
}

// Response
export interface ApplicationInfo extends Application {
}

export type PostApplicationResponse = ApiResponse<ApplicationInfo>;
export type GetApplicationListResponse = ApiResponse<ApplicationInfo[]>;
export type GetApplicationMeResponse = ApiResponse<ApplicationInfo>;
export type PatchApplicationResponse = ApiResponse<ApplicationInfo>;