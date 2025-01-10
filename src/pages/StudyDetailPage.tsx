import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';

import StudyDetailPageFounder from '../components/StudyDetailPageFounder';
import StudyDetailPageApplicant from '../components/StudyDetailPageApplicant';
import StudyDetailPageFounderDone from '../components/StudyDetailPageFounderDone';
import { GetPostDetailResponse, PostInfo } from "../types/api/post";
import { CommentInfo, GetCommentListResponse } from "../types/api/comment";

const StudyDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [studyDetail, setStudyDetail] = useState<PostInfo>({
    skill: "",
    place: "",
    latitude: 0,
    longitude: 0,
    progress: "",
    peopleNum: 0,
    deadline: "",
    type: "",
    done: false,
    title: "",
    content: "",
    createdAt: "",
    userName: ""
  });
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailResponse, commentsResponse] = await Promise.all([
          axios.get<GetPostDetailResponse>(
            `${process.env.REACT_APP_API_URL}/api/post/detail?post_id=${postId}`
          ),
          axios.get<GetCommentListResponse>(
            `${process.env.REACT_APP_API_URL}/api/comment/list?post_id=${postId}`
          )
        ]);

        setStudyDetail(detailResponse.data.data);
        setComments(commentsResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (postId) {
      fetchData();
    }
  }, [postId]);

  // userInfo와 studyDetail의 userName이 같은지 확인
  const isCurrentUser = userInfo && userInfo.name === studyDetail.userName;
  
  const detailArray: [PostInfo, number, CommentInfo[]] = [studyDetail, Number(postId), comments];

  if (isCurrentUser) {
    if (studyDetail.done) {
      return (
        <StudyDetailPageFounderDone
          studyDetail={detailArray}
          postId={Number(postId)}
        />
      );
    } else {
      return (
        <StudyDetailPageFounder
          studyDetail={detailArray}
          postId={Number(postId)} 
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