import { ApiResponse } from "./response";

// Request
export interface CommentCreateRequest {
  postId: number;
  userId: number;
  content: string;
  pick: boolean;
}

export interface CommentPickRequest {
  commentIdList: number[];
}

// Response
export interface CommentInfo {
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

export type PostCommentCreateResponse = ApiResponse<CommentInfo>;
export type GetCommentListResponse = ApiResponse<CommentInfo[]>;
export type GetPickedUserInfoResponse = ApiResponse<PickedUserInfo[]>;
export type PutCommentPickResponse = ApiResponse<CommentInfo[]>;