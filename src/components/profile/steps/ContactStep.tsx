import React, { useState, useEffect } from 'react';
import Button from '../../common/ui/Button';
import TextInput from '../../common/ui/TextInput';
import { profileStore } from '../../../store/profile';

interface ContactStepProps {
  onPreview: () => void;
  onComplete: () => void;
}

export default function ContactStep({ onPreview, onComplete }: ContactStepProps) {
  const updateFormData = profileStore(state => state.updateFormData);
  const storedFormData = profileStore(state => state.formData);
  
  const [formData, setFormData] = useState({
    email: storedFormData.email || '',
    phoneNum: storedFormData.phoneNumber || ''
  });

  const [errors, setErrors] = useState({
    email: '',
    phoneNum: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 전화번호 자동 하이픈 추가
    if (name === 'phoneNum') {
      const phoneNum = value.replace(/[^0-9]/g, '');
      if (phoneNum.length <= 11) {
        const formattedPhone = phoneNum.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        setFormData(prev => ({
          ...prev,
          [name]: formattedPhone
        }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      phoneNum: ''
    };

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email) {
      newErrors.email = '이메일은 필수 입력 사항입니다.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다. (예: starhub@starhub.com)';
    }

    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!formData.phoneNum) {
      newErrors.phoneNum = '전화번호는 필수 입력 사항입니다.';
    } else if (!phoneRegex.test(formData.phoneNum)) {
      newErrors.phoneNum = '올바른 전화번호 형식이 아닙니다. (예: 010-0000-0000)';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.phoneNum;
  };

  const handleComplete = () => {
    if (!validateForm()) return;

    updateFormData({
      email: formData.email,
      phoneNumber: formData.phoneNum
    });

    onComplete();
  };

  useEffect(() => {
    setFormData({
      email: storedFormData.email || '',
      phoneNum: storedFormData.phoneNumber || ''
    });
  }, [storedFormData]);

  return (
    <div className="p-8">
      <h2 className="text-bold text-big-title font-gmarket-bold text-center">
        Profile
      </h2>

      <p className="text-bold font-scdream6 text-page-title my-4 leading-10 text-center">
        여러분들의 연락처를 적어주세요
      </p>

      <p className="flex justify-center text-regular text-bold font-scdream4 mb-8 font-sc4">
        <span className="text-yellow mr-2">★</span>
        수집된 개인정보는 스터디/프로젝트 인원 확정 후 <br />
        글 작성자만 확인할 수 있습니다.
      </p>

      <div className="space-y-6">
        <div>
          <p className="text-label font-scdream6 text-bold mb-4">
            이메일
          </p>
          <TextInput
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            fullWidth
            bordered
            className="text-placeholder"
          />
        </div>

        <div>
          <p className="text-label font-scdream6 text-bold mb-4">
            전화번호
          </p>
          <TextInput
            type="text"
            name="phoneNum"
            placeholder="전화번호를 입력해주세요"
            value={formData.phoneNum}
            onChange={handleChange}
            error={errors.phoneNum}
            fullWidth
            bordered
            className="text-placeholder"
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          variant="secondary"
          fullWidth
          onClick={onPreview}
          className="mt-4"
          size="small"
        >
          이전
        </Button>

        <Button
          variant="secondary"
          fullWidth
          onClick={handleComplete}
          size="small"
        >
          완료
        </Button>
      </div>
    </div>
  );
}