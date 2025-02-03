import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockMypageService, mypageService } from "../../services/api/mypage";
import { UserProfilePatch } from "../../types/api/mypage";
import toast from "react-hot-toast";

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: () => mypageService.getMyUser(),
    select: (response) => response.data.data,
  });
  // return useQuery({
  //   queryKey: ['myProfile'],
  //   queryFn: () => mockMypageService.getMyUser(),
  // });
};

export const useRecentCreatedMeetings = () => {
  return useQuery({
    queryKey: ['myRecentCreatedMeetings'],
    queryFn: () => mypageService.getMyCreateMeetingRecent(),
    select: (response) => response.data.data,
  });
  // return useQuery({
  //   queryKey: ['myRecentCreatedMeetings'],
  //   queryFn: () => mockMypageService.getMyCreateMeetingRecent()
  // });
};

export const useRecentLikedMeetings = () => {
  return useQuery({
    queryKey: ['myRecentLikedMeetings'],
    queryFn: () => mypageService.getMyLikeMeetingRecent(),
    select: (response) => response.data.data,
  });
  // return useQuery({
  //   queryKey: ['myRecentLikedMeetings'],
  //   queryFn: () => mockMypageService.getMyLikeMeetingRecent()
  // });
};

export const useRecentAppliedMeetings = () => {
  return useQuery({
    queryKey: ['myRecentAppliedMeetings'],
    queryFn: () => mypageService.getMyApplyMeetingRecent(),
    select: (response) => response.data.data,
  });
  // return useQuery({
  //   queryKey: ['myRecentAppliedMeetings'],
  //   queryFn: () => mockMypageService.getMyApplyMeetingRecent()
  // });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfilePatch) => mypageService.patchMyUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('프로필이 성공적으로 수정되었습니다.');
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.error('입력하신 정보를 다시 확인해주세요.');
      } else if (error?.response?.status === 401) {
        toast.error('로그인이 필요합니다.');
      } else {
        toast.error('프로필 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  });
  // return useMutation({
  //   mutationFn: (data: UserProfilePatch) =>
  //     mockMypageService.patchMyUser(data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['myProfile'] });
  //   }
  // });
};

export const useCreatedMeetings = (page: number) => {
  return useQuery({
    queryKey: ['myCreatedMeetings', page],
    queryFn: () => mypageService.getMyCreateMeeting(page - 1),
    select: (response) => response.data.data,
  });
  // return useQuery({
  //   queryKey: ['myCreatedMeetings', page],
  //   queryFn: () => mockMypageService.getMyCreateMeeting(page)
  // });
};

export const useLikedMeetings = (page: number) => {
  return useQuery({
    queryKey: ['myLikedMeetings', page],
    queryFn: () => mypageService.getMyLikeMeeting(page - 1),
    select: (response) => response.data.data,
  });
  // return useQuery({
  //   queryKey: ['myLikedMeetings', page],
  //   queryFn: () => mockMypageService.getMyLikeMeeting(page)
  // });
};

export const useAppliedMeetings = (page: number) => {
  return useQuery({
    queryKey: ['myAppliedMeetings', page],
    queryFn: () => mypageService.getMyApplyMeeting(page - 1),
    select: (response) => response.data.data,
  });
  // return useQuery({
  //   queryKey: ['myAppliedMeetings', page],
  //   queryFn: () => mockMypageService.getMyApplyMeeting(page)
  // });
};