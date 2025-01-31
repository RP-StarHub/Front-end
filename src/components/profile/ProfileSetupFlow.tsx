import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileStore, ProfileStep } from '../../store/profile';
import { useAuthStore } from '../../store/auth';
import { useCreateProfile } from '../../hooks/api/useUser';
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
  const createProfile = useCreateProfile();

  const { currentStep, setStep, closeModal } = profileStore();
  const { user, setUser, accessToken } = useAuthStore();

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

  useEffect(() => {
    if (!user) {
      toast.error('로그인이 필요합니다. 로그인 페이지로 이동합니다.', {
        duration: 3000,
        position: 'top-center',
        style: {
          width: 1000,
          fontSize: '16px'
        }
      });
      navigate('/login');
    }
  }, [user, navigate]);

  const handleComplete = async () => {
    try {
      // 전화번호에서 하이픈 제거
      const profileData = profileStore.getState().formData;
      const phoneNumberWithoutHyphen = profileData.phoneNumber.replace(/-/g, '');

      // 받은 토큰으로 프로필 생성 API 호출
      const createProfileData = {
        ...profileData,
        phoneNumber: phoneNumberWithoutHyphen
      };

      const profileResponse = await createProfile.mutateAsync(createProfileData);

      setUser(
        {
          username: user!.username,
          isProfileComplete: true,
          nickname: profileResponse.data.data.nickname,
          profileImage: profileResponse.data.data.profileImage
        },
        accessToken!
      );

      closeModal();

      toast.success('프로필 작성이 완료되었습니다!', {
        duration: 3000,
        position: 'top-center',
        style: {
          width: 1000,
          fontSize: '16px'
        },
        icon: '✨',
      });

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