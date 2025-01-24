export enum RecruitmentType {
  STUDY = "STUDY",
  PROJECT = "PROJECT",
}

export enum DURATION {
  ONE_WEEK = "1주",
  TWO_WEEKS = "2주",
  ONE_MONTH = "1개월",
  TWO_MONTHS = "2개월",
  THREE_MONTHS = "3개월",
  SIX_MONTHS = "6개월",
  ONE_YEAR = "1년",
  MORE_THAN_ONE_YEAR = "1년 이상",
}

export interface Meeting {
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
  likeDto: LikeDto;
}

export interface LikeDto {
  likeCount: number;
  isLike: boolean;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}