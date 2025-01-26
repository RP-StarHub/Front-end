import React, { useState } from 'react';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isLoading } = useApplicationMe(meetingId);
  const updateApplication = useApplicationPatch();
  const deleteApplication = useApplicationDelete();

  if (isLoading || !data) return <div>Loading...</div>;

  const application = data?.data;

  const handleEdit = async () => {
    if (isEditing) {
      if (!content.trim()) {
        toast.error('내용을 입력해주세요');
        return;
      }

      try {
        await updateApplication.mutateAsync({
          meetingId,
          data: { content }
        });
        setIsEditing(false);
        toast.success('지원서가 수정되었습니다');
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      setContent(application.content);
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    await deleteApplication.mutateAsync(meetingId);
    setShowDeleteModal(false);
    toast.success('지원서가 삭제되었습니다');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
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
          <button onClick={confirmDelete}>
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

      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white p-8 rounded-xl shadow-lg min-w-[400px] text-center">
            <h3 className="font-scdream6 text-xl mb-6">정말 삭제하시겠습니까?</h3>
            <div className="flex justify-center gap-4">
              <Button
                size="small"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </Button>
              <Button
                size="small"
                onClick={handleDelete}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyApplication;