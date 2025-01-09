import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { StudyDetailPost } from '../types';

import StudyDetailPageFounder from '../components/StudyDetailPageFounder';
import StudyDetailPageApplicant from '../components/StudyDetailPageApplicant';
import StudyDetailPageFounderDone from '../components/StudyDetailPageFounderDone';

const StudyDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [studyDetail, setStudyDetail] = useState<StudyDetailPost>({
    postId: 0,
    userId: 0,
    skill: "",
    progress: "",
    peopleNum: 0,
    deadline: "",
    content: "",
    createdAt: "",
    type: "",
    done: false,
    title: "",
    place: "",
    latitude: 0,
    longitude: 0,
    userName: ""
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null') as { name: string } | null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailResponse, commentsResponse] = await Promise.all([
          axios.get<StudyDetailPost>(`http://localhost:8080/api/post/detail?post_id=${postId}`),
          axios.get<Comment[]>(`http://localhost:8080/api/comment/list?post_id=${postId}`)
        ]);

        setStudyDetail(detailResponse.data);
        setComments(commentsResponse.data);
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
  
  const detailArray: [StudyDetailPost, number, Comment[]] = [studyDetail, Number(postId), comments];

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