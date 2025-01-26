import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  PostApplicationRequest,
} from "../../types/api/application";
import { applicationService, mockApplicationService } from "../../services/api/application";
import toast from "react-hot-toast";

export const useApplicationCreate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ meetingId, data }: { meetingId: number, data: PostApplicationRequest }) =>
      applicationService.postApplication(meetingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: () => {
      toast.error('지원서 작성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  });
  
  // 목업
  // return useMutation({
  //   mutationFn: ({ meetingId, data }: { meetingId: number, data: PostApplicationRequest }) =>
  //     mockApplicationService.postApplication(meetingId, data),
  // });
};

export const useApplicationList = (meetingId: number) => {
  return useQuery({
    queryKey: ['applications', meetingId],
    queryFn: async () => {
      const response = await applicationService.getApplicationList(meetingId);
      return response.data;
    },
    staleTime: 0,
    placeholderData: (previousData) => previousData,
  });

  // 목업용
  // return useQuery({
  //   queryKey: ['applications', meetingId],
  //   queryFn: async () => {
  //     const response = await mockApplicationService.getApplicationList(meetingId);
  //     return response.data
  //   }
  // });
};

export const useApplicationMe = (meetingId: number) => {
  // 목업용
  return useQuery({
    queryKey: ['application', meetingId],
    queryFn: async () => {
      const response = await mockApplicationService.getApplicationMe(meetingId);
      return response.data
    }
  });
};

export const useApplicationPatch = () => {
  // 목업
  return useMutation({
    mutationFn: ({ meetingId, data }: { meetingId: number, data: PostApplicationRequest }) =>
      mockApplicationService.patchApplication(meetingId, data),
  });
};

export const useApplicationDelete = () => {
  // 목업
  return useMutation({
    mutationFn: (meetingId: number) => mockApplicationService.deleteApplication(meetingId),
  });
};
