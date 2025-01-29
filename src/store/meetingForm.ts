import { create } from 'zustand';
import { RecruitmentType, DURATION } from '../types/models/meeting';
import { CreateMeetingRequest } from '../types/api/meeting';
import { TechStackState } from '../types/models/techstack';
import { LatLng } from '../types/models/common';

interface AddressInfo {
  areaAddress: string;
  townAddress: string;
}

interface MeetingFormErrors {
  recruitmentType?: string;
  maxParticipants?: string;
  duration?: string;
  endDate?: string;
  location?: string;
  title?: string;
  description?: string;
  goal?: string;
  techStacks?: string;
}

interface MeetingFormState {
  recruitmentType: RecruitmentType;
  maxParticipants: number;
  duration: DURATION | undefined;
  endDate: string;
  location: LatLng;
  addressInfo: AddressInfo;
  title: string;
  description: string;
  goal: string;
  otherInfo: string;
  techStacks: TechStackState;
  errors: MeetingFormErrors;

  setBasicInfo: (data: {
    recruitmentType?: RecruitmentType;
    maxParticipants?: number;
    duration?: DURATION;
    endDate?: string;
    title?: string;
  }) => void;

  setLocation: (location: LatLng) => void;
  setAddressInfo: (addressInfo: AddressInfo) => void;
  setDetailInfo: (data: {
    description?: string;
    goal?: string;
    otherInfo?: string;
  }) => void;
  setTechStacks: (techStacks: TechStackState) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setError: (field: keyof MeetingFormErrors, message: string) => void;
  clearErrors: () => void;
  validateBasicInfo: () => boolean;
  validateDetailInfo: () => boolean;
  validateForm: () => boolean;
  getCreateMeetingRequest: () => CreateMeetingRequest;
  reset: () => void;
}

const initialState = {
  recruitmentType: RecruitmentType.STUDY,
  maxParticipants: 1,
  duration: undefined as DURATION | undefined,
  endDate: '',
  location: {
    latitude: null,
    longitude: null,
  } as LatLng,
  addressInfo: {
    areaAddress: '',
    townAddress: '',
  },
  title: '',
  description: '',
  goal: '',
  otherInfo: '',
  techStacks: {
    selectedIds: [],
    customStacks: []
  } as TechStackState,
  errors: {},
} as const;

export const useMeetingFormStore = create<MeetingFormState>((set, get) => ({
  ...initialState,

  setBasicInfo: (data) => {
    set((state) => {
      const newState = {
        ...state,
        ...data,
        errors: {
          ...state.errors,
          ...Object.keys(data).reduce((acc, key) => ({
            ...acc,
            [key]: undefined
          }), {})
        }
      };
      return newState;
    });
  },

  setLocation: (location) => {
    set((state) => ({
      ...state,
      location
    }));
  },

  setAddressInfo: (addressInfo) => {
    set((state) => ({
      ...state,
      addressInfo,
      errors: {
        ...state.errors,
        location: undefined
      }
    }));
  },

  setDetailInfo: (data) => {
    set((state) => ({
      ...state,
      ...data,
      errors: {
        ...state.errors,
        ...Object.keys(data).reduce((acc, key) => ({
          ...acc,
          [key]: undefined
        }), {})
      }
    }));
  },

  setTechStacks: (techStacks) => {
    set((state) => ({
      ...state,
      techStacks,
      errors: {
        ...state.errors,
        techStacks: undefined
      }
    }));
  },

  handleInputChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      ...state,
      [name]: value,
      errors: {
        ...state.errors,
        [name]: undefined
      }
    }));
  },

  setError: (field, message) => {
    set((state) => ({
      ...state,
      errors: { ...state.errors, [field]: message }
    }));
  },

  clearErrors: () => {
    set((state) => ({
      ...state,
      errors: {}
    }));
  },

  validateBasicInfo: () => {
    const state = get();
    const newErrors: MeetingFormErrors = {};

    if (!state.duration) {
      newErrors.duration = '진행 기간을 선택해주세요.';
    }

    if (!state.maxParticipants || state.maxParticipants <= 0) {
      newErrors.maxParticipants = '모집 인원은 1명 이상이어야 합니다.';
    }

    if (!state.endDate) {
      newErrors.endDate = '모집 마감일을 선택해주세요.';
    } else {
      const today = new Date();
      const deadlineDate = new Date(state.endDate);
      if (deadlineDate < today) {
        newErrors.endDate = '마감일은 오늘 이후여야 합니다.';
      }
    }

    if (state.techStacks.selectedIds.length === 0 && state.techStacks.customStacks.length === 0) {
      newErrors.techStacks = '기술 스택을 1개 이상 선택해주세요.';
    }

    if (!state.addressInfo.townAddress) {
      newErrors.location = '진행 장소를 선택해주세요.';
    }

    set((state) => ({ ...state, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  },

  validateDetailInfo: () => {
    const state = get();
    const newErrors: MeetingFormErrors = {};

    if (!state.title) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!state.description) {
      newErrors.description = '스터디/프로젝트 소개를 입력해주세요.';
    }

    if (!state.goal) {
      newErrors.goal = '목표를 입력해주세요.';
    }

    set((state) => ({ ...state, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  },

  validateForm: () => {
    const isBasicValid = get().validateBasicInfo();
    const isDetailValid = get().validateDetailInfo();
    return isBasicValid && isDetailValid;
  },

  getCreateMeetingRequest: () => {
    const state = get();
    if (!state.duration) {
      throw new Error('Duration is required for creating meeting');
    }

    return {
      recruitmentType: state.recruitmentType,
      maxParticipants: state.maxParticipants,
      duration: state.duration,
      endDate: state.endDate,
      location: state.addressInfo.townAddress,
      latitude: state.location.latitude!,
      longitude: state.location.longitude!,
      title: state.title,
      description: state.description,
      goal: state.goal,
      otherInfo: state.otherInfo,
      techStackIds: state.techStacks.selectedIds,
      otherTechStacks: state.techStacks.customStacks
    };
  },

  reset: () => set(initialState),
}));