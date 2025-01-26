import React from 'react';
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

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike.mutate(likeDto.isLiked);
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
              <button>
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
    </div>
  );
};

export default MeetingHeader;