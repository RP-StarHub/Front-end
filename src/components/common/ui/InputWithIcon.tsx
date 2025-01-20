import React from 'react';

interface InputWithIconProps {
  /**
   * 입력 필드 왼쪽에 표시될 아이콘 컴포넌트
   */
  icon: React.ElementType;
  
  /**
   * 입력 필드 컴포넌트 (TextInput)
   */
  children: React.ReactNode;
  
  /**
   * 추가적인 스타일링을 위한 클래스명
   */
  className?: string;
  
  /**
   * 에러 메시지 (있을 경우 아이콘 스타일링에 영향을 줄 수 있음)
   */
  error?: string;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({ 
  icon: Icon,
  children,
  className = '',
  error
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-[22px] text-sub">
        <Icon />
      </div>
      {children}
    </div>
  );
};

export default InputWithIcon;