import { create } from 'zustand'

export enum ProfileStep {
  WELCOME = 'WELCOME',
  PHOTO = 'PHOTO',
  BIO = 'BIO',
  CONTACT = 'CONTACT'
}

interface ProfileFormData {
  profileImage: string;
  nickname: string;
  name: string;
  age: number;
  bio: string;
  email: string;
  phoneNumber: string;
}

interface ProfileState {
  isModalOpen: boolean;
  currentStep: ProfileStep;
  formData: ProfileFormData;

  openModal: () => void;
  closeModal: () => void;
  setStep: (step: ProfileStep) => void;
  updateFormData: (data: Partial<ProfileFormData>) => void;
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