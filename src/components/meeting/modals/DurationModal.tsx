import React from 'react';
import { DURATION } from '../../../types/models/meeting';
import { toKoreanDuration } from '../../../util/transformKorean';
import BaseModal from '../../common/ui/BaseModal';

interface DurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (duration: DURATION) => void;
  selectedDuration?: DURATION;
  anchorEl?: HTMLElement | null;
}

const DurationModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedDuration,
  anchorEl
}: DurationModalProps) => {
  if (!isOpen) return null;
  const durations = Object.values(DURATION);

  const handleSelect = (duration: DURATION) => {
    onSelect(duration);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="기간"
      anchorEl={anchorEl}
      onConfirm={() => onClose()}
    >
      <div className="grid grid-cols-2 gap-3" data-testid="duration-options">
        {durations.map((duration) => (
          <label
            key={duration}
            data-testid={`duration-option-${duration}`}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleSelect(duration)}
          >
            <div
              data-testid={`duration-radio-${duration}`}
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selectedDuration === duration
                  ? 'border-bold bg-bold'
                  : 'border-bold'
                }
              `}
            >
              {selectedDuration === duration && (
                <div
                  data-testid={`duration-radio-dot-${duration}`}
                  className="w-2 h-2 rounded-full bg-white"
                />
              )}
            </div>
            <span
              data-testid={`duration-text-${duration}`}
              className="font-scdream4 text-regular text-bold"
            >
              {toKoreanDuration(duration)}
            </span>
          </label>
        ))}
      </div>
    </BaseModal>
  );
};

export default DurationModal;