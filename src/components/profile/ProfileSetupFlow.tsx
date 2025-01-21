import React, { useState } from 'react';
import StepIndicator from '../common/ui/StepIndicator';
import WelcomeStep from './steps/WelcomeStep';
import PhotoStep from './steps/PhotoStep';
import PhotoUploadStep from './steps/PhotoUploadStep';
import BioStep from './steps/BioStep';
import ContactStep from './steps/ContactStep';

export enum ProfileStep {
  WELCOME = 0,
  PHOTO = 1,
  BIO = 2,
  CONTACT = 3
}

interface ProfileSetupFlowProps {
  onComplete: () => void;
}

export default function ProfileSetupFlow({ onComplete }: ProfileSetupFlowProps) {
  const [currentStep, setCurrentStep] = useState<ProfileStep>(ProfileStep.WELCOME);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);

  const steps = [
    { title: '기본 정보' },
    { title: '프로필 소개' },
    { title: '완료' }
  ];

  const handlePreview = () => {
    setCurrentStep(prev => prev - 1 as ProfileStep);
  }

  const handleNext = () => {
    setCurrentStep(prev => prev + 1 as ProfileStep);
  };

  return (
    <div className="fixed inset-0 bg-sub/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl">
        {currentStep !== ProfileStep.WELCOME && (
          <div className="px-8 pt-8">
            <StepIndicator currentStep={currentStep - 1} steps={steps} />
          </div>
        )}

        <div className="p-8">
          {currentStep === ProfileStep.WELCOME && (
            <WelcomeStep onNext={handleNext} />
          )}

          {currentStep === ProfileStep.PHOTO && (
            <PhotoStep
              onPreview={handlePreview}
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
            <BioStep
              onPreview={handlePreview}
              onNext={handleNext}
            />
          )}

          {currentStep === ProfileStep.CONTACT && (
            <ContactStep
              onPreview={handlePreview}
              onComplete={onComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}