import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeServices } from "../../services/api/like";
import { toast } from "react-hot-toast";

export const useLike = (meetingId: number) => {
  const queryClient = useQueryClient();

  const toggleLike = useMutation({
    mutationFn: (isLiked: boolean | null) => {
      if (isLiked === null) {
        toast.error('로그인이 필요한 서비스입니다.');
        return Promise.reject('Unauthorized');
      }
      return isLiked 
        ? likeServices.deleteLikes(meetingId)
        : likeServices.postLikes(meetingId);
    },
    onSuccess: (_, isLiked) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success(isLiked ? '좋아요가 취소되었습니다.' : '좋아요를 눌렀습니다.');
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error('로그인이 필요한 서비스입니다.');
      } else if (error?.response?.status === 404) {
        toast.error('리소스를 찾을 수 없습니다.');
      } else if (error?.response?.status === 409) {
        toast.error('이미 좋아요를 누르셨습니다.');
      } else if (error !== 'Unauthorized') {
        toast.error('오류가 발생했습니다.');
      }
    }
  });

  return {
    toggleLike
  };
};