import React, { useState } from 'react';
import Button from '../../common/ui/Button';
import toast from 'react-hot-toast';

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (participants: number) => void;
  selectedParticipants?: number;
}

const ParticipantsModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedParticipants = 1
}: ParticipantsModalProps) => {
  const [value, setValue] = useState(selectedParticipants);

  if (!isOpen) return null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const getDisplayValue = (value: number) => {
    return value >= 10 ? "10명 이상" : `${value}명`;
  };

  const handleConfirm = () => {
    if (value === 0) {
      toast.error('모집 인원은 0명 이상이어야합니다.');
      return;
    };

    onSelect(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white p-8 rounded-xl shadow-lg min-w-[400px]">
        <h3 className="font-gmarket-bold text-label mb-6 text-bold">인원</h3>

        <div className="mb-8">
          <div className="text-left mb-4">
            <span className="font-scdream6 text-regular text-bold">
              {getDisplayValue(value)}
            </span>
          </div>

          <div className="relative">
            <div className="w-full h-1 bg-gray-200 rounded-full" />
            <div
              className="absolute top-0 left-0 h-1 bg-sub rounded-full transition-all"
              style={{ width: `${Math.max(0, (value / 10) * 100)}%` }}
            />
            <input
              type="range"
              min={0}
              max={10}
              value={value}
              onChange={handleSliderChange}
              className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-sub
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-sub
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="font-scdream4 text-regular text-bold">최소</span>
            <span className="font-scdream4 text-regular text-bold">5명</span>
            <span className="font-scdream4 text-regular text-bold">최대</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="secondary"
            size="small"
            onClick={handleConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal;