import React, { useState } from 'react';
import Button from '../../common/ui/Button';
import TextInput from '../../common/ui/TextInput';

interface CompletionStepProps {
  onComplete: () => void;
}

export default function CompletionStep({ onComplete }: CompletionStepProps) {
  const [formData, setFormData] = useState({
    email: '',
    phoneNum: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          onClick={onComplete}
          size="small"
        >
          완료
        </Button>
      </div>
    </div>
  );
}