import React from 'react';
import Button from './Button';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  anchorEl?: HTMLElement | null;
  width?: number;
  showConfirm?: boolean;
  onConfirm?: () => void;
  subTitle?: string;
}

const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  anchorEl,
  width = 400,
  showConfirm = true,
  onConfirm,
  subTitle
}: BaseModalProps) => {
  if (!isOpen || !anchorEl) return null;

  // 포지션 찾기
  const rect = anchorEl.getBoundingClientRect();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg"
        style={{
          top: `${rect.bottom + window.scrollY + 4}px`,
          left: `${rect.left + window.scrollX}px`,
          width: `${width}px`
        }}
      >
        <div className="p-4">
          <div className="flex items-center mb-6">
            <h3 className="font-gmarket-bold text-label text-bold">{title}</h3>
            {subTitle && (
              <div className="text-regular text-sub ml-4">{subTitle}</div>
            )}
          </div>

          <div className="mb-6">
            {children}
          </div>

          {showConfirm && (
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="small"
                onClick={handleConfirm}
              >
                확인
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BaseModal;