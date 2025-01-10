import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  CommentInfo, 
  CommentPickRequest,
  PutCommentPickResponse 
} from '../types/api/comment';


interface CommentListProps {
  comments: CommentInfo[];
  isSelectable: boolean;
  postId?: number;
}

interface CommentItemStyledProps extends React.HTMLAttributes<HTMLDivElement> {
  $isSelected: boolean;
  $isSelectable: boolean;
}

const CommentListContainer = styled.div`
  width: 100%;
`;

const CommentItem = styled.div<CommentItemStyledProps>`
  padding: 15px 25px;
  margin: 40px 0;
  border: 3px solid #7C8BBE;
  border-radius: 30px;
  font-family: 'SCDream4', sans-serif;
  font-size: 18px;
  color: #313866;
  cursor: ${({ $isSelectable }) => ($isSelectable ? 'pointer' : 'default')};

  ${({ $isSelected }) => $isSelected && `
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

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  isSelectable, 
  postId,
}) => {
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  
  const navigate = useNavigate();

  const handleCommentClick = (commentId: number) => {
    if (!isSelectable) return;

    setSelectedComments(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleConfirm = async () => {
    try {
      const request: CommentPickRequest = {
        commentIdList: selectedComments,
      };

      await axios.put<PutCommentPickResponse>(
        `${process.env.REACT_APP_API_URL}/api/comment/pick`,
        null,
        { params: request }
      );
      
      navigate(`/applicantlist/${postId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error updating picks:', error);
    }
  };

  if (isSelectable) {
    return (
      <CommentListContainer>
        {comments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            $isSelected={selectedComments.includes(comment.commentId)}
            $isSelectable={isSelectable}
            onClick={() => handleCommentClick(comment.commentId)}
          >
            <div>{comment.username}</div>
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
            $isSelected={selectedComments.includes(comment.commentId)}
            $isSelectable={isSelectable}
            onClick={() => handleCommentClick(comment.commentId)}
          >
            <div>{comment.username}</div>
            <div>{comment.createdAt}</div>
            <Content>{comment.content}</Content>
          </CommentItem>
        ))}
      </CommentListContainer>
    );
  }

};

export default CommentList;
