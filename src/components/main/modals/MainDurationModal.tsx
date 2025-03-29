import React, { useState, useEffect } from 'react';
import { DURATION } from '../../../types/models/meeting';
import { toKoreanDuration } from '../../../util/transformKorean';

interface MainDurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (duration: DURATION | null) => void;
  selectedDuration: DURATION | null;
  anchorEl?: HTMLElement | null;
}

/**
 * 기간 필터 모달 컴포넌트
 * 단일 선택만 가능한 프로젝트 기간 필터 UI 제공
 */
const MainDurationModal: React.FC<MainDurationModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedDuration = null,
  anchorEl
}) => {
  // 내부 상태로 선택된 값 관리
  const [selected, setSelected] = useState<DURATION | null>(selectedDuration);
  
  // 모달이 열릴 때마다 외부 selectedDuration 값으로 초기화
  useEffect(() => {
    setSelected(selectedDuration);
  }, [selectedDuration, isOpen]);
  
  if (!isOpen) return null;
  
  const durations = Object.values(DURATION);

  const handleToggle = (e: React.MouseEvent, duration: DURATION) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 내부 상태만 변경, 아직 부모 컴포넌트로 전달하지 않음
    if (selected === duration) {
      setSelected(null);
    } else {
      setSelected(duration);
    }
  };

  // 확인 버튼 클릭 시에만 부모 컴포넌트로 값 전달
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 선택된 값을 부모 컴포넌트로 전달하고 모달 닫기
    onSelect(selected);
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
              <p className="text-regular text-gray-500">하나만 선택 가능</p>
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
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selected === duration 
                        ? 'border-bold bg-bold' 
                        : 'border-bold'
                      }
                    `}
                  >
                    {selected === duration && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
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