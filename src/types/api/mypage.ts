import { Pageable, Sort } from "../models/common";
import { Meeting } from "../models/meeting";
import { ApiResponse } from "./response";

// Request
export interface UserProfilePatch {
  profileImage?: string;
  nickname?: string;
  name?: string;
  age?: number;
  bio?: string;
  email: string;
  phoneNumber: string;
}

// Response
export interface UserProfile {
  id: number;
  profileImage: string;
  name: string;
  nickname: string;
  age: number;
  phoneNumber: string;
  email: string;
  bio: string;
}

export interface MyMeetingList {
  content: Meeting[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export type GetMyUser = ApiResponse<UserProfile>;
export type GetMyMeetingRecent = ApiResponse<Meeting[]>;
export type GetMyMeetingDetail = ApiResponse<MyMeetingList>;
