import React, { useState } from 'react';
import Button from '../../common/ui/Button';
import TextInput from '../../common/ui/TextInput';
import TextArea from '../../common/ui/TextArea';
import { profileStore } from '../../../store/profile';

interface BioStepProps {
  onPreview: () => void;
  onNext: () => void;
}

export default function BioStep({ onPreview, onNext }: BioStepProps) {
  const { formData, updateFormData } = profileStore();
  
  const [errors, setErrors] = useState({
    name: '',
    age: '',
    bio: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'age') {
      updateFormData({ [name]: value ? parseInt(value) : 0 });
    } else {
      updateFormData({ [name]: value });
    }

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      age: '',
      bio: ''
    };

    if (!formData.name?.trim()) {
      newErrors.name = '이름은 필수 입력 사항입니다.';
    } else if (formData.name.length < 2 || formData.name.length > 20) {
      newErrors.name = '이름은 2자 이상 20자 이하로 입력해주세요.';
    }

    if (!formData.age) {
      newErrors.age = '나이는 필수 입력 사항입니다.';
    } else if (!Number.isInteger(formData.age)) {
      newErrors.age = '숫자만 입력 가능합니다.';
    } else if (formData.age < 1 || formData.age > 100) {
      newErrors.age = '유효한 나이를 입력해주세요.';
    }

    if (!formData.bio?.trim()) {
      newErrors.bio = '한 줄 소개는 필수 입력 사항입니다.';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.age && !newErrors.bio;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-bold text-big-title font-gmarket-bold text-center">
        Profile
      </h2>

      <p className="text-bold font-scdream6 text-page-title my-4 leading-10 text-center">
        여러분들을 소개해주세요!
      </p>

      <p className="flex justify-center text-regular text-bold font-scdream4 mb-8 font-sc4">
        <span className="text-yellow mr-2">★</span>
        수집된 개인정보는 스터디/프로젝트 인원 확정 후 <br />
        글 작성자만 확인할 수 있습니다.
      </p>

      <div className="mb-6">
        <p className="text-label font-scdream6 text-bold mb-4">
          이름
        </p>
        <TextInput
          name="name"
          placeholder="여러분들의 이름을 입력해주세요"
          value={formData.name || ''}
          onChange={handleChange}
          error={errors.name}
          fullWidth
        />
      </div>

      <div className="mb-6">
        <p className="text-label font-scdream6 text-bold mb-4">
          나이
        </p>
        <TextInput
          name="age"
          placeholder="여러분들의 나이를 입력해주세요"
          value={formData.age ? formData.age.toString() : ''}
          onChange={handleChange}
          error={errors.age}
          fullWidth
        />
      </div>

      <div className="mb-6">
        <p className="text-label font-scdream6 text-bold mb-4">
          한 줄 소개
        </p>
        <TextArea
          name="bio"
          placeholder="여러분들을 간단히 소개해주세요"
          value={formData.bio || ''}
          onChange={handleChange}
          error={errors.bio}
          fullWidth
        />
      </div>

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
        onClick={handleNext}
        className="mt-4"
        size="small"
      >
        다음
      </Button>
    </div>
  );
}