import { useMutation, useQuery } from "@tanstack/react-query"
import {
  PostApplicationRequest,
} from "../../types/api/application";
import { mockApplicationService } from "../../services/api/application";

export const useApplicationCreate = () => {
  // 목업
  return useMutation({
    mutationFn: ({ meetingId, data }: { meetingId: number, data: PostApplicationRequest }) =>
      mockApplicationService.postApplication(meetingId, data),
  });
};

export const useApplicationList = (meetingId: number) => {
  // 목업용
  return useQuery({
    queryKey: ['applications', meetingId],
    queryFn: async () => {
      const response = await mockApplicationService.getApplicationList(meetingId);
      return response.data
    }
  });
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