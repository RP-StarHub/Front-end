import { CommentInfo } from "./types/api/comment";
import { PostInfo } from "./types/api/post";

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

export interface DetailPageProps {
  studyDetail: [PostInfo, number, CommentInfo[]];
  postId?: number;
}

export interface LatLng {
  latitude: number | null;
  longitude: number | null;
}

export type IconType = '스택' | '마감' | '장소' | '인원' | '기간';

export interface IconStyle {
  width: string;
  height: string;
  margin: string;
}

export interface MapPosition {
  latitude: number;
  longitude: number;
}

export interface KakaoLatLng {
  lat: number;
  lng: number;
}

export interface StudyCardInfo {
  type: string;
  title: string;
  skill: string;
  deadline: string;
  progress: string;
  peopleNum: number;
  place: string;
  postId: number;
}

export interface BaseCardProps extends StudyCardInfo {}

export interface InformCardProps extends BaseCardProps {}

export interface OverCardProps extends BaseCardProps {
  onClose: () => void;
}

export interface MarkerState {
  isVisible: boolean;
  isClicked: boolean;
}

export interface Applicant {
  user: User;
  commentId: number;
  postId: number;
}