import React, { useState } from 'react'
import { useApplicationList } from '../../../hooks/api/useApplication'
import toast from 'react-hot-toast';
import Button from '../../common/ui/Button';

interface ApplicationListProps {
  meetingId: number
}

const ApplicationList: React.FC<ApplicationListProps> = ({ meetingId }) => {
  const [selectedApplication, setSelectedApplication] = useState<number[]>([]);
  const { data, isLoading } = useApplicationList(meetingId);

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
    toast.success(`${selectedApplication} 지원자 확정`);
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