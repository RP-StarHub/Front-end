import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetMeetingListResponse } from "../../types/api/meeting"
import { meetingService, mockMeetingService } from "../../services/api/meeting";

export const useMeetingList = (page: number) => {
  const queryOptions: UseQueryOptions<GetMeetingListResponse> = {
    queryKey: ['meetings', page],
    queryFn: async () => {
      const response = await meetingService.getMeetingList(page - 1);
      return response.data
    },
    // 데이터가 바로 만료되도록 설정 (새로고침 시 항상 새 데이터 fetch)
    staleTime: 0,
    // 새 데이터 로딩 중에 이전 데이터 표시
    placeholderData: (previousData) => previousData,
  };
  return useQuery<GetMeetingListResponse>(queryOptions);

  // return useQuery<GetMeetingListResponse>({
  //   queryKey: ['meetings'],
  //   queryFn: async () => {
  //     const response = await mockMeetingService.getMeetingList(0);
  //     return response.data
  //   }
  // });
};