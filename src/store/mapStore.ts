import { create } from 'zustand';
import { DURATION } from '../types/models/meeting';
import { SelectedLocation } from '../util/locationUtils';

export interface MapCoordinates {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface Filters {
  duration: DURATION | null;
  techStacks: number[];
  minParticipants: number;
  maxParticipants: number;
  location: SelectedLocation;
}

interface MapStoreState {
  searchTerm: string;
  filters: Filters;
  coordinates: MapCoordinates | null;
  isSearching: boolean;
  
  setSearchTerm: (term: string) => void;
  setDurations: (duration: DURATION | null) => void;
  setTechStacks: (techStacks: number[]) => void;
  setParticipants: (minParticipants: number, maxParticipants: number) => void;
  setLocation: (location: SelectedLocation) => void;
  setCoordinates: (coordinates: MapCoordinates) => void;
  resetFilters: () => void;
  setIsSearching: (isSearching: boolean) => void;
  
  getCoordinatesString: () => string | null;
  getSearchParams: () => { params: Record<string, any>, body: Record<string, any> };
}

const defaultFilters: Filters = {
  duration: null,
  techStacks: [],
  minParticipants: 1,
  maxParticipants: 5,
  location: {
    selectedSido: '',
    selectedSigunguList: []
  }
};

const useMapStore = create<MapStoreState>((set, get) => ({
  searchTerm: '',
  filters: defaultFilters,
  coordinates: null,
  isSearching: false,
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setDurations: (duration) => set((state) => ({
    filters: {
      ...state.filters,
      duration
    }
  })),
  
  setTechStacks: (techStacks) => set((state) => ({
    filters: {
      ...state.filters,
      techStacks
    }
  })),
  
  setParticipants: (minParticipants, maxParticipants) => set((state) => ({
    filters: {
      ...state.filters,
      minParticipants,
      maxParticipants
    }
  })),
  
  setLocation: (location) => set((state) => ({
    filters: {
      ...state.filters,
      location
    }
  })),
  
  setCoordinates: (coordinates) => set({ coordinates }),
  
  resetFilters: () => set((state) => ({
    filters: defaultFilters,
    coordinates: null
  })),
  
  setIsSearching: (isSearching) => set({ isSearching }),
  
  getCoordinatesString: () => {
    const coords = get().coordinates;
    if (!coords) return null;
    return `${coords.minLat},${coords.maxLat},${coords.minLng},${coords.maxLng}`;
  },
  
  // API 요청 시 사용할 파라미터 생성
  getSearchParams: () => {
    const state = get();
    const { searchTerm, filters } = state;
    
    const params: Record<string, any> = {};
    
    // URL 쿼리 파라미터 설정
    if (searchTerm) {
      params.title = searchTerm;
    }
    
    const coordsString = state.getCoordinatesString();
    if (coordsString) {
      params.c = coordsString;
    } else {
      // 좌표가 없을 경우 기본 좌표 제공 (서울 기준)
      params.c = '37.5,37.7,126.9,127.1';
    }
    
    // 페이지네이션 파라미터 (API는 0-based index 사용)
    params.page = 0;
    params.size = 4; // 페이지 크기 4로 변경
    
    const body: Record<string, any> = {};
    
    // 사용자가 선택한 필터 값만 포함 (API 요구사항)
    if (filters.duration) {
      body.duration = filters.duration;
    }
    
    if (filters.techStacks.length > 0) {
      body.techStacks = filters.techStacks;
    }
    
    // 기본값과 다른 경우에만 필터 적용
    if (filters.minParticipants !== defaultFilters.minParticipants) {
      body.minParticipants = filters.minParticipants;
    }
    
    if (filters.maxParticipants !== defaultFilters.maxParticipants) {
      body.maxParticipants = filters.maxParticipants;
    }
    
    // 지역 필터 추가
    if (filters.location.selectedSido && filters.location.selectedSigunguList.length > 0) {
      const sigungu = filters.location.selectedSigunguList[0];
      body.location = `${filters.location.selectedSido} ${sigungu.sigungu}`;
    }
    
    return { params, body };
  }
}));

export default useMapStore;