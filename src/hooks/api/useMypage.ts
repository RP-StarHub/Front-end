import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockMypageService } from "../../services/api/mypage";
import { UserProfilePatch } from "../../types/api/mypage";

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: () => mockMypageService.getMyUser(),
  });
};

export const useRecentCreatedMeetings = () => {
  return useQuery({
    queryKey: ['myRecentCreatedMeetings'],
    queryFn: () => mockMypageService.getMyCreateMeetingRecent()
  });
};

export const useRecentLikedMeetings = () => {
  return useQuery({
    queryKey: ['myRecentLikedMeetings'],
    queryFn: () => mockMypageService.getMyLikeMeetingRecent()
  });
};

export const useRecentAppliedMeetings = () => {
  return useQuery({
    queryKey: ['myRecentAppliedMeetings'],
    queryFn: () => mockMypageService.getMyApplyMeetingRecent()
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfilePatch) =>
      mockMypageService.patchMyUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    }
  });
};

export const useCreatedMeetings = (page: number) => {
  return useQuery({
    queryKey: ['myCreatedMeetings', page],
    queryFn: () => mockMypageService.getMyCreateMeeting(page)
  });
};

export const useLikedMeetings = (page: number) => {
  return useQuery({
    queryKey: ['myLikedMeetings', page],
    queryFn: () => mockMypageService.getMyLikeMeeting(page)
  });
};

export const useAppliedMeetings = (page: number) => {
  return useQuery({
    queryKey: ['myAppliedMeetings', page],
    queryFn: () => mockMypageService.getMyApplyMeeting(page)
  });
};