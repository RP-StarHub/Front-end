export interface User {
  userId: number;
  loginId: string;
  name: string;
  email: string;
  phoneNum: string;
  introduction: string;
  age: number;
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

export interface StudyDetailPost extends Post {
  userName: string;
}

export interface Comment {
  commentId: number;
  postId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
  pick: boolean;
}

export interface StudyDetail {
  studyDetail: any;
  postId?: number;
}

export interface LatLng {
  latitude: number | null;
  longitude: number | null;
}