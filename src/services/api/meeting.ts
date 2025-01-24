import { GetMeetingListResponse } from "../../types/api/meeting";
import { axiosInstance } from "./axios"

export const meetingService = {
  getMeetingList: (page: number) => {
    return axiosInstance.get<GetMeetingListResponse>(
      '/api/meetings/list',
      {
        params: { page }
      }
    );
  }
}