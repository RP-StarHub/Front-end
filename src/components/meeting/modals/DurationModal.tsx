import React from 'react';
import { DURATION } from '../../../types/models/meeting';
import { toKoreanDuration } from '../../../util/transformKorean';
import Button from '../../common/ui/Button';

interface DurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (duration: DURATION) => void;
  selectedDuration?: DURATION;
}

const DurationModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedDuration
}: DurationModalProps) => {
  if (!isOpen) return null;

  const durations = Object.values(DURATION);

  const handleSelect = (duration: DURATION) => {
    onSelect(duration);
  };

  const handleConfirm = () => {
    if (selectedDuration) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div className="relative bg-white p-8 rounded-xl shadow-lg min-w-[400px]">
        <h3 className="font-gmarket-bold text-label mb-6 text-bold">기간</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {durations.map((duration) => (
            <label
              key={duration}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleSelect(duration)}
            >
              <div 
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selectedDuration === duration 
                    ? 'border-bold bg-bold' 
                    : 'border-bold'
                  }
                `}
              >
                {selectedDuration === duration && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="font-scdream4 text-regular text-bold">
                {toKoreanDuration(duration)}
              </span>
            </label>
          ))}
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

export default DurationModal;