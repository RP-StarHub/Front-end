import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostCreate } from "../api/usePost";
import { PostRequest } from "../../types/api/post";
import { LatLng } from "../../types";

interface AddressObj {
  areaAddress: string;
  townAddress: string;
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
  
  const [addressObj, setAddressObj] = useState<AddressObj>({
    areaAddress: "",
    townAddress: "",
  });

  const [latLng, setLatLng] = useState<LatLng>({
    latitude: null,
    longitude: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'peopleNum' ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
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
    addressObj,
    latLng,
    setFormData,
    setAddressObj,
    setLatLng,
    handleInputChange,
    handleSubmit,
  };
};