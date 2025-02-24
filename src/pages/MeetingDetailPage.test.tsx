import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import MeetingDetailPage from "./MeetingDetailPage";
import { useMeetingDetail } from '../hooks/api/useMeeting';
import { UserType, ApplicationStatus, RecruitmentType, DURATION } from '../types/models/meeting';

const MOCK_MEETING_DETAIL = {
  data: {
    data: {
      postInfo: {
        id: 1,
        title: "리액트 스터디",
        recruitmentType: RecruitmentType.STUDY,
        maxParticipants: 5,
        duration: DURATION.ONE_MONTH,
        endDate: "2024-03-01",
        location: "서울시 강남구",
        latitude: 37.123,
        longitude: 127.123,
        description: "리액트 스터디입니다",
        goal: "리액트 마스터하기",
        otherInfo: "",
        techStacks: ["React", "TypeScript"],
        updatedAt: "2024-01-01",
        creator: {
          nickname: "개발자",
          profileImage: "profile.jpg"
        },
        isConfirmed: false
      },
      userType: UserType.Creator,
      isApplication: false,
      applicationStatus: ApplicationStatus.PENDING
    }
  },
  isLoading: false
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ meetingId: "1" })
}));

jest.mock('../hooks/api/useMeeting', () => ({
  useMeetingDetail: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

jest.mock('../components/meeting/detail/MeetingHeader', () => () => <div data-testid="meeting-header" />);
jest.mock('../components/meeting/detail/MeetingInfo', () => () => <div data-testid="meeting-info" />);
jest.mock('../components/meeting/detail/MeetingContent', () => () => <div data-testid="meeting-content" />);
jest.mock('../components/meeting/detail/ApplicationList', () => () => <div data-testid="application-list" />);
jest.mock('../components/meeting/detail/ApplicationForm', () => () => <div data-testid="application-form" />);
jest.mock('../components/meeting/detail/MyApplication', () => () => <div data-testid="my-application" />);

describe("MeetingDetailPage 컴포넌트", () => {
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

  beforeEach(() => {
    jest.clearAllMocks();
    (useMeetingDetail as jest.Mock).mockImplementation(() => MOCK_MEETING_DETAIL);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  const setup = (customMockData = {}) => {
    if (customMockData) {
      (useMeetingDetail as jest.Mock).mockImplementation(() => ({
        ...MOCK_MEETING_DETAIL,
        ...customMockData
      }));
    }

    const utils = render(<MeetingDetailPage />);

    return {
      getMeetingDetailPage: () => screen.getByTestId("meeting-detail-page"),
      getApplicationSection: () => screen.getByTestId("application-section"),
      getConfirmedMessage: () => screen.queryByTestId("confirmed-message"),
      getViewMembersButton: () => screen.queryByTestId("view-members-button"),
      getApplicationList: () => screen.queryByTestId("application-list"),
      getApplicationForm: () => screen.queryByTestId("application-form"),
      getMyApplication: () => screen.queryByTestId("my-application"),
      clickViewMembersButton: () => {
        const button = screen.getByText("스터디원 보기");
        if (button) fireEvent.click(button);
      },
      mockNavigate,
      ...utils,
    };
  };

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      setup();

      // Assert
      expect(screen.getByTestId("meeting-header")).toBeInTheDocument();
      expect(screen.getByTestId("meeting-info")).toBeInTheDocument();
      expect(screen.getByTestId("meeting-content")).toBeInTheDocument();
    });

    describe("사용자 타입별 렌더링 테스트", () => {
      it("개설자일 경우 ApplicationList가 표시되어야 한다", () => {
        // Arrange
        setup({
          data: {
            data: {
              postInfo: { id: 1, isConfirmed: false },
              userType: UserType.Creator,
              isApplication: false,
              applicationStatus: ApplicationStatus.PENDING
            }
          }
        });

        // Assert
        expect(screen.getByTestId("application-list")).toBeInTheDocument();
      });

      it("지원자이고 미지원 상태일 경우 ApplicationForm이 표시되어야 한다", () => {
        // Arrange
        setup({
          data: {
            data: {
              postInfo: { id: 1, isConfirmed: false },
              userType: UserType.Applicant,
              isApplication: false,
              applicationStatus: ApplicationStatus.PENDING
            }
          }
        });

        // Assert
        expect(screen.getByTestId("application-form")).toBeInTheDocument();
      });

      it("지원자이고 이미 지원한 경우 MyApplication이 표시되어야 한다", () => {
        // Arrange
        setup({
          data: {
            data: {
              postInfo: { id: 1, isConfirmed: false },
              userType: UserType.Applicant,
              isApplication: true,
              applicationStatus: ApplicationStatus.PENDING
            }
          }
        });

        // Assert
        expect(screen.getByTestId("my-application")).toBeInTheDocument();
      });

      it("익명 사용자일 경우 ApplicationForm이 표시되어야 한다", () => {
        // Arrange
        setup({
          data: {
            data: {
              postInfo: { id: 1, isConfirmed: false },
              userType: UserType.Anonymous,
              isApplication: false,
              applicationStatus: ApplicationStatus.PENDING
            }
          }
        });

        // Assert
        expect(screen.getByTestId("application-form")).toBeInTheDocument();
      });
    });

    describe("모임 확정 상태 테스트", () => {
      it("모임이 확정되고 개설자일 경우 스터디원 보기 버튼이 표시되어야 한다", () => {
        // Arrange
        setup({
          data: {
            data: {
              postInfo: { id: 1, isConfirmed: true },
              userType: UserType.Creator,
              isApplication: false,
              applicationStatus: ApplicationStatus.PENDING
            }
          }
        });

        // Act
        const viewButton = screen.getByText("스터디원 보기");
        fireEvent.click(viewButton);

        // Assert
        expect(mockNavigate).toHaveBeenCalledWith("/applicant/list/1");
      });

      it("모임이 확정되고 승인된 지원자일 경우 스터디원 보기 버튼이 표시되어야 한다", () => {
        // Arrange
        setup({
          data: {
            data: {
              postInfo: { id: 1, isConfirmed: true },
              userType: UserType.Applicant,
              isApplication: true,
              applicationStatus: ApplicationStatus.APPROVED
            }
          }
        });

        // Assert
        expect(screen.getByText("스터디원 보기")).toBeInTheDocument();
      });

      it("모임이 확정되고 거절된 지원자일 경우 거절 메시지가 표시되어야 한다", () => {
        // Arrange
        const { getConfirmedMessage } = setup({
          data: {
            data: {
              postInfo: { id: 1, isConfirmed: true },
              userType: UserType.Applicant,
              isApplication: true,
              applicationStatus: ApplicationStatus.REJECTED
            }
          }
        });

        // Assert
        expect(getConfirmedMessage()).toBeInTheDocument();
        expect(screen.getByText("아쉽게도 최종 모임원으로 선정되지 못했습니다.")).toBeInTheDocument();
      });

      it("모임이 확정되고 일반 사용자일 경우 마감 메시지가 표시되어야 한다", () => {
        // Arrange
        const { getConfirmedMessage } = setup({
          data: {
            data: {
              postInfo: { id: 1, isConfirmed: true },
              userType: UserType.Applicant,
              isApplication: false,
              applicationStatus: ApplicationStatus.PENDING
            }
          }
        });

        // Assert
        expect(getConfirmedMessage()).toBeInTheDocument();
        expect(screen.getByText("해당 모임글은 모집이 마감되었습니다.")).toBeInTheDocument();
      });
    });
  });

  describe("사용자 동작 테스트", () => {
    it("클릭 이벤트가 올바르게 동작해야 한다", () => {
      // Arrange
      setup({
        data: {
          data: {
            postInfo: { id: 1, isConfirmed: true },
            userType: UserType.Creator
          }
        }
      });

      // Act
      fireEvent.click(screen.getByText("스터디원 보기"));

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith("/applicant/list/1");
    });

    it("상태 변경이 올바르게 반영되어야 한다", () => {
      // Arrange
      setup({
        data: {
          data: {
            postInfo: { id: 1, isConfirmed: true },
            userType: UserType.Applicant,
            applicationStatus: ApplicationStatus.REJECTED
          }
        }
      });

      // Act & Assert
      expect(screen.getByText("아쉽게도 최종 모임원으로 선정되지 못했습니다.")).toBeInTheDocument();
    });
  });

  describe("에러 케이스 테스트", () => {
    it("필수 데이터가 없을 때 처리되어야 한다", () => {
      // Arrange
      setup({ data: null });

      // Assert
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });
});