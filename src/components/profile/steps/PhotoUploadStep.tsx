import React, { useState } from 'react';
import Button from '../../common/ui/Button';

interface PhotoUploadStepProps {
  onClose: () => void;
  onSelect: (profileUrl: string) => void;
}

const PROFILE_IMAGES = [
  { id: 1, path: require('../../../assets/profileImages/profile1.png') },
  { id: 2, path: require('../../../assets/profileImages/profile2.png') },
  { id: 3, path: require('../../../assets/profileImages/profile3.png') },
  { id: 4, path: require('../../../assets/profileImages/profile4.png') }
];

export default function PhotoUploadStep({ onClose, onSelect }: PhotoUploadStepProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
        <h2 className="text-page-title font-gmarket-bold text-bold mb-8">
          프로필 이미지 선택
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {PROFILE_IMAGES.map((profile) => (
            <div
              key={profile.id}
              className={`
                relative aspect-square rounded-xl cursor-pointer overflow-hidden
                ${selectedImage === profile.path ? 'ring-4 ring-red-700' : 'hover:ring-2 ring-red-400'}
              `}
              onClick={() => setSelectedImage(profile.path)}
            >
              <img
                src={profile.path}
                alt={`프로필 옵션 ${profile.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={onClose}
            size="small"
          >
            취소
          </Button>
          <Button
            variant="secondary"
            onClick={handleSelect}
            disabled={!selectedImage}
            size="small"
          >
            선택
          </Button>
        </div>
      </div>
    </div>
  );
}