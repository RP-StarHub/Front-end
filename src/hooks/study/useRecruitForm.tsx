import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostCreate } from "../api/usePost";
import { PostRequest } from "../../types/api/post";
import { LatLng } from "../../types";

interface AddressObj {
  areaAddress: string;
  townAddress: string;
}

interface FormErrors {
  type?: string;
  skill?: string;
  peopleNum?: string;
  progress?: string;
  place?: string;
  deadline?: string;
  title?: string;
  content?: string;
}

export const useRecruitForm = () => {
  const navigate = useNavigate();
  const postCreate = usePostCreate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [formData, setFormData] = useState<PostRequest>({
    userId: userInfo?.userId || 0,
    skill: "",
    place: "",
    latitude: 0,
    longitude: 0,
    progress: "",
    peopleNum: 0,
    deadline: "",
    type: "",
    done: false,
    title: "",
    content: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [addressObj, setAddressObj] = useState<AddressObj>({
    areaAddress: "",
    townAddress: "",
  });

  const [latLng, setLatLng] = useState<LatLng>({
    latitude: null,
    longitude: null,
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.type) {
      newErrors.type = '모집 구분을 선택해주세요.';
    } else if (!['스터디', '프로젝트'].includes(formData.type)) {
      newErrors.type = '스터디 또는 프로젝트만 선택 가능합니다.';
    }

    if (!formData.skill) {
      newErrors.skill = '기술 스택을 입력해주세요.';
    }

    if (!formData.peopleNum) {
      newErrors.peopleNum = '모집 인원을 입력해주세요.';
    } else if (formData.peopleNum <= 0) {
      newErrors.peopleNum = '모집 인원은 1명 이상이어야 합니다.';
    }

    if (!formData.progress) {
      newErrors.progress = '진행 기간을 입력해주세요.';
    }

    if (!formData.place && !addressObj.townAddress) {
      newErrors.place = '진행 장소를 입력해주세요.';
    }

    if (!formData.deadline) {
      newErrors.deadline = '모집 마감일을 선택해주세요.';
    } else {
      const today = new Date();
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate < today) {
        newErrors.deadline = '마감일은 오늘 이후여야 합니다.';
      }
    }

    if (!formData.title) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!formData.content) {
      newErrors.content = '내용을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'peopleNum' ? Number(value) : value
    }));
    
    // 입력 시 해당 필드의 에러 메시지 초기화
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (!latLng.latitude || !latLng.longitude) {
        alert("주소를 선택해주세요.");
        return;
      }
      
      const postData: PostRequest = {
        ...formData,
        latitude: latLng.latitude,
        longitude: latLng.longitude,
        place: addressObj.townAddress,
      }

      await postCreate.mutateAsync(postData);

      alert("글이 등록되었습니다.");
      navigate("/");
    } catch (error) {
      alert("글 등록에 실패했습니다.");
      console.error("Error:", error);
    }
  };

  return {
    formData,
    errors,
    addressObj,
    latLng,
    setFormData,
    setAddressObj,
    setLatLng,
    handleInputChange,
    handleSubmit,
  };
};