import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import ApplicationList from "./ApplicationList";
import { useApplicationList } from '../../../hooks/api/useApplication';
import { useConfirmMeetingMembers } from '../../../hooks/api/useMeeting';
import toast from 'react-hot-toast';

jest.mock('../../../assets/data/mainData', () => ({
  mainData: {},
  mockDetailData: {}
}));

jest.mock('../../../hooks/api/useApplication', () => ({
  useApplicationList: jest.fn()
}));

jest.mock('../../../hooks/api/useMeeting', () => ({
  useConfirmMeetingMembers: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

const TEST_MEETING_ID = 1;

const mockApplications = [
  {
    id: 1,
    content: "지원합니다!",
    applicant: {
      nickname: "개발자1",
      profileImage: "profile1.jpg"
    }
  },
  {
    id: 2,
    content: "참여하고 싶습니다",
    applicant: {
      nickname: "개발자2",
      profileImage: "profile2.jpg"
    }
  }
];

describe("ApplicationList 컴포넌트", () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    (useApplicationList as jest.Mock).mockImplementation(() => ({
      data: { data: mockApplications },
      isLoading: false
    }));

    (useConfirmMeetingMembers as jest.Mock).mockImplementation(() => ({
      mutate: jest.fn()
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      meetingId: TEST_MEETING_ID
    };

    const utils = render(
      <ApplicationList {...defaultProps} {...props} />
    );

    return {
      getApplicationList: () => screen.queryByTestId("application-list"),
      getApplicationItem: (id: number) => screen.queryByTestId(`application-item-${id}`),
      getApplicantName: (id: number) => screen.queryByTestId(`applicant-name-${id}`),
      getApplicantImage: (id: number) => screen.queryByTestId(`applicant-image-${id}`),
      getApplicationContent: (id: number) => screen.queryByTestId(`application-content-${id}`),
      getConfirmButton: () => screen.queryByTestId("confirm-button"),
      getLoadingState: () => screen.queryByTestId("loading-state"),
      getEmptyState: () => screen.queryByTestId("empty-state"),

      clickApplication: (id: number) => {
        const element = screen.queryByTestId(`application-item-${id}`);
        if (element) fireEvent.click(element);
      },
      clickConfirmButton: () => {
        const button = screen.queryByTestId("confirm-button");
        if (button) fireEvent.click(button);
      },
      ...utils,
    };
  };

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      const { getApplicationList, getApplicationItem } = setup();

      // Assert
      expect(getApplicationList()).toBeInTheDocument();
      mockApplications.forEach(app => {
        expect(getApplicationItem(app.id)).toBeInTheDocument();
      });
    });

    it("로딩 상태일 때 로딩 UI가 표시되어야 한다", () => {
      // Arrange
      (useApplicationList as jest.Mock).mockImplementation(() => ({
        isLoading: true,
        data: null
      }));

      // Act
      const { getApplicationList } = setup();

      // Assert
      expect(getApplicationList()).not.toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("데이터가 비어있을 때 빈 상태 UI가 표시되어야 한다", () => {
      // Arrange
      (useApplicationList as jest.Mock).mockImplementation(() => ({
        isLoading: false,
        data: { data: [] }
      }));

      // Act
      const { getApplicationList } = setup();

      // Assert
      expect(getApplicationList()).not.toBeInTheDocument();
      expect(screen.getByText("아직 지원서가 없습니다.")).toBeInTheDocument();
    });

    it("지원서에 프로필 이미지와 닉네임이 표시되어야 한다", () => {
      // Arrange
      const { getApplicantName, getApplicantImage } = setup();
      
      // Assert
      expect(getApplicantImage(1)).toHaveAttribute("src", "profile1.jpg");
      expect(getApplicantName(1)).toHaveTextContent("개발자1");
    });
  });

  describe("사용자 동작 테스트", () => {
    it("지원서 클릭 시 선택 상태가 토글되어야 한다", () => {
      // Arrange
      const { getApplicationItem, clickApplication } = setup();

      // Act
      clickApplication(1);

      // Assert
      expect(getApplicationItem(1)).toHaveClass("bg-sub");
      expect(getApplicationItem(1)).toHaveClass("text-white");
    });

    it("지원서 선택 후 다시 클릭하면 선택이 해제되어야 한다", () => {
      // Arrange
      const { getApplicationItem, clickApplication } = setup();

      // Act
      clickApplication(1);
      clickApplication(1);

      // Assert
      expect(getApplicationItem(1)).not.toHaveClass("bg-sub");
      expect(getApplicationItem(1)).not.toHaveClass("text-white");
    });

    it("여러 지원서를 선택할 수 있어야 한다", () => {
      // Arrange
      const { getApplicationItem, clickApplication } = setup();

      // Act
      clickApplication(1);
      clickApplication(2);

      // Assert
      expect(getApplicationItem(1)).toHaveClass("bg-sub");
      expect(getApplicationItem(2)).toHaveClass("bg-sub");
    });

    it("스터디원 확정 버튼 클릭 시 선택된 지원자가 없으면 에러가 표시되어야 한다", () => {
      // Arrange
      const { clickConfirmButton } = setup();

      // Act
      clickConfirmButton();

      // Assert
      expect(toast.error).toHaveBeenCalledWith("확정할 지원자를 선택해주세요");
    });

    it("스터디원 확정이 성공하면 성공 메시지가 표시되고 목록 페이지로 이동해야 한다", () => {
      // Arrange
      const mockMutate = jest.fn().mockImplementation((data, options) => {
        options.onSuccess();
      });
      
      (useConfirmMeetingMembers as jest.Mock).mockImplementation(() => ({
        mutate: mockMutate
      }));

      const { clickApplication, clickConfirmButton } = setup();
      
      // Act
      clickApplication(1);
      clickConfirmButton();

      // Assert
      expect(toast.success).toHaveBeenCalledWith("스터디원이 확정되었습니다");
      expect(mockNavigate).toHaveBeenCalledWith(`/applicant/list/${TEST_MEETING_ID}`);
    });
  });

  describe("에러 케이스 테스트", () => {
    it("스터디원 확정 실패 시 에러 메시지가 표시되어야 한다", () => {
      // Arrange
      const mockMutate = jest.fn().mockImplementation((data, options) => {
        options.onError(new Error("Failed to confirm members"));
      });

      (useConfirmMeetingMembers as jest.Mock).mockImplementation(() => ({
        mutate: mockMutate
      }));

      const { clickApplication, clickConfirmButton } = setup();

      // Act
      clickApplication(1);
      clickConfirmButton();

      // Assert
      expect(toast.error).toHaveBeenCalledWith("스터디원 확정에 실패했습니다");
    });
  });
});