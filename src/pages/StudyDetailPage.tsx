import React from "react";
import { useParams } from 'react-router-dom';
import StudyDetailPageFounder from '../components/study/detail/StudyDetailPageFounder';
import StudyDetailPageApplicant from '../components/study/detail/StudyDetailPageApplicant';
import StudyDetailPageFounderDone from '../components/study/detail/StudyDetailPageFounderDone';
import { usePostDetail } from "../hooks/api/usePost";
import { useCommentList } from "../hooks/api/useComment";
import { PostInfo } from "../types/api/post";
import { CommentInfo } from "../types/api/comment";

const StudyDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const numericPostId = Number(postId);
  
  const { data: postResponse, isLoading: isLoadingPost } = usePostDetail(numericPostId);
  const { data: commentsResponse, isLoading: isLoadingComments } = useCommentList(numericPostId);
  
  const studyDetail: PostInfo | undefined = postResponse?.data.data;
  const comments: CommentInfo[] = commentsResponse?.data.data || [];
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  // 데이터 로딩 중이면 로딩 상태 표시
  if (isLoadingPost || isLoadingComments || !studyDetail) {
    return <div>Loading...</div>;
  }

  // userInfo와 studyDetail의 userName이 같은지 확인
  const isCurrentUser = userInfo && userInfo.name === studyDetail.userName;
  
  const detailArray: [PostInfo, number, CommentInfo[]] = [studyDetail, numericPostId, comments];

  if (isCurrentUser) {
    if (studyDetail.done) {
      return (
        <StudyDetailPageFounderDone
          studyDetail={detailArray}
          postId={numericPostId}
        />
      );
    } else {
      return (
        <StudyDetailPageFounder
          studyDetail={detailArray}
          postId={numericPostId} 
        />
      );
    }
  } else {
    return (
      <StudyDetailPageApplicant studyDetail={detailArray} />
    );
  }
};

export default StudyDetailPage;