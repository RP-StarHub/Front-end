export interface User {
  userId: number;
  loginId: string;
  name: string;
  email: string;
  phoneNum: string;
  introduction: string;
}

export interface Post {
  postId: number;
  userId: number;
  skill: string;
  progress: string;
  peopleNum: number;
  deadline: string;
  content: string;
  createdAt: string;
  type: string;
  done: boolean;
  title: string;
  place: string;
  latitude: number;
  longitude: number;
}

export interface Comment {
  commentId: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  pick: boolean;
}