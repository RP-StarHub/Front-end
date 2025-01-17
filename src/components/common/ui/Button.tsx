import React from 'react';

// Button의 기본 속성들을 정의합니다.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 변형을 지정합니다.
   * - primary: 주요 액션에 사용 (#7C8BBE)
   * - secondary: 보조 액션에 사용 (#B3B4DC)
   */
  variant?: 'primary' | 'secondary';
  
  /**
   * 버튼의 크기를 지정합니다.
   * - small: 작은 버튼 (패딩: 8px 16px)
   * - medium: 중간 버튼 (패딩: 12px 24px)
   * - large: 큰 버튼 (패딩: 16px 32px)
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 버튼의 너비를 부모 요소의 100%로 설정할지 여부
   */
  fullWidth?: boolean;
}

const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  // 기본 스타일: 모든 버튼에 공통으로 적용되는 스타일
  const baseStyle = "rounded-lg font-scdream6 transition-colors";
  
  // 버튼 종류별 스타일
  const variantStyles = {
    primary: "bg-sub text-white hover:bg-main",
    secondary: "bg-main text-white hover:bg-sub"
  };
  
  // 버튼 크기별 패딩
  const sizeStyles = {
    small: "px-6 py-3 text-base",
    medium: "px-6 py-3 text-button",
    large: "px-8 py-4 text-button"
  };
  
  // 너비 스타일
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
