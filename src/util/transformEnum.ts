import { BaseMeeting, DURATION, RecruitmentType } from "../types/models/meeting";

type ApiMeeting = {
  id: number;
  title: string;
  recruitmentType: string;
  maxParticipants: number;
  duration: string;
  endDate: string;
  techStacks: number[];
  location: string;
  latitude: number;
  longitude: number;
};

const transformEnumMeeting = (data: ApiMeeting): BaseMeeting => ({
  ...data,
  recruitmentType: RecruitmentType[data.recruitmentType as keyof typeof RecruitmentType],
  duration: DURATION[data.duration as keyof typeof DURATION]
});

export default transformEnumMeeting;