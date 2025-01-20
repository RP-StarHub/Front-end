import React, { useState } from 'react';
import Button from '../../common/ui/Button';
import TextInput from '../../common/ui/TextInput';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

interface PhotoStepProps {
  onNext: () => void;
  onOpenPhotoSelect: () => void;
  selectedImage: string | null;
}

export default function PhotoStep({ onNext, onOpenPhotoSelect, selectedImage }: PhotoStepProps) {
  const [nickname, setNickname] = useState('');

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
          onClick={onOpenPhotoSelect}
        >
          {selectedImage ? (
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={selectedImage}
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
          <PersonIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sub z-10" />
          <TextInput
            type="text"
            placeholder="사용할 닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            fullWidth
            bordered
            className="pl-12 text-placeholder"
          />
        </div>
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={onNext}
        className="mt-8"
        size="small"
      >
        다음
      </Button>
    </div>
  );
}
