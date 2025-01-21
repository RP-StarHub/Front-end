import { create } from 'zustand'

export enum ProfileStep {
  WELCOME = 'WELCOME',
  PHOTO = 'PHOTO',
  BIO = 'BIO',
  CONTACT = 'CONTACT'
}

interface ProfileState {
  // 프로필 모달 상태 
  isModalOpen: boolean;
  currentStep: ProfileStep;

  // 프로필 입력 폼 데이터
  formData: {
    profileImage: string;
    nickname: string;
    name: string;
    age: number;
    bio: string;
    email: string;
    phoneNumber: string;
  }

  openModal: () => void;
  closeModal: () => void;
  setStep: (step: ProfileStep) => void;
  updateFormData: (data: Partial<typeof FormData>) => void;
  resetForm: () => void;
}

export const profileStore = create<ProfileState>((set) => ({
  isModalOpen: false,
  currentStep: ProfileStep.WELCOME,
  formData: {
    profileImage: '',
    nickname: '',
    name: '',
    age: 0,
    bio: '',
    email: '',
    phoneNumber: '',
  },

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setStep: (step) => set({ currentStep: step }),
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  resetForm: () => set({
    currentStep: ProfileStep.WELCOME,
    formData: {
      profileImage: '',
      nickname: '',
      name: '',
      age: 0,
      bio: '',
      email: '',
      phoneNumber: '',
    }
  })
}))