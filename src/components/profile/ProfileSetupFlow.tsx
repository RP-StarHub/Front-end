import React, { useState } from 'react';
import WelcomeStep from './steps/WelcomeStep';
import StepIndicator from '../common/ui/StepIndicator';

export enum ProfileStep {
  WELCOME = 0,
  PHOTO = 1,
  BIO = 2,
  CONTACT = 3
}

export default function ProfileSetupFlow() {
  const [currentStep, setCurrentStep] = useState<ProfileStep>(ProfileStep.WELCOME);

  const steps = [
    { title: '기본 정보' },
    { title: '프로필 소개' },
    { title: '완료' }
  ];

  const handleNext = () => {
    setCurrentStep(prev => prev + 1 as ProfileStep);
  };

  return (
    <div className="fixed inset-0 bg-sub/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl">
        {/* StepIndicator는 경우에 따라 보임 */}
        {currentStep !== ProfileStep.WELCOME && (
          <div className="px-8 pt-8">
            <StepIndicator currentStep={currentStep} steps={steps} />
          </div>
        )}
        
        {/* 모달 세부 내용 */}
        <div className="p-8">
          {currentStep === ProfileStep.WELCOME && (
            <WelcomeStep onNext={handleNext} />
          )}
        </div>
      </div>
    </div>
  );
}
