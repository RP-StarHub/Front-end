import React from 'react';
import Button from '../../common/ui/Button';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center py-8">
      <h2 className="text-bold text-big-title font-gmarket-bold">
        Welcome
      </h2>

      <p className="text-bold font-scdream6 text-page-title my-16 leading-20">
        StarHub는 별처럼 빛나는 여러분들을 모아 <br />
        스터디 및 프로젝트 모집을 돕는 사이트입니다
      </p>

      <div className="space-y-3 px-8">
        <Button
          size="medium"
          variant="secondary"
          fullWidth
          onClick={onNext}
        >
          프로필 만들기
        </Button>
      </div>
    </div>
  );
}