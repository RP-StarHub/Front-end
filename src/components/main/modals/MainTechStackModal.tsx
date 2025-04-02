import React, { useState, useEffect } from 'react';
import { useGetTechStack } from '../../../hooks/api/useTechstack';
import { TechCategory } from '../../../types/models/techstack';

interface MainTechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (techStacks: number[]) => void;
  selectedTechStacks: number[];
  anchorEl?: HTMLElement | null;
}

/**
 * 메인 페이지 기술 스택 필터 모달 컴포넌트
 * 프론트엔드, 백엔드, 모바일 카테고리별로 기술 스택 선택 UI 제공
 */
const MainTechStackModal: React.FC<MainTechStackModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedTechStacks = [],
  anchorEl
}) => {
  const { data: techStacksData, isLoading } = useGetTechStack();
  const [selectedIds, setSelectedIds] = useState<number[]>(selectedTechStacks || []);
  
  // 모달이 열릴 때마다 외부 selectedTechStacks 값으로 초기화
  useEffect(() => {
    setSelectedIds([...selectedTechStacks]);
  }, [selectedTechStacks, isOpen]);

  if (!isOpen) return null;

  const handleToggleStack = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(selectedIds);
  };

  if (isLoading) {
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
              className="absolute top-16 left-28 z-50 bg-white rounded shadow-md p-4 w-80"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{ pointerEvents: 'all' }}
            >
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-t-2 border-sub rounded-full animate-spin"></div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  if (!techStacksData?.data) return null;

  // 기술 스택을 카테고리별로 그룹화
  const groupedTechStacks = techStacksData.data.reduce((acc, stack) => {
    const category = stack.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(stack);
    return acc;
  }, {} as Record<string, typeof techStacksData.data>);

  // 카테고리 영문명을 한글명으로 매핑
  const categoryMapping: Record<string, string> = {
    [TechCategory.FRONTEND.toLowerCase()]: '프론트엔드',
    [TechCategory.BACKEND.toLowerCase()]: '백엔드',
    [TechCategory.MOBILE.toLowerCase()]: '모바일'
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
            className="absolute top-16 left-28 z-50 bg-white rounded shadow-md p-4 w-80"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'all' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-button font-gmarket-bold text-bold">기술 스택</h3>
              <p className="text-regular text-gray-500">중복선택 가능</p>
            </div>

            <div className="mb-8 space-y-6">
              {Object.entries(groupedTechStacks).map(([category, stacks]) => (
                <div key={category}>
                  <h4 className="font-scdream6 text-regular text-bold mb-3">
                    {categoryMapping[category]}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {stacks.map(stack => (
                      <label
                        key={stack.id}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={(e) => handleToggleStack(e, stack.id)}
                      >
                        <div
                          className={`
                            w-4 h-4 border border-sub
                            ${selectedIds.includes(stack.id) ? 'bg-main' : 'bg-white'}
                          `}
                        />
                        <span className="font-scdream4 text-regular text-sub">
                          {stack.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
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

export default MainTechStackModal;