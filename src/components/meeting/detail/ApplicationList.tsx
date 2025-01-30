import React, { useState } from 'react'
import { useApplicationList } from '../../../hooks/api/useApplication'
import toast from 'react-hot-toast';
import Button from '../../common/ui/Button';
import { useConfirmMeetingMembers } from '../../../hooks/api/useMeeting';
import { useNavigate } from 'react-router-dom';

interface ApplicationListProps {
  meetingId: number
}

const ApplicationList: React.FC<ApplicationListProps> = ({ meetingId }) => {
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<number[]>([]);
  const { data, isLoading } = useApplicationList(meetingId);
  const { mutate: confirmMembers } = useConfirmMeetingMembers(meetingId);

  if (isLoading || !data) return <div>Loading...</div>;

  const applications = data?.data || [];

  const handleApplicationClick = (applicationId: number) => {
    setSelectedApplication(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleConfirm = () => {
    if (selectedApplication.length === 0) {
      toast.error('확정할 지원자를 선택해주세요');
      return;
    }

    confirmMembers(
      { applicationIds: selectedApplication },
      {
        onSuccess: () => {
          toast.success('스터디원이 확정되었습니다');
          setSelectedApplication([]);
          navigate(`/applicant/list/${meetingId}`);
        },
        onError: (error) => {
          toast.error('스터디원 확정에 실패했습니다');
          console.error('Error confirming members:', error);
        }
      }
    );
  };

  if (applications.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center w-full py-20'>
        <p className='font-scdream6 text-sub text-lg mb-2'>아직 지원서가 없습니다.</p>
        <p className='font-scdream4 text-sub'>모임에 대한 자세한 소개를 적고 홍보하세요!</p>
      </div>
    );
  }
  
  return (
    <div className='w-full mt-8'>
      {applications.map((application) => (
        <div
          key={application.id}
          className={`
            px-6 py-4 my-8
            border-4 border-sub rounded-2xl 
            font-scdream4 text-regular text-bold cursor-pointer
            ${selectedApplication.includes(application.id)
              ? 'bg-sub text-white'
              : 'bg-none'
            }
          transition-colors duration-200
          `}
          onClick={() => handleApplicationClick(application.id)}
        >
          <p className='mb-4'>{application.applicant.nickname}</p>
          <p>{application.content}</p>
        </div>
      ))}
      <div className="flex justify-end">
        <Button
          variant='secondary'
          size='small'
          onClick={handleConfirm}
        >
          스터디원 확정
        </Button>
      </div>
    </div>
  )
}

export default ApplicationList