import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import CreateMeetingDetailPage from "./CreateMeetingDetailPage";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockNavigate = jest.fn();
const mockHandleInputChange = jest.fn();
const mockValidateDetailInfo = jest.fn(() => true);
const mockValidateForm = jest.fn(() => true);
const mockGetCreateMeetingRequest = jest.fn(() => ({
  title: "테스트 모임",
  description: "모임 설명",
  goal: "모임 목표",
  otherInfo: "기타 정보"
}));
const mockMutateAsync = jest.fn(() => Promise.resolve({
  data: { data: { id: 123 } }
}));

const originalConsoleError = console.error;
console.error = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

jest.mock('../../store/meetingForm', () => ({
  useMeetingFormStore: () => ({
    title: "테스트 모임",
    description: "모임 설명",
    goal: "모임 목표",
    otherInfo: "기타 정보",
    errors: {},
    handleInputChange: mockHandleInputChange,
    validateDetailInfo: mockValidateDetailInfo,
    validateForm: mockValidateForm,
    getCreateMeetingRequest: mockGetCreateMeetingRequest
  })
}));

jest.mock('../../hooks/api/useMeeting', () => ({
  useCreateMeeting: () => ({
    mutateAsync: mockMutateAsync,
    isLoading: false
  })
}));

jest.mock("../../components/common/ui/TextInput", () => {
  return function MockTextInput(props: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    placeholder?: string;
    "data-testid"?: string;
    error?: string;
    fullWidth?: boolean;
    className?: string;
  }) {
    return (
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        placeholder={props.placeholder}
        data-testid={props["data-testid"]}
        data-error={props.error}
      />
    );
  };
});

jest.mock("../../components/common/ui/TextArea", () => {
  return function MockTextArea(props: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name?: string;
    placeholder?: string;
    "data-testid"?: string;
    error?: string;
    fullWidth?: boolean;
    className?: string;
  }) {
    return (
      <textarea
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        placeholder={props.placeholder}
        data-testid={props["data-testid"]}
        data-error={props.error}
      />
    );
  };
});

jest.mock("../../components/common/ui/Button", () => {
  return function MockButton(props: {
    onClick?: () => void;
    "data-testid"?: string;
    children: React.ReactNode;
    variant?: string;
  }) {
    return (
      <button
        onClick={props.onClick}
        data-testid={props["data-testid"]}
      >
        {props.children}
      </button>
    );
  };
});

jest.mock("../../components/common/ui/LargeStepIndicator", () => {
  return function MockLargeStepIndicator(props: {
    currentStep: number;
    steps: Array<{ title: string }>;
    "data-testid"?: string;
  }) {
    return (
      <div data-testid={props["data-testid"]}>
        Step Indicator: {props.currentStep + 1}/{props.steps.length}
      </div>
    );
  };
});

jest.mock("@mui/icons-material", () => ({
  Star: () => <div>⭐</div>
}));

