import React, { useState } from 'react';
import Button from '../../common/ui/Button';
import TextInput from '../../common/ui/TextInput';
import TextArea from '../../common/ui/TextArea';

interface BioStepProps {
  onNext: () => void;
}

export default function BioStep({ onNext }: BioStepProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bio: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          value={formData.name}
          onChange={handleChange}
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
          value={formData.age}
          onChange={handleChange}
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
          value={formData.bio}
          onChange={handleChange}
          fullWidth
        />
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={onNext}
        className="mt-8"
        size="small"
      >
        다음
      </Button>
    </div>
  );
}