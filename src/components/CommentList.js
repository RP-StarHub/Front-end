import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CommentListContainer = styled.div`
  width: 100%;
`;

const CommentItem = styled.div`
  padding: 15px 25px;
  margin: 40px 0;
  border: 3px solid #7C8BBE;
  border-radius: 30px;
  font-family: 'SCDream4', sans-serif;
  font-size: 18px;
  color: #313866;
  cursor: ${({ isSelectable }) => (isSelectable ? 'pointer' : 'default')};

  ${({ isSelected }) => isSelected && `
    background-color: #7C8BBE;
    color: #F6F1FB;
  `}
`;

const Content = styled.div`
  margin: 5px 0;
`;

const Button = styled.button`
  margin-top: 40px;
  width: 150px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background-color: #b3b4dc;
  font-family: "SCDream4";
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CommentList = ({ comments, isSelectable, postId }) => {
  const [selectedComments, setSelectedComments] = useState([]);
  
  const navigate = useNavigate();

  const handleCommentClick = (commentId) => {
    if (isSelectable) {
      // 선택 가능한 경우에만 선택 상태를 업데이트
      if (selectedComments.includes(commentId)) {
        // 이미 선택된 경우, 선택 해제
        setSelectedComments(selectedComments.filter((selected) => selected !== commentId));
      } else {
        // 선택되지 않은 경우, 선택 추가
        setSelectedComments([...selectedComments, commentId]);
      }
    }
  };

  const handleConfirm = () => {
    axios
      .put(`http://localhost:8080/api/comment/pick?commentIdList=${selectedComments}`)
      .then((response) => {
        console.log(response.data);
        // 페이지 이동 후에 새로고침 실행
        navigate(`/applicantlist/${postId}`);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error fetching comment create:', error.message);
      });
  };

  if (isSelectable) {
    return (
      <CommentListContainer>
        {comments.map((comment, index) => (
          <CommentItem
            key={comment.commentId}
            isSelected={selectedComments.includes(comment.commentId)}
            isSelectable={isSelectable}
            onClick={() => handleCommentClick(comment.commentId)}
          >
            <div>{comment.userName}</div>
            <div>{comment.createdAt}</div>
            <Content>{comment.content}</Content>
          </CommentItem>
        ))}
        <ButtonContainer>
          <Button onClick={handleConfirm}>스터디원 확정</Button>
        </ButtonContainer>
      </CommentListContainer>
    );
  } else{
    return (
      <CommentListContainer>
        {comments.map((comment, index) => (
          <CommentItem
            key={comment.commentId}
            isSelected={selectedComments.includes(comment.commentId)}
            isSelectable={isSelectable}
            onClick={() => handleCommentClick(comment.commentId)}
          >
            <div>{comment.userName}</div>
            <div>{comment.createdAt}</div>
            <Content>{comment.content}</Content>
          </CommentItem>
        ))}
      </CommentListContainer>
    );
  }

};

export default CommentList;
