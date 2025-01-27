export enum RecruitmentType {
  STUDY = "STUDY",
  PROJECT = "PROJECT",
}

export enum DURATION {
  ONE_WEEK = "ONE_WEEK",
  TWO_WEEKS = "TWO_WEEKS",
  ONE_MONTH = "ONE_MONTH",
  TWO_MONTHS = "TWO_MONTHS",
  THREE_MONTHS = "THREE_MONTHS",
  SIX_MONTHS = "SIX_MONTHS",
  ONE_YEAR = "ONE_YEAR",
  MORE_THAN_ONE_YEAR = "MORE_THAN_ONE_YEAR",
}

export interface BaseMeeting {
  id: number;
  title: string;
  recruitmentType: RecruitmentType;
  maxParticipants: number;
  duration: DURATION;
  endDate: string;
  techStacks: string[];
  location: string;
  latitude: number;
  longitude: number;
}

export interface Meeting extends BaseMeeting {
  likeDto: LikeDto;
}

export interface MeetingDetail extends BaseMeeting {
  description: string;
  goal: string;
  otherInfo: string;
  isConfirmed: boolean;
  creator: {
    username: string;
  }
}

export interface LikeDto {
  likeCount: number;
  isLiked: boolean | null;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}