import { PostInfo } from "../api/post";
import { CommentInfo } from "../api/comment";

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

export interface DetailPageProps {
  studyDetail: [PostInfo, number, CommentInfo[]];
  postId?: number;
}

export interface BaseCardProps extends StudyCardInfo {}

export interface InformCardProps extends BaseCardProps {}

export interface OverCardProps extends BaseCardProps {
  onClose: () => void;
}