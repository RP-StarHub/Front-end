import React from 'react';
import { profileStore, ProfileStep } from '../../store/profile';
import StepIndicator from '../common/ui/StepIndicator';
import WelcomeStep from './steps/WelcomeStep';
import PhotoStep from './steps/PhotoStep';
import BioStep from './steps/BioStep';
import ContactStep from './steps/ContactStep';

interface ProfileSetupFlowProps {
  onComplete: () => void;
}

export default function ProfileSetupFlow({ onComplete }: ProfileSetupFlowProps) {
  const { currentStep, setStep, closeModal } = profileStore();

  const steps = [
    { title: '기본 정보' },
    { title: '프로필 소개' },
    { title: '완료' }
  ];

  const handlePreview = () => {
    switch(currentStep) {
      case ProfileStep.PHOTO:
        setStep(ProfileStep.WELCOME);
        break;
      case ProfileStep.BIO:
        setStep(ProfileStep.PHOTO);
        break;
      case ProfileStep.CONTACT:
        setStep(ProfileStep.BIO);
        break;
    }
  };

  const handleComplete = () => {
    closeModal();
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-sub/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl">
        {currentStep !== ProfileStep.WELCOME && (
          <div className="px-8 pt-8">
            <StepIndicator 
              currentStep={Object.values(ProfileStep).indexOf(currentStep) - 1} 
              steps={steps} 
            />
          </div>
        )}

        <div className="p-8">
          {currentStep === ProfileStep.WELCOME && (
            <WelcomeStep 
              onNext={() => setStep(ProfileStep.PHOTO)} 
            />
          )}

          {currentStep === ProfileStep.PHOTO && (
            <PhotoStep
              onPreview={handlePreview}
              onNext={() => setStep(ProfileStep.BIO)}
            />
          )}

          {currentStep === ProfileStep.BIO && (
            <BioStep
              onPreview={handlePreview}
              onNext={() => setStep(ProfileStep.CONTACT)}
            />
          )}

          {currentStep === ProfileStep.CONTACT && (
            <ContactStep
              onPreview={handlePreview}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}