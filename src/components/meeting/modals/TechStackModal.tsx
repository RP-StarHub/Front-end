import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import Button from '../../common/ui/Button';

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (techStacks: string[]) => void;
  selectedTechStacks?: string[];
}

const TechStackModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedTechStacks = []
}: TechStackModalProps) => {
  const [selectedStacks, setSelectedStacks] = useState<string[]>(selectedTechStacks);
  const [customStack, setCustomStack] = useState<string>('');
  const [customStacks, setCustomStacks] = useState<string[]>([]);

  if (!isOpen) return null;

  const techStacks = {
    프론트엔드: ['React', 'Vue', 'Angular', 'HTML/CSS'],
    백엔드: ['Spring', 'Spring Boot', 'Node.js', 'Django'],
    모바일: ['Swift', 'Kotlin', 'Flutter', 'ReactNative']
  };

  const handleToggleStack = (stack: string) => {
    setSelectedStacks(prev => 
      prev.includes(stack)
        ? prev.filter(s => s !== stack)
        : [...prev, stack]
    );
  };

  const handleCustomStackInput = (e: ChangeEvent<HTMLInputElement>) => {
    // 스페이스바 입력을 무시
    if (!e.target.value.includes(' ')) {
      setCustomStack(e.target.value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault(); // 스페이스바의 기본 동작 방지
      
      const trimmedValue = customStack.trim();
      if (trimmedValue) {
        if (!customStacks.includes(trimmedValue)) {
          setCustomStacks(prev => [...prev, trimmedValue]);
        }
        setCustomStack(''); // 입력 필드를 즉시 비움
      }
    }
  };

  const handleConfirm = () => {
    const finalStacks = [...selectedStacks];
    if (customStacks.length > 0) {
      finalStacks.push(...customStacks);
    }
    if (customStack.trim() && !customStacks.includes(customStack.trim())) {
      finalStacks.push(customStack.trim());
    }
    onSelect(finalStacks);
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
          {Object.entries(techStacks).map(([category, stacks]) => (
            <div key={category}>
              <h4 className="font-scdream6 text-regular text-bold mb-3">{category}</h4>
              <div className="grid grid-cols-2 gap-4">
                {stacks.map(stack => (
                  <label 
                    key={stack}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleToggleStack(stack)}
                  >
                    <div
                      className={`
                        w-4 h-4 border border-sub
                        ${selectedStacks.includes(stack) ? 'bg-main' : 'bg-white'}
                      `}
                    />
                    <span className="font-scdream4 text-regular text-sub">{stack}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h4 className="font-scdream6 text-regular text-main mb-3">기타</h4>
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