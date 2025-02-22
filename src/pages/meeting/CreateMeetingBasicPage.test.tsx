import React from 'react';
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import CreateMeetingBasicPage from "./CreateMeetingBasicPage";
import { RecruitmentType, DURATION } from "../../types/models/meeting";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MeetingFormState } from "../../store/meetingForm";
import toast from 'react-hot-toast';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockGeolocation = {
  location: { latitude: 37.123, longitude: 127.123 },
  loaded: true,
  error: null
};

jest.mock('../../hooks/common/useGeolocation', () => ({
  useGeolocation: () => mockGeolocation
}));

const MOCK_TECH_STACKS = [
  {
    id: 1,
    name: "React",
    category: "FRONTEND"
  },
  {
    id: 2,
    name: "Vue",
    category: "FRONTEND"
  }
];

jest.mock('../../hooks/api/useTechstack', () => ({
  useGetTechStack: () => ({
    data: MOCK_TECH_STACKS
  })
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn()
}));

jest.mock("../../components/meeting/form/AddressSearch", () => ({
  AddressSearch: ({ addressValue, error }: any) => (
    <div data-testid="address-search">
      <input 
        type="text"
        value={addressValue}
        readOnly={true}
        data-testid="address-input"
      />
      {error && <span data-testid="address-error">{error}</span>}
    </div>
  )
}));

jest.mock("../../components/common/ui/TextInput", () => {
  return function MockTextInput({ 
    "data-testid": dataTestId,
    error,
    fullWidth,
    inputSize,
    endIcon,
    ...props 
  }: any) {
    return (
      <div className={`mock-text-input ${fullWidth ? 'w-full' : ''}`}>
        <input
          data-testid={dataTestId}
          data-error={error}
          className={`text-input-size-${inputSize || 'medium'}`}
          {...props}
        />
        {endIcon && <div className="end-icon">{endIcon}</div>}
      </div>
    );
  };
});

const mockNaverMaps = {
  Map: jest.fn(() => ({
    setCenter: jest.fn(),
    destroy: jest.fn()
  })),
  Marker: jest.fn(() => ({
    setPosition: jest.fn(),
    setMap: jest.fn()
  })),
  LatLng: jest.fn(),
  Position: {
    TOP_RIGHT: 'top_right'
  }
};

Object.defineProperty(window, 'naver', {
  value: { maps: mockNaverMaps },
  writable: true
});

const MOCK_STORE_STATE: Partial<MeetingFormState> = {
  recruitmentType: RecruitmentType.STUDY,
  maxParticipants: 5,
  duration: DURATION.ONE_MONTH,
  endDate: "2024-03-01",
  location: {
    latitude: 37.123,
    longitude: 127.123
  },
  addressInfo: {
    areaAddress: "서울시",
    townAddress: "서울시 강남구"
  },
  techStacks: {
    selectedIds: [1, 2],
    customStacks: []
  },
  errors: {},
  setBasicInfo: jest.fn(),
  setLocation: jest.fn(),
  setAddressInfo: jest.fn(),
  setTechStacks: jest.fn(),
  handleInputChange: jest.fn(),
  validateBasicInfo: jest.fn(() => true)
};

const mockMeetingFormStore = jest.fn(() => MOCK_STORE_STATE);
jest.mock('../../store/meetingForm', () => ({
  useMeetingFormStore: () => mockMeetingFormStore()
}));

