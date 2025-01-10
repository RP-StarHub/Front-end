import { ApiResponse } from "./response";

export interface CommentRequest {
  postId: number;
  userId: number;
  content: string;
  pick: boolean;
}

export interface CommentResponse {
  postId: number;
  commentId: number;
  content: string;
  username: string;
  pick: boolean;
  createdAt: string;
}

export interface PickedCommentUser {
  name: string;
  introduction: string;
  email: string;
  phoneNum: string;
  age: number;
}

export interface PickedUserInfo {
  user: PickedCommentUser;
}

export type PostCommentCreate = ApiResponse<CommentResponse>;
export type GetCommentList = ApiResponse<CommentResponse[]>;
export type PutCommentPick = ApiResponse<PickedUserInfo[]>;
export type GetPickedUserInfo = ApiResponse<PickedUserInfo[]>;