import { PostInfo } from "../api/post";
import { CommentInfo } from "../api/comment";

export interface DetailPageProps {
  studyDetail: [PostInfo, number, CommentInfo[]];
  postId?: number;
}

export interface AddressObj {
  areaAddress: string;
  townAddress: string;
}

export interface FormErrors {
  type?: string;
  skill?: string;
  peopleNum?: string;
  progress?: string;
  place?: string;
  deadline?: string;
  title?: string;
  content?: string;
}
