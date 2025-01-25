import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeServices } from "../../services/api/like";

export const useLike = (meetingId: number) => {
  const queryClient = useQueryClient();

  const toggleLike = useMutation({
    mutationFn: (isLiked: boolean | null) => {
      if (isLiked === null) return Promise.reject('Unauthorized');
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