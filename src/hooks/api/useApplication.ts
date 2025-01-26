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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', variables.meetingId] });
      queryClient.invalidateQueries({ queryKey: ['applications', variables.meetingId] });
    },
    onError: (error: any) => {
      const { status, message } = error?.response ?? {};
      switch (status) {
        case 400:
          if (message === 'STUDY_CONFIRMED') {
            toast.error('이미 확정된 모임입니다');
          } else {
            toast.error('잘못된 요청입니다');
          }
          break;
        case 409:
          if (message === 'MEETING_CREATOR_CANNOT_APPLY') {
            toast.error('자신이 개설한 모임에는 지원할 수 없습니다');
          } else if (message === 'DUPLICATE_APPLICATION') {
            toast.error('이미 지원한 모임입니다');
          }
          break;
        default:
          toast.error('지원서 작성에 실패했습니다. 잠시 후 다시 시도해주세요');
      }
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
    staleTime: 1000 * 60 * 5,
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
  return useQuery({
    queryKey: ['application', meetingId],
    queryFn: async () => {
      const response = await applicationService.getApplicationMe(meetingId);
      return response.data;
    },
    staleTime: 0,
    placeholderData: (previousData) => previousData,
  });

  // 목업용
  // return useQuery({
  //   queryKey: ['application', meetingId],
  //   queryFn: async () => {
  //     const response = await mockApplicationService.getApplicationMe(meetingId);
  //     return response.data
  //   }
  // });
};

export const useApplicationPatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meetingId, data }: { meetingId: number, data: PostApplicationRequest }) =>
      applicationService.patchApplication(meetingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application'] });
    },
    onError: (error: any) => {
      const { status, message } = error?.response ?? {};
      switch (status) {
        case 400:
          if (message === 'STUDY_CONFIRMED') {
            toast.error('이미 확정된 모임입니다');
          } else {
            toast.error('잘못된 요청입니다');
          }
          break;
        case 403:
          toast.error('자신의 지원서만 수정할 수 있습니다');
          break;
        case 404:
          if (message === 'APPLICATION_NOT_FOUND') {
            toast.error('지원서가 존재하지 않습니다');
          } else {
            toast.error('존재하지 않는 모임입니다');
          }
          break;
        default:
          toast.error('지원서 수정에 실패했습니다. 잠시 후 다시 시도해주세요');
      }
    }
  });
  // 목업
  // return useMutation({
  //   mutationFn: ({ meetingId, data }: { meetingId: number, data: PostApplicationRequest }) =>
  //     mockApplicationService.patchApplication(meetingId, data),
  // });
};

export const useApplicationDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: number) => applicationService.deleteApplication(meetingId),
    onSuccess: (_, meetingId) => {
      queryClient.setQueryData(['application'], null);
      queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
    },
    onError: (error: any) => {
      const { status, message } = error?.response ?? {};
      switch (status) {
        case 400:
          if (message === 'STUDY_CONFIRMED') {
            toast.error('이미 확정된 모임입니다');
          } else {
            toast.error('잘못된 요청입니다');
          }
          break;
        case 403:
          toast.error('자신의 지원서만 삭제할 수 있습니다');
          break;
        case 404:
          if (message === 'APPLICATION_NOT_FOUND') {
            toast.error('지원서가 존재하지 않습니다');
          } else {
            toast.error('존재하지 않는 모임입니다');
          }
          break;
        default:
          toast.error('지원서 삭제에 실패했습니다. 잠시 후 다시 시도해주세요');
      }
    }
  });
  // 목업
  // return useMutation({
  //   mutationFn: (meetingId: number) => mockApplicationService.deleteApplication(meetingId),
  // });
};