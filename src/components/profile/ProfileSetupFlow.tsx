import React from 'react';
import { useNavigate } from 'react-router-dom';
import { profileStore, ProfileStep } from '../../store/profile';
import { useAuthStore } from '../../store/auth';
import { useLogin, useCreateProfile } from '../../hooks/api/useUser';
import { getTokensFromResponse } from '../../services/api/axios';
import toast from 'react-hot-toast';
import StepIndicator from '../common/ui/StepIndicator';
import WelcomeStep from './steps/WelcomeStep';
import PhotoStep from './steps/PhotoStep';
import BioStep from './steps/BioStep';
import ContactStep from './steps/ContactStep';

interface ProfileSetupFlowProps {
  onComplete: () => void;
}

export default function ProfileSetupFlow({ onComplete }: ProfileSetupFlowProps) {
  const navigate = useNavigate();
  const login = useLogin();
  const createProfile = useCreateProfile();

  const { currentStep, setStep, closeModal } = profileStore();
  const { pendingCredentials, setUser, clearPendingCredentials } = useAuthStore();

  const steps = [
    { title: '기본 정보' },
    { title: '프로필 소개' },
    { title: '완료' }
  ];

  const handlePreview = () => {
    switch (currentStep) {
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
      // 로그인해서 토큰 받기
      const loginResponse = await login.mutateAsync(pendingCredentials);
      const { data: loginData } = loginResponse.data;
      const accessToken = getTokensFromResponse(loginResponse);

      // 토큰 저장 먼저 수행
      setUser(
        {
          username: loginData.username,
          nickname: null,
          isProfileComplete: false
        },
        accessToken
      );

      // 전화번호에서 하이픈 제거
      const profileData = profileStore.getState().formData;
      const phoneNumberWithoutHyphen = profileData.phoneNumber.replace(/-/g, '');

      // 잠시 대기하여 토큰이 저장되고 인터셉터에 적용되도록 함
      await new Promise(resolve => setTimeout(resolve, 100));

      // 받은 토큰으로 프로필 생성 API 호출
      const createProfileData = {
        ...profileData,
        phoneNumber: phoneNumberWithoutHyphen
      };

      console.log('AccessToken:', accessToken);
      const profileResponse = await createProfile.mutateAsync(createProfileData);

      // 프로필 생성 성공 후 최종 유저 정보 업데이트
      setUser(
        {
          username: loginData.username,
          nickname: profileResponse.data.data.nickname,
          isProfileComplete: true
        },
        accessToken
      );

      clearPendingCredentials();
      closeModal();
      onComplete();
    } catch (error: any) {
      console.error('프로필 설정 실패:', error);
      if (error.response) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message || '입력하신 정보를 다시 확인해주세요', {
            duration: 3000,
            position: 'top-center',
            style: {
              width: 1000,
              fontSize: '16px'
            }
          });
        } else if (error.response?.status === 409) {
          toast.error('이미 프로필이 존재합니다. 메인 페이지로 이동합니다.', {
              duration: 3000,
              position: 'top-center',
              style: {
                width: 1000,
                fontSize: '16px'
              }
            });
          navigate('/');
        }
      }
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