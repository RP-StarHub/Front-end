import { DURATION, LikeDto, Meeting, MeetingDetail, RecruitmentType, Sort } from "../models/meeting";
import { ApiResponse } from "./response";

// Request
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
  isApplicant: boolean;
  applicationStatus: boolean;
  postInfo: MeetingDetail;
  likeDto: LikeDto;
}

export type GetMeetingListResponse = ApiResponse<MeetingList>;
export type GetMeetingDetailResponse = ApiResponse<MeetingDetailInfo>;
export type PatchMeetingResponse = ApiResponse<MeetingDetail>;