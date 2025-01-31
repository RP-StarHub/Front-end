import {
  ApplicationStatus,
  DURATION, 
  LikeDto, 
  Meeting,
  MeetingDetail,
  RecruitmentType, 
  Sort, 
  UserType
} from "../models/meeting";
import { ApiResponse } from "./response";

// Request
export interface CreateMeetingRequest {
  recruitmentType: RecruitmentType;
  maxParticipants: number;
  duration: DURATION;
  endDate: string;
  location: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  goal: string;
  otherInfo: string;
  techStackIds: number[];
  otherTechStacks: string[];
}

export interface PatchMemberRequest {
  applicationIds: number[];
}

export interface PatchMeetingRequest {
  recruitmentType?: RecruitmentType;
  maxParticipants?: number;
  duration?: DURATION;
  endDate?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  title?: string;
  description?: string;
  goal?: string;
  otherInfo?: string;
  techStacks?: number[];
  otherTechStack?: string[];
}

// Response
export interface MeetingInfo {
  id: number;
  recruitmentType: RecruitmentType;
  maxParticipants: number;
  duration: DURATION;
  endDate: string;
  location: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  goal: string;
  otherInfo: string;
  techStacks: string[];
  updatedAt: string;
  creator: {
    nickname: string;
    profileImage: string;
  }
}

export interface MeetingList {
  content: Meeting[];
  pageable: {
    sort: Sort;
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  },
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface MeetingDetailInfo {
  userType: UserType;
  isApplication?: boolean;
  applicationStatus?: ApplicationStatus;
  postInfo: MeetingDetail;
  likeDto: LikeDto;
}

export interface MeetingMemberInfo {
  name: string;
  profileImage: string;
  nickname: string;
  age: number;
  bio: string;
  phoneNumber: string;
  email: string;
}

export type CreateMeetingResponse = ApiResponse<MeetingInfo>;
export type GetMeetingListResponse = ApiResponse<MeetingList>;
export type GetMeetingDetailResponse = ApiResponse<MeetingDetailInfo>;
export type PatchMeetingResponse = ApiResponse<MeetingDetail>;
export type PatchMeetingMemberResponse = ApiResponse<MeetingMemberInfo[]>;
export type GetMeetingMemberResponse = ApiResponse<MeetingMemberInfo[]>;