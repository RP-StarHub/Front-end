import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeServices } from "../../services/api/like";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useLike = (meetingId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      queryClient.invalidateQueries({ queryKey: ['meeting'] });
      toast.success(isLiked ? '관심 모임글이 취소되었습니다.' : '관심 모임글로 등록했습니다.');
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error('로그인이 필요한 서비스입니다.');
      } else if (error?.response?.status === 404) {
        toast.error('리소스를 찾을 수 없습니다.');
      } else if (error?.response?.status === 409) {
        toast.error('이미 좋아요를 누르셨습니다.');
      } else if (error !== 'Unauthorized') {
        toast.error('관심 모임 등록하기는 로그인 후 이용할 수 있습니다.');
        navigate('/login');
      } else {
        toast.error('오류가 발생했습니다.');
      }
    }
  });

  return {
    toggleLike
  };
};