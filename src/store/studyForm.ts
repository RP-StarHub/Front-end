import { create } from 'zustand';
import { PostRequest } from '../types/api/post';
import { LatLng } from '../types/models/common';
import { AddressObj, FormErrors } from '../types/models/study';
import { useAuthStore } from './auth';

interface StudyFormState {
  formData: PostRequest;
  addressInfo: AddressObj;
  location: LatLng;
  errors: FormErrors;
  
  setFormData: (data: Partial<PostRequest>) => void;
  setAddressInfo: (addressInfo: AddressObj) => void;
  setLocation: (location: LatLng) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setError: (field: keyof FormErrors, message: string) => void;
  clearErrors: () => void;
  resetForm: () => void;
  validateForm: () => boolean;
  handleSubmit: (postCreate: any) => Promise<void>;
}

const initialFormData: PostRequest = {
  userId: useAuthStore.getState().user?.userId || 0,
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
};

export const useStudyFormStore = create<StudyFormState>()((set, get) => ({
  formData: initialFormData,
  addressInfo: {
    areaAddress: "",
    townAddress: ""
  },
  location: {
    latitude: null,
    longitude: null
  },
  errors: {},

  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  setAddressInfo: (addressInfo) => set({ addressInfo }),

  setLocation: (location) => set({ location }),

  handleInputChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: name === 'peopleNum' ? Number(value) : value
      },
      errors: {
        ...state.errors,
        [name]: undefined
      }
    }));
  },

  setError: (field, message) => set((state) => ({
    errors: { ...state.errors, [field]: message }
  })),

  clearErrors: () => set({ errors: {} }),

  resetForm: () => set({
    formData: initialFormData,
    addressInfo: { areaAddress: "", townAddress: "" },
    location: { latitude: null, longitude: null },
    errors: {}
  }),

  validateForm: () => {
    const { formData, addressInfo } = get();
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

    if (!formData.place && !addressInfo.townAddress) {
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

    set({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  },

  handleSubmit: async (postCreate) => {
    const { formData, location: latLng, addressInfo, validateForm } = get();

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
        place: addressInfo.townAddress,
      }

      await postCreate.mutateAsync(postData);
      alert("글이 등록되었습니다.");
    } catch (error) {
      alert("글 등록에 실패했습니다.");
      console.error("Error:", error);
    }
  },
}));