describe("CreateMeetingDetailPage 컴포넌트", () => {
  const setup = () => {
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
      <CreateMeetingDetailPage />,
      { wrapper }
    );

    return {
      getPage: () => screen.getByTestId("create-meeting-detail-page"),
      getStepIndicator: () => screen.getByTestId("step-indicator"),
      getTitleInput: () => screen.getByTestId("title-input"),
      getDescriptionTextarea: () => screen.getByTestId("description-textarea"),
      getGoalTextarea: () => screen.getByTestId("goal-textarea"),
      getOtherInfoTextarea: () => screen.getByTestId("other-info-textarea"),
      getPreviousButton: () => screen.getByTestId("previous-button"),
      getSubmitButton: () => screen.getByTestId("submit-button"),
      ...utils,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      const {
        getPage,
        getStepIndicator,
        getTitleInput,
        getDescriptionTextarea,
        getGoalTextarea,
        getOtherInfoTextarea,
        getPreviousButton,
        getSubmitButton
      } = setup();

      // Assert
      expect(getPage()).toBeInTheDocument();
      expect(getStepIndicator()).toBeInTheDocument();
      expect(getTitleInput()).toBeInTheDocument();
      expect(getDescriptionTextarea()).toBeInTheDocument();
      expect(getGoalTextarea()).toBeInTheDocument();
      expect(getOtherInfoTextarea()).toBeInTheDocument();
      expect(getPreviousButton()).toBeInTheDocument();
      expect(getSubmitButton()).toBeInTheDocument();
    });

    it("입력 필드에 초기값이 올바르게 표시되어야 한다", () => {
      // Arrange
      const { getTitleInput, getDescriptionTextarea, getGoalTextarea, getOtherInfoTextarea } = setup();

      // Assert
      expect(getTitleInput()).toHaveValue("테스트 모임");
      expect(getDescriptionTextarea()).toHaveValue("모임 설명");
      expect(getGoalTextarea()).toHaveValue("모임 목표");
      expect(getOtherInfoTextarea()).toHaveValue("기타 정보");
    });

    it("상세 정보 입력이 누락된 경우 토스트 에러가 표시되어야 한다", () => {
      // Arrange
      mockValidateDetailInfo.mockReturnValueOnce(false);
      const toastError = require('react-hot-toast').error;
      const { getSubmitButton } = setup();

      // Act
      fireEvent.click(getSubmitButton());

      // Assert
      expect(mockValidateDetailInfo).toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith('모임 소개 정보를 모두 입력해주세요.');
    });
  });

  describe("사용자 동작 테스트", () => {
    it("이전 버튼 클릭 시 기본 정보 페이지로 이동해야 한다", () => {
      // Arrange
      const { getPreviousButton } = setup();

      // Act
      fireEvent.click(getPreviousButton());

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/meeting/create/basic');
    });

    it("글 등록 버튼 클릭 시 상세 정보 유효성 검사가 진행되어야 한다", async () => {
      // Arrange
      const { getSubmitButton } = setup();

      // Act
      fireEvent.click(getSubmitButton());

      // Assert
      expect(mockValidateDetailInfo).toHaveBeenCalled();
    });

    it("모든 유효성 검사 통과 시 모임 생성 API가 호출되어야 한다", async () => {
      // Arrange
      const { getSubmitButton } = setup();

      // Act
      fireEvent.click(getSubmitButton());

      // Assert
      expect(mockValidateDetailInfo).toHaveBeenCalled();
      expect(mockValidateForm).toHaveBeenCalled();
      expect(mockGetCreateMeetingRequest).toHaveBeenCalled();
      expect(mockMutateAsync).toHaveBeenCalled();
    });

    it("모임 생성 성공 시 preview 페이지로 이동해야 한다", async () => {
      // Arrange
      const mockId = 123;
      mockMutateAsync.mockResolvedValueOnce({
        data: { data: { id: mockId } }
      });
      const toastSuccess = require('react-hot-toast').success;
      const { getSubmitButton } = setup();

      // Act
      await fireEvent.click(getSubmitButton());

      // Assert
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(toastSuccess).toHaveBeenCalledWith('모임이 성공적으로 생성되었습니다.');
      expect(mockNavigate).toHaveBeenCalledWith(`/meeting/create/preview/${mockId}`);
    });

    it("모임 생성 실패 시 에러 토스트가 표시되어야 한다", async () => {
      // Arrange
      mockMutateAsync.mockRejectedValueOnce(new Error('API 오류'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const toastError = require('react-hot-toast').error;
      const { getSubmitButton } = setup();

      // Act
      await fireEvent.click(getSubmitButton());

      // Assert
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith('모임 생성에 실패했습니다. 다시 시도해주세요.');

      // 스파이 정리
      consoleErrorSpy.mockRestore();
    });
  });

  describe("에러 케이스 테스트", () => {
    it("입력 필드에 에러가 있을 경우 에러 스타일이 적용되어야 한다", () => {
      // Arrange
      const mockStoreWithErrors = {
        title: "테스트 모임",
        description: "모임 설명",
        goal: "모임 목표",
        otherInfo: "기타 정보",
        errors: {
          title: "제목을 입력해주세요",
          description: "스터디/프로젝트 소개를 입력해주세요",
          goal: "목표를 입력해주세요"
        },
        handleInputChange: mockHandleInputChange,
        validateDetailInfo: mockValidateDetailInfo,
        validateForm: mockValidateForm,
        getCreateMeetingRequest: mockGetCreateMeetingRequest
      };

      jest.spyOn(require('../../store/meetingForm'), 'useMeetingFormStore')
        .mockReturnValue(mockStoreWithErrors);

      const { getTitleInput, getDescriptionTextarea, getGoalTextarea } = setup();

      // Assert
      expect(getTitleInput()).toHaveAttribute('data-error', '제목을 입력해주세요');
      expect(getDescriptionTextarea()).toHaveAttribute('data-error', '스터디/프로젝트 소개를 입력해주세요');
      expect(getGoalTextarea()).toHaveAttribute('data-error', '목표를 입력해주세요');
    });

    it("API 호출 중 네트워크 오류 발생 시 적절한 에러 메시지가 표시되어야 한다", async () => {
      // Arrange
      mockMutateAsync.mockRejectedValueOnce(new Error('Network Error'));
      const toastError = require('react-hot-toast').error;
      const { getSubmitButton } = setup();

      // Act
      await fireEvent.click(getSubmitButton());

      // Assert
      expect(toastError).toHaveBeenCalledWith('모임 생성에 실패했습니다. 다시 시도해주세요.');
    });

    it("API 호출 중 서버 오류 발생 시 적절한 에러 메시지가 표시되어야 한다", async () => {
      // Arrange
      mockMutateAsync.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: '서버 오류' }
        }
      });
      const toastError = require('react-hot-toast').error;
      const { getSubmitButton } = setup();

      // Act
      await fireEvent.click(getSubmitButton());

      // Assert
      expect(toastError).toHaveBeenCalledWith('모임 생성에 실패했습니다. 다시 시도해주세요.');
    });
  });
});