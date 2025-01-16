import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 입력 필드의 레이블
   */
  label?: string;

  /**
   * 입력 필드의 크기를 지정합니다.
   * - small: 작은 입력 필드 (패딩: 8px 16px)
   * - medium: 중간 입력 필드 (패딩: 12px 24px)
   * - large: 큰 입력 필드 (패딩: 16px 32px)
   */
  inputSize?: 'small' | 'medium' | 'large';

  /**
   * 에러 메시지
   */
  error?: string;

  /**
   * 테두리 유무를 설정합니다.
   */
  bordered?: boolean;

  /**
   * 입력 필드의 너비를 부모 요소의 100%로 설정할지 여부
   */
  fullWidth?: boolean;
}

const TextInput = ({
  label,
  inputSize = 'medium',
  error,
  bordered = true,
  fullWidth = false,
  className = '',
  ...props
}: TextInputProps) => {
  // 기본 스타일에서 border 관련 스타일 분리
  const baseStyle = "rounded-lg font-scdream4 transition-colors focus:outline-none";
  
  // border 스타일 조건부 적용
  const borderStyle = bordered ? "border-4 border-solid border-main" : "border-0";
  
  // 입력 필드 크기별 패딩
  const sizeStyles = {
    small: "px-4 py-2 text-base",
    medium: "px-6 py-3 text-placeholder",
    large: "px-8 py-4 text-placeholder"
  };
  
  // 너비 스타일
  const widthStyle = fullWidth ? "w-full" : "";

  // 에러 스타일
  const errorStyle = error ? "border-red-500" : "";

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block mb-2 font-scdream6 text-label text-[#ADADAD]">
          {label}
        </label>
      )}
      <input
        className={`${baseStyle} ${borderStyle} ${sizeStyles[inputSize]} ${widthStyle} ${errorStyle} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-regular text-red-500 font-scdream4">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;