import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommentInfo } from '../../../types/api/comment';
import { useCommentPick } from '../../../hooks/api/useComment';
import Button from '../../common/ui/Button';

interface CommentListProps {
  comments: CommentInfo[];
  isSelectable: boolean;
  postId?: number;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  isSelectable,
  postId,
}) => {
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const navigate = useNavigate();
  const updatePicks = useCommentPick();

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
      await updatePicks.mutateAsync(selectedComments);
      navigate(`/applicant/list/${postId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error updating picks:', error);
    }
  };

  return (
    <div className='w-full'>
      {comments.map((comment) => (
        <div
          key={comment.commentId}
          className={`
          px-6 py-4 my-4 
          border-4 border-sub rounded-2xl 
          font-scdream4 text-lg text-bold
          ${isSelectable ? 'cursor-pointer' : 'cursor-default'}
          ${selectedComments.includes(comment.commentId)
              ? 'bg-sub text-white'
              : 'bg-none'
            }
          transition-colors duration-200
        `}
          onClick={() => handleCommentClick(comment.commentId)}
        >
          <div>{comment.username}</div>
          <div>{comment.createdAt}</div>
          <p className='mt-2'>{comment.content}</p>
        </div>
      ))}
      {isSelectable && (
        <div className="flex justify-end">
          <Button
            variant='secondary'
            size='small'
            onClick={handleConfirm}
            className='mt-4'
          >
            스터디원 확정
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
