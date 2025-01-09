import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Post } from '../types';

import StudyDetailPageFounder from '../components/StudyDetailPageFounder';
import StudyDetailPageApplicant from '../components/StudyDetailPageApplicant';
import StudyDetailPageFounderDone from '../components/StudyDetailPageFounderDone';

interface StudyDetailPost extends Post {
  userName: string;
}

const StudyDetailPage = () => {
  const { postId } = useParams();
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
  const [comments, setComments] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/post/detail?post_id=${postId}`)
      .then((response) => {
        // console.log(response.data.done)
        setStudyDetail(response.data)
      })
      .catch((error) => {
        console.error('Error fetching study detail:', error.message);
      });
      axios
      .get(`http://localhost:8080/api/comment/list?post_id=${postId}`)
      .then((response) => {
        // console.log(response.data)
        setComments(response.data)
      })
      .catch((error) => {
        console.error('Error fetching study detail:', error.message);
      });
  }, [postId]);

  // userInfo와 studyDetail의 userName이 같은지 확인
  const isCurrentUser = userInfo && userInfo.name === studyDetail.userName;

  const detailArray = [studyDetail, postId, comments];

  if (isCurrentUser) {
    if (studyDetail.done) {
      return (
        <StudyDetailPageFounderDone 
          studyDetail={detailArray} 
          postId={postId ? parseInt(postId) : undefined}
        />
      );
    } else {
      return (
        <StudyDetailPageFounder 
          studyDetail={detailArray} 
          postId={postId ? parseInt(postId) : undefined}
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