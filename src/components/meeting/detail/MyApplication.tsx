import React, { useState } from 'react'
import { Edit, Delete } from '@mui/icons-material';
import { useApplicationMe, useApplicationPatch, useApplicationDelete } from '../../../hooks/api/useApplication'
import TextArea from '../../common/ui/TextArea';
import Button from '../../common/ui/Button';
import toast from 'react-hot-toast';

interface MyApplicationProps {
  meetingId: number
}

const MyApplication: React.FC<MyApplicationProps> = ({ meetingId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const { data, isLoading } = useApplicationMe(meetingId);
  const updateApplication = useApplicationPatch();
  const deleteApplication = useApplicationDelete();

  if (isLoading || !data) return <div>Loading...</div>;

  const application = data?.data;

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await updateApplication.mutateAsync({
          meetingId,
          data: { content }
        });
        setIsEditing(false);
        toast.success('수정 성공');
      } catch (error) {
        toast.error('지원서 수정에 실패했습니다. 잠시 뒤에 시도해주세요.');
        console.error('지원서 수정 실패:', error);
      }
    } else {
      setContent(application.content);
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication.mutateAsync(meetingId);
      toast.success('삭제 성공');
    } catch (error) {
      toast.error('지원서 삭제에 실패했습니다. 잠시 뒤에 시도해주세요.');
      console.error('지원서 삭제 실패:', error);
    }
  };

  return (
    <div>
      <div className='w-full h-px bg-main my-10' />
      <div className='flex justify-between items-center mb-6'>
        <p className='font-scdream6 text-label'>지원서</p>
        <div>
          <button onClick={handleEdit}>
            <Edit sx={{ fontSize: 24, color: "#313866", marginRight: 2 }} />
          </button>
          <button onClick={handleDelete}>
            <Delete sx={{ fontSize: 24, color: "#313866" }} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            borderColor='border-sub'
            className="min-h-[150px] mb-4 bg-gray-100"
          />
          <div className="flex justify-end">
            <Button
              size='small'
              onClick={handleEdit}
            >
              수정완료
            </Button>
          </div>
        </div>
      ) : (
        <div className='px-6 py-4 my-4 text-regular text-bold border-4 border-sub rounded-2xl'>
          <p className='mb-4'>{application.applicant.nickname}</p>
          <p>{application.content}</p>
        </div>
      )}
    </div>
  )
}

export default MyApplication;