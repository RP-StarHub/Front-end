import React from 'react';
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MeetingHeader from "./MeetingHeader";
import { MeetingDetailInfo } from "../../../types/api/meeting";
import { UserType, RecruitmentType, DURATION, ApplicationStatus } from "../../../types/models/meeting";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockToggleLike = jest.fn();
jest.mock("../../../hooks/api/useLike", () => ({
  useLike: () => ({
    toggleLike: {
      mutate: mockToggleLike
    }
  })
}));

const mockDeleteMutation = jest.fn();
jest.mock("../../../hooks/api/useMeeting", () => ({
  useMeetingDelete: () => ({
    mutate: mockDeleteMutation
  })
}));

const mockToastError = jest.fn();
jest.mock('react-hot-toast', () => ({
  error: (...args: any[]) => mockToastError(...args)
}));

const MOCK_MEETING_DETAIL: MeetingDetailInfo = {
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
    techStacks: ["React"],
    updatedAt: "2024-01-01T00:00:00.000Z",
    creator: {
      nickname: "개발자",
      profileImage: "profile.jpg"
    },
    isConfirmed: false
  },
  userType: UserType.Anonymous,
  isApplication: false,
  applicationStatus: ApplicationStatus.PENDING,
  likeDto: {
    isLiked: false,
    likeCount: 0
  }
};

describe("MeetingHeader 컴포넌트", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      meetingDetail: MOCK_MEETING_DETAIL,
      userType: UserType.Anonymous
    };

    const utils = render(
      <MeetingHeader {...defaultProps} {...props} />
    );

    return {
      getHeader: () => screen.getByTestId("meeting-header"),
      getTitle: () => screen.getByTestId("meeting-title"),
      getCreatorInfo: () => screen.getByTestId("creator-info"),
      getLikeButton: () => screen.getByTestId("like-button"),
      getLikeCount: () => screen.getByTestId("like-count"),
      getEditButton: () => screen.getByTestId("edit-button"),
      getDeleteButton: () => screen.getByTestId("delete-button"),
      getDeleteModal: () => screen.queryByTestId("delete-modal"),
      getDeleteModalBackdrop: () => screen.queryByTestId("delete-modal-backdrop"),
      getDeleteCancelButton: () => screen.queryByTestId("delete-cancel-button"),
      getDeleteConfirmButton: () => screen.queryByTestId("delete-confirm-button"),
      getFavoriteBorderIcon: () => screen.getByTestId("favorite-border"),
      getFavoriteFilledIcon: () => screen.getByTestId("favorite-filled"),

      clickLikeButton: async () => {
        const user = userEvent.setup();
        await user.click(screen.getByTestId("like-button"));
      },
      clickDeleteButton: async () => {
        const user = userEvent.setup();
        await user.click(screen.getByTestId("delete-button"));
      },
      clickEditButton: async () => {
        const user = userEvent.setup();
        await user.click(screen.getByTestId("edit-button"));
      },
      clickDeleteConfirm: async () => {
        const user = userEvent.setup();
        const confirmButton = screen.queryByTestId("delete-confirm-button");
        if (confirmButton) {
          await user.click(confirmButton);
        }
      },
      clickDeleteCancel: async () => {
        const user = userEvent.setup();
        const cancelButton = screen.queryByTestId("delete-cancel-button");
        if (cancelButton) {
          await user.click(cancelButton);
        }
      },
      clickModalBackdrop: async () => {
        const user = userEvent.setup();
        const backdrop = screen.queryByTestId("delete-modal-backdrop");
        if (backdrop) {
          await user.click(backdrop);
        }
      },
      
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
      const { getHeader, getTitle, getCreatorInfo, getLikeButton, getLikeCount } = setup();

      // Assert
      expect(getHeader()).toBeInTheDocument();
      expect(getTitle()).toHaveTextContent(`[스터디] ${MOCK_MEETING_DETAIL.postInfo.title}`);
      expect(getCreatorInfo()).toBeInTheDocument();
      expect(getLikeButton()).toBeInTheDocument();
      expect(getLikeCount()).toHaveTextContent(String(MOCK_MEETING_DETAIL.likeDto.likeCount));
    });

    it("작성자일 경우 수정/삭제 버튼이 표시되어야 한다", () => {
      // Arrange
      const { getEditButton, getDeleteButton } = setup({ userType: UserType.Creator });

      // Assert
      expect(getEditButton()).toBeInTheDocument();
      expect(getDeleteButton()).toBeInTheDocument();
    });

    it("작성자가 아닐 경우 수정/삭제 버튼이 표시되지 않아야 한다", () => {
      // Arrange
      const { getEditButton, getDeleteButton } = setup({ userType: UserType.Applicant });

      // Assert
      expect(() => getEditButton()).toThrow();
      expect(() => getDeleteButton()).toThrow();
    });
  });

  describe("사용자 동작 테스트", () => {
    it("좋아요 버튼 클릭 시 사용자 타입에 따라 처리되어야 한다", async () => {
      // Arrange
      const { clickLikeButton } = setup();

      // Act
      await clickLikeButton();

      // Assert
      expect(mockToastError).toHaveBeenCalledWith('관심 모임 등록하기는 로그인이 필요합니다');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it("수정 버튼 클릭 시 수정 페이지로 이동해야 한다", async () => {
      // Arrange
      const { clickEditButton } = setup({ userType: UserType.Creator });

      // Act
      await clickEditButton();

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith(`/meeting/edit/${MOCK_MEETING_DETAIL.postInfo.id}`);
    });

    it("삭제 버튼 클릭 시 삭제 모달이 표시되어야 한다", async () => {
      // Arrange
      const { clickDeleteButton, getDeleteModal } = setup({ userType: UserType.Creator });

      // Act
      await clickDeleteButton();

      // Assert
      const modal = getDeleteModal();
      expect(modal).toBeInTheDocument();
    });

    it("삭제 확인 시 삭제 API가 호출되어야 한다", async () => {
      // Arrange
      const { clickDeleteButton, clickDeleteConfirm } = setup({ userType: UserType.Creator });

      // Act
      await clickDeleteButton();
      await clickDeleteConfirm();

      // Assert
      expect(mockDeleteMutation).toHaveBeenCalledWith(MOCK_MEETING_DETAIL.postInfo.id);
    });
  });

  describe("에러 케이스 테스트", () => {
    it("삭제 모달에서 취소하면 모달이 닫혀야 한다", async () => {
      // Arrange
      const { clickDeleteButton, clickDeleteCancel, getDeleteModal } = setup({ userType: UserType.Creator });

      // Act
      await clickDeleteButton();
      await clickDeleteCancel();

      // Assert
      expect(getDeleteModal()).not.toBeInTheDocument();
    });

    it("삭제 모달에서 배경 클릭 시 모달이 닫혀야 한다", async () => {
      // Arrange
      const { clickDeleteButton, clickModalBackdrop, getDeleteModal } = setup({ userType: UserType.Creator });

      // Act
      await clickDeleteButton();
      await clickModalBackdrop();

      // Assert
      expect(getDeleteModal()).not.toBeInTheDocument();
    });
  });
});