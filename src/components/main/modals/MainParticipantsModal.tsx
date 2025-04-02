import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface MainParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (minParticipants: number, maxParticipants: number) => void;
  selectedParticipants: { min: number, max: number };
  anchorEl?: HTMLElement | null;
}

/**
 * 메인 페이지 인원 필터 모달 컴포넌트
 * 참여 인원 범위를 슬라이더로 선택할 수 있는 모달 컴포넌트
 */
const MainParticipantsModal: React.FC<MainParticipantsModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedParticipants = { min: 1, max: 5 },
  anchorEl
}) => {
  const initialMin = Math.max(1, selectedParticipants.min);
  const [range, setRange] = useState<[number, number]>([initialMin, selectedParticipants.max]);

  // 모달이 열릴 때마다 외부 selectedParticipants 값으로 초기화
  useEffect(() => {
    const min = Math.max(1, selectedParticipants.min);
    setRange([min, selectedParticipants.max]);
  }, [selectedParticipants, isOpen]);

  if (!isOpen) return null;

  const handleSliderChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      const min = Math.max(1, values[0]);
      setRange([min, values[1]]);
    }
  };

  const getDisplayValue = () => {
    const [min, max] = range;
    return `${min}명 ~ ${max}명`;
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(range[0], range[1]);
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
            className="absolute top-16 left-56 z-50 bg-white rounded shadow-md py-4 px-6 w-96"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'all' }}
          >
            <div className="mb-2">
              <h3 className="text-button font-gmarket-bold text-bold">인원</h3>

              <div className="text-left mb-4">
                <div className="font-medium mb-4 text-regular">
                  {getDisplayValue()}
                </div>

                <div
                  className="px-1 py-2"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <Slider
                    range
                    min={1}
                    max={10}
                    value={range}
                    onChange={handleSliderChange}
                    trackStyle={[{ backgroundColor: '#7C8BBE', height: 4 }]}
                    handleStyle={[
                      {
                        borderColor: '#7C8BBE',
                        backgroundColor: 'white',
                        boxShadow: 'none',
                        width: 20,
                        height: 20,
                        marginTop: -8
                      },
                      {
                        borderColor: '#7C8BBE',
                        backgroundColor: 'white',
                        boxShadow: 'none',
                        width: 20,
                        height: 20,
                        marginTop: -8
                      }
                    ]}
                    railStyle={{ backgroundColor: '#E5E7EB', height: 4 }}
                  />
                </div>

                <div className="flex justify-between items-center mt-4 text-regular text-gray-600">
                  <span className="font-scdream4">최소</span>
                  <span className="font-scdream4">5명</span>
                  <span className="font-scdream4">최대</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-sub text-white py-1 px-4 rounded font-scdream4"
                style={{ backgroundColor: '#7C8BBE' }}
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

export default MainParticipantsModal;