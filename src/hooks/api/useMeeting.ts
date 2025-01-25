import { useQuery } from "@tanstack/react-query"
import { GetMeetingListResponse } from "../../types/api/meeting"
import { meetingService, mockMeetingService } from "../../services/api/meeting";

export const useMeetingList = () => {
  return useQuery<GetMeetingListResponse>({
    queryKey: ['meetings'],
    queryFn: async () => {
      const response = await meetingService.getMeetingList(0);
      return response.data
    }
  });

  // return useQuery<GetMeetingListResponse>({
  //   queryKey: ['meetings'],
  //   queryFn: async () => {
  //     const response = await mockMeetingService.getMeetingList(0);
  //     return response.data
  //   }
  // });
};