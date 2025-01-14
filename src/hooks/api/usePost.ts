import { useMutation, useQuery } from "@tanstack/react-query"
import { PostRequest } from "../../types/api/post"
import { postServices } from "../../services/api/post"

export const usePostCreate = () => {
  return useMutation({
    mutationFn: (data: PostRequest) =>
      postServices.postCreate(data)
  });
}

export const usePostList = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postServices.getPostList()
  })
}

export const usePostDetail = (postId: number) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postServices.getPostDetail(postId)
  })
}
