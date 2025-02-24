import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import MyApplication from "./MyApplication";
import { useApplicationMe, useApplicationPatch, useApplicationDelete } from '../../../hooks/api/useApplication';
import toast from 'react-hot-toast';

jest.mock('../../../hooks/api/useApplication', () => ({
  useApplicationMe: jest.fn(),
  useApplicationPatch: jest.fn(),
  useApplicationDelete: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

const mockApplication = {
  data: {
    id: 1,
    content: "지원합니다!",
    applicant: {
      nickname: "개발자1",
      profileImage: "profile1.jpg"
    }
  }
};

describe("MyApplication 컴포넌트", () => {
  const mockPatchMutateAsync = jest.fn();
  const mockDeleteMutateAsync = jest.fn();
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  beforeEach(() => {
    (useApplicationMe as jest.Mock).mockImplementation(() => ({
      data: mockApplication,
      isLoading: false
    }));

    (useApplicationPatch as jest.Mock).mockImplementation(() => ({
      mutateAsync: mockPatchMutateAsync
    }));

    (useApplicationDelete as jest.Mock).mockImplementation(() => ({
      mutateAsync: mockDeleteMutateAsync
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      meetingId: 1
    };

    const utils = render(
      <MyApplication {...defaultProps} {...props} />
    );

    return {
      getMyApplication: () => screen.getByTestId("my-application"),
      getEditButton: () => screen.getByTestId("edit-button"),
      getDeleteButton: () => screen.getByTestId("delete-button"),
      getEditForm: () => screen.queryByTestId("edit-form"),
      getEditTextarea: () => screen.queryByTestId("edit-textarea"),
      getSubmitEditButton: () => screen.queryByTestId("submit-edit-button"),
      getApplicationContent: () => screen.queryByTestId("application-content"),
      getContentText: () => screen.queryByTestId("content-text"),
      getDeleteModal: () => screen.queryByTestId("delete-modal"),
      getCancelDeleteButton: () => screen.queryByTestId("cancel-delete-button"),
      getConfirmDeleteButton: () => screen.queryByTestId("confirm-delete-button"),
      getProfileImage: () => screen.getByTestId("profile-image"),
      getApplicantName: () => screen.getByTestId("applicant-name"),
      clickEditButton: () => {
        fireEvent.click(screen.getByTestId("edit-button"));
      },
      clickDeleteButton: () => {
        fireEvent.click(screen.getByTestId("delete-button"));
      },
      changeContent: (content: string) => {
        const textarea = screen.getByTestId("edit-textarea");
        fireEvent.change(textarea, { target: { value: content } });
      },
      clickSubmitEdit: () => {
        fireEvent.click(screen.getByTestId("submit-edit-button"));
      },
      clickConfirmDelete: () => {
        fireEvent.click(screen.getByTestId("confirm-delete-button"));
      },
      clickCancelDelete: () => {
        fireEvent.click(screen.getByTestId("cancel-delete-button"));
      },
      ...utils,
    };
  };

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      const { getMyApplication, getEditButton, getDeleteButton, getContentText } = setup();

      // Assert
      expect(getMyApplication()).toBeInTheDocument();
      expect(getEditButton()).toBeInTheDocument();
      expect(getDeleteButton()).toBeInTheDocument();
      expect(getContentText()).toHaveTextContent(mockApplication.data.content);
    });

    it("프로필 정보가 올바르게 표시되어야 한다", () => {
      // Arrange
      const { getProfileImage, getApplicantName } = setup();

      // Assert
      expect(getProfileImage()).toHaveAttribute("src", mockApplication.data.applicant.profileImage);
      expect(getApplicantName()).toHaveTextContent(mockApplication.data.applicant.nickname);
    });

    it("로딩 상태일 때 로딩 UI가 표시되어야 한다", () => {
      // Arrange
      (useApplicationMe as jest.Mock).mockImplementation(() => ({
        data: null,
        isLoading: true
      }));

      // Act
      render(<MyApplication meetingId={1} />);

      // Assert
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("사용자 동작 테스트", () => {
    it("수정 버튼 클릭 시 수정 폼이 표시되어야 한다", () => {
      // Arrange
      const { clickEditButton, getEditForm, getEditTextarea } = setup();

      // Act
      clickEditButton();

      // Assert
      expect(getEditForm()).toBeInTheDocument();
      expect(getEditTextarea()).toHaveValue(mockApplication.data.content);
    });

    it("수정 완료 시 API가 호출되고 성공 메시지가 표시되어야 한다", async () => {
      // Arrange
      const { clickEditButton, changeContent, clickSubmitEdit } = setup();
      mockPatchMutateAsync.mockResolvedValueOnce({});

      // Act
      clickEditButton();
      changeContent("수정된 내용");
      await clickSubmitEdit();

      // Assert
      expect(mockPatchMutateAsync).toHaveBeenCalledWith({
        meetingId: 1,
        data: { content: "수정된 내용" }
      });
      expect(toast.success).toHaveBeenCalledWith("지원서가 수정되었습니다");
    });

    it("내용이 비어있을 때 수정을 시도하면 에러 메시지가 표시되어야 한다", async () => {
      // Arrange
      const { clickEditButton, changeContent, clickSubmitEdit } = setup();

      // Act
      clickEditButton();
      changeContent("   ");
      await clickSubmitEdit();

      // Assert
      expect(toast.error).toHaveBeenCalledWith("내용을 입력해주세요");
      expect(mockPatchMutateAsync).not.toHaveBeenCalled();
    });

    it("삭제 버튼 클릭 시 삭제 모달이 표시되어야 한다", () => {
      // Arrange
      const { clickDeleteButton, getDeleteModal } = setup();

      // Act
      clickDeleteButton();

      // Assert
      expect(getDeleteModal()).toBeInTheDocument();
    });

    it("삭제 확인 시 API가 호출되고 성공 메시지가 표시되어야 한다", async () => {
      // Arrange
      const { clickDeleteButton, clickConfirmDelete } = setup();
      mockDeleteMutateAsync.mockResolvedValueOnce({});

      // Act
      clickDeleteButton();
      await clickConfirmDelete();

      // Assert
      expect(mockDeleteMutateAsync).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith("지원서가 삭제되었습니다");
    });

    it("삭제 취소 시 모달이 닫혀야 한다", () => {
      // Arrange
      const { clickDeleteButton, clickCancelDelete, getDeleteModal } = setup();

      // Act
      clickDeleteButton();
      clickCancelDelete();

      // Assert
      expect(getDeleteModal()).not.toBeInTheDocument();
    });
  });

  describe("에러 케이스 테스트", () => {
    it("수정 API 호출 실패 시 에러가 처리되어야 한다", async () => {
      // Arrange
      const { clickEditButton, changeContent, clickSubmitEdit } = setup();
      const error = new Error("API Error");
      mockPatchMutateAsync.mockRejectedValueOnce(error);

      // Act
      clickEditButton();
      changeContent("수정된 내용");
      await clickSubmitEdit();

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith("Error:", error);
    });
  });
});