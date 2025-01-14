import { useMutation, useQuery } from "@tanstack/react-query"
import { CommentCreateRequest } from "../../types/api/comment";
import { commentServices } from '../../services/api/comment';

export const useCommentCreate = () => {
  return useMutation({
    mutationFn: (data: CommentCreateRequest) =>
      commentServices.postCommentCreate(data)
  })
}

export const useCommentList = (postId: number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentServices.getCommentList(postId),
    enabled: !!postId
  })
}

export const useCommentPick = () => {
  return useMutation({
    mutationFn: (selectedComments: number[]) =>
      commentServices.putCommentPick(selectedComments)
  })
}

export const useUserPicked = (postId: number) => {
  return useQuery({
    queryKey: ['pickedUser', postId],
    queryFn: () => commentServices.getPickedUserInfo(postId),
    enabled: !!postId
  })
}