import { GetPostDetailResponse, GetPostListResponse, PostCreateResponse, PostRequest } from "../../types/api/post"
import { axiosInstance } from "./axios"

export const postServices = {
  postCreate: (data: PostRequest) => {
    return axiosInstance.post<PostCreateResponse>(
      '/api/post/create',
      data
    );
  },
  getPostList: () => {
    return axiosInstance.get<GetPostListResponse>(
      '/api/post/list'
    );
  },
  getPostDetail: (postId: number) => {
    return axiosInstance.get<GetPostDetailResponse>(
      `/api/post/detail`,
      {
        params: { post_id : postId }
      }      
    );
  },
}