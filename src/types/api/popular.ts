import { Meeting } from "../models/meeting";
import { ApiResponse } from "./response";

export type GetPopularProjectsResponse = ApiResponse<Meeting[]>;
export type GetPopularStudiesResponse = ApiResponse<Meeting[]>;
export type GetPopularExpiringResponse = ApiResponse<Meeting[]>;