describe("CreateMeetingBasicPage 컴포넌트", () => {
  const setup = (props: Partial<MeetingFormState> = {}) => {
    mockMeetingFormStore.mockImplementation(() => ({
      ...MOCK_STORE_STATE,
      ...props
    }));

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        }
      }
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );

    const utils = render(
      <CreateMeetingBasicPage />,
      { wrapper }
    );

    return {
      getPageTitle: () => screen.getByTestId("page-title"),
      getPageSubtitle: () => screen.getByTestId("page-subtitle"),
      getRecruitmentSection: () => screen.getByTestId("recruitment-section"),
      getRecruitmentTypeInput: () => screen.getByTestId("recruitment-type-input"),
      getRecruitmentDropdown: () => screen.queryByTestId("recruitment-dropdown"),
      getRecruitmentOptionStudy: () => screen.queryByTestId("recruitment-option-study"),
      getRecruitmentOptionProject: () => screen.queryByTestId("recruitment-option-project"),
      getTechStackSection: () => screen.getByTestId("tech-stack-section"),
      getTechStackInput: () => screen.getByTestId("tech-stack-input"),
      getParticipantsSection: () => screen.getByTestId("participants-section"),
      getParticipantsInput: () => screen.getByTestId("participants-input"),
      getDurationSection: () => screen.getByTestId("duration-section"),
      getDurationInput: () => screen.getByTestId("duration-input"),
      getEndDateSection: () => screen.getByTestId("end-date-section"),
      getEndDateInput: () => screen.getByTestId("end-date-input"),
      getLocationSection: () => screen.getByTestId("location-section"),
      getAddressSearch: () => screen.getByTestId("address-search"),
      getMapContainer: () => screen.queryByTestId("map-container"),
      getNextButton: () => screen.getByTestId("next-button"),
      mockNavigate,
      mockSetBasicInfo: MOCK_STORE_STATE.setBasicInfo,
      mockSetTechStacks: MOCK_STORE_STATE.setTechStacks,
      mockValidateBasicInfo: MOCK_STORE_STATE.validateBasicInfo,
      ...utils,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      const { 
        getPageTitle,
        getPageSubtitle,
        getRecruitmentSection,
        getTechStackSection,
        getParticipantsSection,
        getDurationSection,
        getEndDateSection,
        getLocationSection,
        getNextButton 
      } = setup();

      // Assert
      expect(getPageTitle()).toBeInTheDocument();
      expect(getPageSubtitle()).toBeInTheDocument();
      expect(getRecruitmentSection()).toBeInTheDocument();
      expect(getTechStackSection()).toBeInTheDocument();
      expect(getParticipantsSection()).toBeInTheDocument();
      expect(getDurationSection()).toBeInTheDocument();
      expect(getEndDateSection()).toBeInTheDocument();
      expect(getLocationSection()).toBeInTheDocument();
      expect(getNextButton()).toBeInTheDocument();
    });

    it("좌표값이 있을 때만 지도가 표시되어야 한다", () => {
      // Arrange
      const { getMapContainer } = setup({
        location: {
          latitude: 37.123,
          longitude: 127.123
        }
      });

      // Assert
      expect(getMapContainer()).toBeInTheDocument();
    });

    it("좌표값이 없을 때는 지도가 표시되지 않아야 한다", () => {
      // Arrange
      const { getMapContainer } = setup({
        location: {
          latitude: null,
          longitude: null
        }
      });

      // Assert
      expect(getMapContainer()).not.toBeInTheDocument();
    });

    it("모집 구분의 초기값이 올바르게 표시되어야 한다", () => {
      // Arrange
      const { getRecruitmentTypeInput } = setup();

      // Assert
      expect(getRecruitmentTypeInput()).toHaveValue("스터디");
    });

    it("모집 인원이 올바르게 표시되어야 한다", () => {
      // Arrange
      const { getParticipantsInput } = setup({
        maxParticipants: 10
      });

      // Assert
      expect(getParticipantsInput()).toHaveValue("10명 이상");
    });
  });

  describe("사용자 동작 테스트", () => {
    it("다음 버튼 클릭시 유효성 검사가 실행되어야 한다", () => {
      // Arrange
      const { getNextButton, mockValidateBasicInfo } = setup();

      // Act
      fireEvent.click(getNextButton());

      // Assert
      expect(mockValidateBasicInfo).toHaveBeenCalled();
    });

    it("유효성 검사 실패시 에러 메시지가 표시되어야 한다", () => {
      // Arrange
      const { getNextButton } = setup({
        validateBasicInfo: jest.fn(() => false)
      });

      // Act
      fireEvent.click(getNextButton());

      // Assert
      expect(toast.error).toHaveBeenCalledWith('필수 정보를 모두 입력해주세요.');
    });

    it("유효성 검사 통과시 다음 페이지로 이동해야 한다", () => {
      // Arrange
      const { getNextButton, mockNavigate } = setup({
        validateBasicInfo: jest.fn(() => true)
      });

      // Act
      fireEvent.click(getNextButton());

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/meeting/create/detail');
    });

    it("모집 구분 버튼 클릭시 드롭다운이 표시되어야 한다", () => {
      // Arrange
      const { getRecruitmentTypeInput, getRecruitmentDropdown } = setup();

      // Act
      fireEvent.click(getRecruitmentTypeInput());

      // Assert
      expect(getRecruitmentDropdown()).toBeInTheDocument();
    });
  });

  describe("에러 케이스 테스트", () => {
    it("필수 정보 누락시 에러가 표시되어야 한다", () => {
      // Arrange
      const { getEndDateInput } = setup({
        errors: {
          endDate: "모집 마감일을 선택해주세요."
        }
      });
  
      // Assert
      expect(getEndDateInput()).toHaveAttribute("data-error", "모집 마감일을 선택해주세요.");
    });
  
    it("날짜가 과거일 경우 에러가 표시되어야 한다", () => {
      // Arrange
      const pastDate = "2023-01-01";
      const { getEndDateInput } = setup({
        endDate: pastDate,
        errors: {
          endDate: "마감일은 오늘 이후여야 합니다."
        }
      });
  
      // Assert
      expect(getEndDateInput()).toHaveAttribute("data-error", "마감일은 오늘 이후여야 합니다.");
    });
  
    it("기술 스택이 선택되지 않은 경우 에러가 표시되어야 한다", () => {
      // Arrange
      const { getTechStackInput } = setup({
        techStacks: {
          selectedIds: [],
          customStacks: []
        },
        errors: {
          techStacks: "기술 스택을 1개 이상 선택해주세요."
        }
      });
  
      // Assert
      expect(getTechStackInput()).toHaveAttribute("data-error", "기술 스택을 1개 이상 선택해주세요.");
    });
  });  
});