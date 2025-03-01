import React, { useState } from 'react';
import { useApplicationCreate } from '../../../hooks/api/useApplication';
import TextArea from '../../common/ui/TextArea';
import Button from '../../common/ui/Button';
import toast from 'react-hot-toast';
import { UserType } from '../../../types/models/meeting';
import { useNavigate } from 'react-router-dom';

interface ApplicationFormProps {
  meetingId: number;
  userType?: UserType;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  meetingId, 
  userType 
}) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const createApplication = useApplicationCreate();

  const handleSubmit = async () => {
    // 익명 사용자 처리
    if (userType === UserType.Anonymous) {
      toast.error('모임 지원을 위해서는 로그인이 필요합니다');
      navigate('/login');
      return;
    }

    if (!content.trim()) {
      toast.error('내용을 입력해주세요');
      return;
    }

    try {
      await createApplication.mutateAsync({
        meetingId,
        data: { content }
      });
      toast.success('지원서가 등록되었습니다');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className='w-full h-px bg-main my-10' />
      <p className='font-scdream6 text-label mb-6'>지원서</p>
      <TextArea
        placeholder="모임에 참여할 수 있도록 자신을 어필해주세요! 작성된 내용은 게시자 외 확인할 수 없습니다."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        bordered
        borderColor='border-sub'
        className="min-h-[150px] mb-4 bg-gray-100"
      />
      <div className="flex justify-end">
        <Button
          size='small'
          onClick={handleSubmit}
        >
          등록
        </Button>
      </div>
    </div>
  );
};

export default ApplicationForm;