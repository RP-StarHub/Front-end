import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeServices } from "../../services/api/like";
import { toast } from "react-hot-toast";

export const useLike = (meetingId: number) => {
  const queryClient = useQueryClient();

  const toggleLike = useMutation({
    mutationFn: (isLiked: boolean | null) => {
      if (isLiked === null) {
        toast.error('로그인 후 관심 표시를 누를 수 있습니다.');
        return Promise.reject('Unauthorized');
      }
      return isLiked
        ? likeServices.deleteLikes(meetingId)
        : likeServices.postLikes(meetingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    }
  });

  return {
    toggleLike
  };
};