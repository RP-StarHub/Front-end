import React, { useState } from 'react';
import {
  Star,
  Favorite,
  FavoriteBorder,
  Edit,
  Delete
} from '@mui/icons-material';
import { MeetingDetailInfo } from '../../../types/api/meeting';
import { toKoreanRecruitmentType } from '../../../util/transformKorean';
import { useLike } from '../../../hooks/api/useLike';
import { useMeetingDelete } from '../../../hooks/api/useMeeting';
import Button from '../../common/ui/Button';
import { UserType } from '../../../types/models/meeting';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface MeetingHeaderProps {
  meetingDetail: MeetingDetailInfo;
  userType: UserType
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  meetingDetail,
  userType
}) => {
  const navigate = useNavigate();
  const { postInfo, likeDto } = meetingDetail;
  const { toggleLike } = useLike(postInfo.id);
  const isLiked = likeDto.isLiked;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteMeeting = useMeetingDelete();

  const handleLikeClick = (e: React.MouseEvent) => {
    // 익명 사용자 처리
    if (userType === UserType.Anonymous) {
      toast.error('관심 모임 등록하기는 로그인이 필요합니다');
      navigate('/login');
      return;
    }

    e.stopPropagation();
    toggleLike.mutate(likeDto.isLiked || false);
  };

  const handleDelete = () => setShowDeleteModal(true);

  const confirmDelete = () => {
    deleteMeeting.mutate(postInfo.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col w-full" data-testid="meeting-header">
      <div className="flex flex-row items-center justify-between mb-2">
        <div className="flex items-center">
          <Star className="text-yellow" sx={{ fontSize: 50 }} />
          <p className="font-gmarket-bold text-big-title text-bold ml-4" data-testid="meeting-title">
            [{toKoreanRecruitmentType(postInfo.recruitmentType)}] {postInfo.title}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {userType === UserType.Creator ? (
            <>
              <button
                onClick={() => navigate(`/meeting/edit/${postInfo.id}`)}
                data-testid="edit-button"
              >
                <Edit sx={{ fontSize: 40, color: "#7C8BBE" }} />
              </button>
              <button
                onClick={handleDelete}
                data-testid="delete-button"
              >
                <Delete sx={{ fontSize: 40, color: "#7C8BBE" }} />
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex items-center my-4' data-testid="creator-info">
          <img
            src={postInfo.creator.profileImage}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <p className="text-label font-scdream6 text-sub">
            {postInfo.creator.nickname} | {new Date(postInfo.updatedAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <div
          onClick={handleLikeClick}
          className='flex items-center gap-4'
          data-testid="like-button"
        >
          {isLiked ?
            <Favorite sx={{ fontSize: 28, color: "#313866" }} data-testid="favorite-filled" /> :
            <FavoriteBorder sx={{ fontSize: 28, color: "#313866" }} data-testid="favorite-border" />
          }
          <span className="text-bold text-label font-scdream6" data-testid="like-count">
            {likeDto.likeCount}
          </span>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          data-testid="delete-modal"
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
            data-testid="delete-modal-backdrop"
          />
          <div className="relative bg-white p-8 rounded-xl shadow-lg min-w-[400px] text-center">
            <h3 className="font-scdream6 text-xl mb-6">
              정말 삭제하시겠습니까? <br />
              삭제한 게시글은 복원할 수 없습니다.
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                size="small"
                onClick={() => setShowDeleteModal(false)}
                data-testid="delete-cancel-button"
              >
                취소
              </Button>
              <Button
                size="small"
                onClick={confirmDelete}
                data-testid="delete-confirm-button"
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingHeader;