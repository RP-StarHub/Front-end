import React from 'react';
import { useNavigate } from 'react-router-dom';
import { profileStore, ProfileStep } from '../../store/profile';
import { useAuthStore } from '../../store/auth';
import { useLogin } from '../../hooks/api/useUser';
import StepIndicator from '../common/ui/StepIndicator';
import WelcomeStep from './steps/WelcomeStep';
import PhotoStep from './steps/PhotoStep';
import BioStep from './steps/BioStep';
import ContactStep from './steps/ContactStep';
import { getTokensFromResponse } from '../../services/api/axios';

interface ProfileSetupFlowProps {
  onComplete: () => void;
}

export default function ProfileSetupFlow({ onComplete }: ProfileSetupFlowProps) {
  const navigate = useNavigate();
  const login = useLogin();
  const { currentStep, setStep, closeModal } = profileStore();
  const { pendingCredentials, setUser, clearPendingCredentials } = useAuthStore();

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

  const handleComplete = async () => {
    // 펜딩 데이터가 없는 경우 로그인 페이지로 연결
    if (!pendingCredentials) {
      console.error('Pending credentials 없음');
      navigate('/login');
      return;
    }

    try {
      // 프로필 설정 완료 후 자동 로그인
      const response = await login.mutateAsync(pendingCredentials);
      const { data } = response.data;
      const accessToken = getTokensFromResponse(response);
      
      setUser(
        {
          username: data.username,
          nickname: data.nickname,
          isProfileComplete: true
        },
        accessToken
      );

      clearPendingCredentials();
      closeModal();
      onComplete();
    } catch (error) {
      console.error('자동 로그인 실패:', error);
      navigate('/login');
    }
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