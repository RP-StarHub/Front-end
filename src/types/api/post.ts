import { ApiResponse } from "./response";

export interface PostRequest {
  userId: number;
  skill: string;
  place: string;
  latitude: number;
  longitude: number;
  progress: string;
  peopleNum: number;
  deadline: string;
  type: string;
  done: boolean;
  title: string;
  content: string;
}

export interface PostResponse {
  skill: string;
  place: string;
  latitude: number;
  longitude: number;
  progress: string;
  peopleNum: number;
  deadline: string;
  type: string;
  done: boolean;
  title: string;
  content: string;
  createdAt: string;
  username: string;
}

export interface PostListResponse {
  postId: number;
  skill: string;
  place: string;
  latitude: number;
  longitude: number;
  progress: string;
  peopleNum: number;
  deadline: string;
  type: string;
  title: string;
  createdAt: string;
  username: string;
}

export type PostCreate = ApiResponse<PostResponse>;
export type GetPostList = ApiResponse<PostListResponse[]>;
export type GetPostDetail = ApiResponse<PostResponse>;