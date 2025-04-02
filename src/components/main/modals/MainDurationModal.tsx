import React, { useState, useEffect } from 'react';
import { DURATION } from '../../../types/models/meeting';
import { toKoreanDuration } from '../../../util/transformKorean';

interface MainDurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (durations: DURATION[]) => void;
  selectedDurations: DURATION[];
  anchorEl?: HTMLElement | null;
}

/**
 * 기간 필터 모달 컴포넌트
 * 중복 선택이 가능한 프로젝트 기간 필터 UI 제공
 */
const MainDurationModal: React.FC<MainDurationModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedDurations = [],
  anchorEl
}) => {
  const [selected, setSelected] = useState<DURATION[]>(selectedDurations);
  
  useEffect(() => {
    setSelected(selectedDurations);
  }, [selectedDurations]);
  
  if (!isOpen) return null;
  
  const durations = Object.values(DURATION);

  const handleToggle = (e: React.MouseEvent, duration: DURATION) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newSelected = selected.includes(duration)
      ? selected.filter(d => d !== duration)
      : [...selected, duration];
      
    setSelected(newSelected);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(selected);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            style={{ pointerEvents: 'all' }}
          />
          
          <div 
            className="absolute top-16 left-0 z-50 bg-white rounded shadow-md p-4 w-96"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'all' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-button font-gmarket-bold text-bold">기간</h3>
              <p className="text-regular text-gray-500">중복선택 가능</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {durations.map((duration) => (
                <label
                  key={duration}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={(e) => handleToggle(e, duration)}
                >
                  <div 
                    className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center
                      ${selected.includes(duration) 
                        ? 'border-bold bg-bold' 
                        : 'border-bold'
                      }
                    `}
                  >
                    {selected.includes(duration) && (
                      <div className="w-3 h-3 flex items-center justify-center text-white">✓</div>
                    )}
                  </div>
                  <span className="font-scdream4 text-label text-bold">
                    {toKoreanDuration(duration)}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-sub text-white py-1 px-4 rounded font-scdream4"
                onClick={handleConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MainDurationModal;