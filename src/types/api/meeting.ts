import { Meeting, Sort } from "../models/meeting";
import { ApiResponse } from "./response";

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

export type GetMeetingListResponse = ApiResponse<MeetingList>;