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

interface MeetingHeaderProps {
  meetingDetail: MeetingDetailInfo;
  isApplicant: boolean;
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  meetingDetail,
  isApplicant
}) => {
  const { postInfo, likeDto } = meetingDetail;
  const { toggleLike } = useLike(postInfo.id);
  const isLiked = likeDto.isLiked;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteMeeting = useMeetingDelete();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike.mutate(likeDto.isLiked);
  };

  const handleDelete = () => setShowDeleteModal(true);

  const confirmDelete = () => {
    deleteMeeting.mutate(postInfo.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center justify-between mb-2">
        <div className="flex items-center">
          <Star className="text-yellow" sx={{ fontSize: 50 }} />
          <p className="font-gmarket-bold text-big-title text-bold ml-4">
            [{toKoreanRecruitmentType(postInfo.recruitmentType)}] {postInfo.title}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {!isApplicant ? (
            <>
              <button>
                <Edit sx={{ fontSize: 40, color: "#7C8BBE" }} />
              </button>
              <button onClick={handleDelete}>
                <Delete sx={{ fontSize: 40, color: "#7C8BBE" }} />
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className='flex justify-between items-center'>
        <p className="text-label font-scdream6 text-sub mt-2 mb-6">
          {/* {postInfo.creator.username} | {postInfo.createdAt} */}
          {postInfo.creator.username}
        </p>
        <div onClick={handleLikeClick} className='flex items-center gap-4'>
          {isLiked ?
            <Favorite sx={{ fontSize: 28, color: "#313866" }} /> :
            <FavoriteBorder sx={{ fontSize: 28, color: "#313866" }} />
          }
          <span className="text-bold text-label font-scdream6">
            {likeDto.likeCount}
          </span>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white p-8 rounded-xl shadow-lg min-w-[400px] text-center">
            <h3 className="font-scdream6 text-xl mb-6">
              정말 삭제하시겠습니까? <br />
              삭제한 게시글은 복원할 수 없습니다.
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                size="small"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </Button>
              <Button
                size="small"
                onClick={confirmDelete}
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