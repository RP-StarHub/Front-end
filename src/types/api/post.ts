import { ApiResponse } from "./response";

// Request
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

// Response
export interface PostInfo {
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

export interface PostListInfo {
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

export type PostCreateResponse = ApiResponse<PostInfo>;
export type GetPostListResponse = ApiResponse<PostListInfo[]>;
export type GetPostDetailResponse = ApiResponse<PostInfo>;