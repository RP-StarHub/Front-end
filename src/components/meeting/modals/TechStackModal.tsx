import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import Button from '../../common/ui/Button';
import { useGetTechStack } from '../../../hooks/api/useTechstack';
import { TechCategory } from '../../../types/models/techstack';

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (techStacks: {
    selectedIds: number[],
    customStacks: string[]
  }) => void;
  selectedTechStacks?: {
    selectedIds: number[],
    customStacks: string[]
  };
}

const TechStackModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedTechStacks = { selectedIds: [], customStacks: [] }
}: TechStackModalProps) => {
  // API 데이터 페칭
  const { data: techStacksData, isLoading } = useGetTechStack();
  
  // 상태 관리
  const [selectedIds, setSelectedIds] = useState<number[]>(selectedTechStacks.selectedIds);
  const [customStack, setCustomStack] = useState<string>('');
  const [customStacks, setCustomStacks] = useState<string[]>(selectedTechStacks.customStacks);

  if (!isOpen) return null;
  if (isLoading) return <div>Loading...</div>;
  if (!techStacksData?.data) return null;

  // 카테고리별로 기술스택 그룹화
  const groupedTechStacks = techStacksData.data.reduce((acc, stack) => {
    const category = stack.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(stack);
    return acc;
  }, {} as Record<string, typeof techStacksData.data>);

  // 카테고리 한글 매핑
  const categoryMapping: Record<string, string> = {
    [TechCategory.FRONTEND.toLowerCase()]: '프론트엔드',
    [TechCategory.BACKEND.toLowerCase()]: '백엔드',
    [TechCategory.MOBILE.toLowerCase()]: '모바일'
  };

  const handleToggleStack = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleCustomStackInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.includes(' ')) {
      setCustomStack(e.target.value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
      
      const trimmedValue = customStack.trim();
      if (trimmedValue && !customStacks.includes(trimmedValue)) {
        setCustomStacks(prev => [...prev, trimmedValue]);
        setCustomStack('');
      }
    }
  };

  const handleConfirm = () => {
    const finalCustomStacks = [...customStacks];
    if (customStack.trim() && !customStacks.includes(customStack.trim())) {
      finalCustomStacks.push(customStack.trim());
    }
    
    onSelect({
      selectedIds,
      customStacks: finalCustomStacks
    });
    onClose();
  };

  const handleRemoveCustomStack = (stack: string) => {
    setCustomStacks(prev => prev.filter(s => s !== stack));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div className="relative bg-white p-8 rounded-xl shadow-lg min-w-[400px]">
        <div className="flex items-center mb-6">
          <h3 className="font-gmarket-bold text-label text-bold">기술 스택</h3>
          <span className="ml-4 text-regular text-sub">중복선택 가능</span>
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
                    onClick={() => handleToggleStack(stack.id)}
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

          <div>
            <h4 className="font-scdream6 text-regular text-bold mb-3">기타</h4>
            <input
              type="text"
              value={customStack}
              onChange={handleCustomStackInput}
              onKeyDown={handleKeyDown}
              placeholder="스페이스바로 구분"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-main text-regular mb-4"
            />
            {customStacks.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {customStacks.map(stack => (
                    <div 
                      key={stack}
                      className="inline-flex items-center bg-gray-100 rounded-sm px-4 py-1"
                    >
                      <span className="text-regular text-bold">{stack}</span>
                      <button
                        onClick={() => handleRemoveCustomStack(stack)}
                        className="ml-2 text-regular text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default TechStackModal;