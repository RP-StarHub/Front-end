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

export interface Meeting {
  id: number;
  title: string;
  recruitmentType: RecruitmentType;
  maxParticipants: number;
  duration: DURATION;
  endDate: string;
  techStacks: number[];
  location: string;
  latitude: number;
  longitude: number;
  likeDto: LikeDto;
}

export interface MeetingDetail extends Meeting {
  description: string;
  goal: string;
  otherInfo: string;
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