import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Star } from '@mui/icons-material';
import { useMyProfile } from '../../hooks/api/useMypage';
import TextInput from '../../components/common/ui/TextInput';
import TextArea from '../../components/common/ui/TextArea';
import Button from '../../components/common/ui/Button';
import PhotoUploadStep from '../../components/profile/steps/PhotoUploadStep';
import toast from 'react-hot-toast';

interface FormData {
  age: string;
  email: string;
  phoneNumber: string;
  nickname: string;
  bio: string;
  profileImage: string;
}

function ProfileEditPage() {
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useMyProfile();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    email: '',
    phoneNumber: '',
    nickname: '',
    bio: '',
    profileImage: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (profileData) {
      setFormData({
        age: profileData.age?.toString() || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        nickname: profileData.name || '',
        bio: profileData.bio || '',
        profileImage: profileData.profileImage || ''
      });
    }
  }, [profileData]);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) newErrors.email = '이메일을 입력해주세요';
    if (!formData.phoneNumber) newErrors.phoneNumber = '연락처를 입력해주세요';
    if (!formData.nickname) newErrors.nickname = '닉네임을 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      navigate('/mypage');
      toast.success('프로필이 수정되었습니다.')
    } catch (error) {
      console.error('프로필 수정 실패:', error);
    }
  };

  const handleCancel = () => {
    navigate('/mypage');
  };

  const handlePhotoSelect = (profileUrl: string) => {
    setFormData(prev => ({
      ...prev,
      profileImage: profileUrl
    }));
  };

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className='flex flex-col w-full py-20 bg-background justify-center items-center'>
      <div className='bg-white w-1/2 rounded-2xl px-40 py-12 shadow-md'>
        <div className='flex flex-col items-center mb-8'>
          <div
            className='relative w-52 h-52 rounded-full overflow-hidden cursor-pointer group'
            onClick={() => setShowPhotoModal(true)}
          >
            <img
              src={formData.profileImage}
              alt="프로필"
              className="w-full h-full object-cover"
            />
            <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100'>
              <span className='text-white text-sm'>수정</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <h2 className="text-label text-bold font-scdream6">프로필 수정</h2>
            <Edit className="text-bold" />
          </div>
        </div>

        <div className="w-full h-px bg-bold my-8" />

        <div className="flex items-center gap-2 mb-12">
          <Star className="text-yellow" sx={{ fontSize: 30 }} />
          <p className="text-label font-scdream6 text-bold">
            수집된 개인정보는 스터디/프로젝트 최종 모임원으로 확정 된 사용자만 확인할 수 있습니다.
          </p>
        </div>

        <div className='flex flex-col gap-6'>
          <div>
            <label className="font-scdream6 text-label text-bold block mb-4">나이</label>
            <TextInput
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="나이를 입력해주세요"
              fullWidth
              inputSize="medium"
              bordered
              error={errors.age}
            />
          </div>

          <div>
            <label className="font-scdream6 text-label text-bold block mb-4">이메일</label>
            <TextInput
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력해주세요"
              fullWidth
              inputSize="medium"
              bordered
              error={errors.email}
            />
          </div>

          <div>
            <label className="font-scdream6 text-label text-bold block mb-4">연락처</label>
            <TextInput
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="연락처를 입력해주세요"
              fullWidth
              inputSize="medium"
              bordered
              error={errors.phoneNumber}
            />
          </div>

          <div>
            <label className="font-scdream6 text-label text-bold block mb-4">닉네임</label>
            <TextInput
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력해주세요"
              fullWidth
              inputSize="medium"
              bordered
              error={errors.nickname}
            />
          </div>

          <div>
            <label className="font-scdream6 text-label text-bold block mb-4">한 줄 소개</label>
            <TextArea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="자기소개를 간단히 입력해주세요"
              fullWidth
              inputSize="medium"
              bordered
              error={errors.bio}
              className="h-40"
            />
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-8">
          <Button
            onClick={handleCancel}
            variant="secondary"
            fullWidth
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="secondary"
            fullWidth
          >
            프로필 수정
          </Button>
        </div>
      </div>

      {showPhotoModal && (
        <PhotoUploadStep
          onClose={() => setShowPhotoModal(false)}
          onSelect={handlePhotoSelect}
        />
      )}
    </div>
  );
}

export default ProfileEditPage;