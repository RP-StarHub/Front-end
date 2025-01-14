import { CommentCreateRequest, GetCommentListResponse, GetPickedUserInfoResponse, PostCommentCreateResponse, PutCommentPickResponse } from "../../types/api/comment";
import { axiosInstance } from "./axios";

export const commentServices = {
  postCommentCreate: (data: CommentCreateRequest) => {
    return axiosInstance.post<PostCommentCreateResponse>(
      '/api/comment/create',
      data
    );
  },
  
  getCommentList: (postId: number) => {
    return axiosInstance.get<GetCommentListResponse>(
      `/api/comment/list`,
      {
        params: { post_id : postId }
      }
    );
  },

  putCommentPick: (selectedComments: number[]) => {
    const queryParams = selectedComments.join(','); 
    return axiosInstance.put<PutCommentPickResponse>(
      `/api/comment/pick`,
      null,
      { 
        params: { commentIdList: queryParams }
      }
    );
  },

  getPickedUserInfo: (postId: number) => {
    return axiosInstance.get<GetPickedUserInfoResponse>(
      `/api/comment/pick/user`,
      {
        params: { postId }
      }
    );
  }
}