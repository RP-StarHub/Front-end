import React, { useState } from 'react';
import StepIndicator from '../common/ui/StepIndicator';
import WelcomeStep from './steps/WelcomeStep';
import PhotoStep from './steps/PhotoStep';
import PhotoUploadStep from './steps/PhotoUploadStep';
import BioStep from './steps/BioStep';
import CompletionStep from './steps/CompletionStep';
import { useNavigate } from 'react-router-dom';

export enum ProfileStep {
  WELCOME = 0,
  PHOTO = 1,
  BIO = 2,
  CONTACT = 3
}

export default function ProfileSetupFlow() {
  const [currentStep, setCurrentStep] = useState<ProfileStep>(ProfileStep.WELCOME);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();

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
            <StepIndicator currentStep={currentStep - 1} steps={steps} />
          </div>
        )}

        {/* 모달 세부 내용 */}
        <div className="p-8">
          {currentStep === ProfileStep.WELCOME && (
            <WelcomeStep onNext={handleNext} />
          )}

          {currentStep === ProfileStep.PHOTO && (
            <PhotoStep
              onNext={handleNext}
              onOpenPhotoSelect={() => setShowPhotoUpload(true)}
              selectedImage={selectedProfileImage}
            />
          )}

          {showPhotoUpload && (
            <PhotoUploadStep
              onClose={() => setShowPhotoUpload(false)}
              onSelect={(image) => {
                setSelectedProfileImage(image);
                setShowPhotoUpload(false);
              }}
            />
          )}

          {currentStep === ProfileStep.BIO && (
            <BioStep onNext={handleNext} />
          )}

          {currentStep === ProfileStep.CONTACT && (
            <CompletionStep
              onComplete={() => {
                navigate('/');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
