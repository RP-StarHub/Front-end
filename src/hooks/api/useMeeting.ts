import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { GetMeetingListResponse, PatchMeetingRequest } from "../../types/api/meeting"
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

export const useMeetingDetail = (id: number) => {
  // 목업용
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: async () => {
      const response = await mockMeetingService.getMeetingDetail(id);
      return response.data
    }
  })
};

export const useMeetingPatch = () => {
  // 목업
  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: PatchMeetingRequest }) => 
      mockMeetingService.patchMeeting(id, data),
  });
};

export const useMeetingDelete = () => {
  // 목업
  return useMutation({
    mutationFn: (id: number) => mockMeetingService.deleteMeeting(id),
  });
};