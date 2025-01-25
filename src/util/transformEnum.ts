import { DURATION, Meeting, RecruitmentType } from "../types/models/meeting";

type ApiMeeting = {
  id: number;
  title: string;
  recruitmentType: string;
  maxParticipants: number;
  duration: string;
  endDate: string;
  techStacks: string[];
  location: string;
  latitude: number;
  longitude: number;
  likeDto: {
    likeCount: number;
    isLiked: boolean;
  };
}

const transformEnumMeeting = (data: ApiMeeting): Meeting => ({
  ...data,
  recruitmentType: RecruitmentType[data.recruitmentType as keyof typeof RecruitmentType],
  duration: DURATION[data.duration as keyof typeof DURATION]
});

export default transformEnumMeeting;