import React, { useState } from 'react';
import { profileStore } from '../../../store/profile';
import PhotoUploadStep from './PhotoUploadStep';
import Button from '../../common/ui/Button';
import TextInput from '../../common/ui/TextInput';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

interface PhotoStepProps {
  onPreview: () => void;
  onNext: () => void;
}

export default function PhotoStep({ onPreview, onNext }: PhotoStepProps) {
  const { formData, updateFormData } = profileStore();
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!formData.nickname.trim()) {
      setError('닉네임은 필수 입력 사항입니다.');
    } else if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      setError('닉네임은 2자 이상 20자 이하로 입력해주세요.');
    }
    onNext();
  };

  const handlePhotoSelect = (image: string) => {
    updateFormData({ profileImage: image });
    setShowPhotoUpload(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-bold text-big-title font-gmarket-bold text-center">
        Profile
      </h2>

      <p className="text-bold font-scdream6 text-page-title my-4 leading-10 text-center">
        여러분들의 프로필을 적어주세요
      </p>

      <p className="flex items-center justify-center text-regular text-sub mb-8 text-center font-sc4">
        <span className="text-yellow mr-2">★</span>
        본 정보는 모집글 작성 및 지원시에 사용됩니다.
      </p>

      <div className="flex flex-col items-center my-8">
        <div
          className="relative w-32 h-32 cursor-pointer mb-2"
          onClick={() => setShowPhotoUpload(true)}
        >
          {formData.profileImage ? (
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={formData.profileImage}
                alt="Selected profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-sub flex items-center justify-center p-4">
              <PersonIcon sx={{ fontSize: 60 }} className="text-white" />
            </div>
          )}
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 drop-shadow-lg">
            <EditIcon className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        <p className="text-regular text-bold font-scdream6">프로필 수정</p>
      </div>

      <div className="mb-4">
        <p className="text-label font-scdream6 text-bold mb-4">
          닉네임
        </p>
        <div className="relative">
          <TextInput
            type="text"
            placeholder="사용할 닉네임을 입력해주세요"
            value={formData.nickname}
            onChange={(e) => {
              updateFormData({ nickname: e.target.value });
              setError('');
            }}
            error={error}
            fullWidth
            bordered
          />
        </div>
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={onPreview}
        className="mt-8"
        size="small"
      >
        이전
      </Button>

      <Button
        variant="secondary"
        fullWidth
        onClick={handleNext}
        className="mt-4"
        size="small"
      >
        다음
      </Button>

      {showPhotoUpload && (
        <PhotoUploadStep
          onClose={() => setShowPhotoUpload(false)}
          onSelect={handlePhotoSelect}
        />
      )}
    </div>
  );
}