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
}

const InputWithIcon: React.FC<InputWithIconProps> = ({ 
  icon: Icon,
  children,
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute left-4 top-[22px] text-sub">
        <Icon />
      </div>
      {children}
    </div>
  );
};

export default InputWithIcon;