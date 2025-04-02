import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import ApplicationForm from "./ApplicationForm";
import { useApplicationCreate } from '../../../hooks/api/useApplication';
import { UserType } from '../../../types/models/meeting';
import toast from 'react-hot-toast';

jest.mock('../../../hooks/api/useApplication', () => ({
  useApplicationCreate: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe("ApplicationForm 컴포넌트", () => {
  const mockMutateAsync = jest.fn();
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  beforeEach(() => {
    (useApplicationCreate as jest.Mock).mockImplementation(() => ({
      mutateAsync: mockMutateAsync
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      meetingId: 1,
      userType: UserType.Applicant
    };

    const utils = render(
      <ApplicationForm {...defaultProps} {...props} />
    );

    return {
      getApplicationForm: () => screen.getByTestId("application-form"),
      getDivider: () => screen.getByTestId("divider"),
      getFormTitle: () => screen.getByTestId("form-title"),
      getTextArea: () => screen.getByTestId("application-textarea"),
      getSubmitButton: () => screen.getByTestId("submit-button"),
      changeContent: (content: string) => {
        fireEvent.change(screen.getByTestId("application-textarea"), {
          target: { value: content }
        });
      },
      clickSubmit: () => {
        fireEvent.click(screen.getByTestId("submit-button"));
      },
      ...utils,
    };
  };

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      const { getApplicationForm, getFormTitle, getTextArea, getSubmitButton } = setup();

      // Assert
      expect(getApplicationForm()).toBeInTheDocument();
      expect(getFormTitle()).toHaveTextContent("지원서");
      expect(getTextArea()).toBeInTheDocument();
      expect(getSubmitButton()).toHaveTextContent("등록");
    });
  });

  describe("사용자 동작 테스트", () => {
    it("내용을 입력하고 제출할 수 있어야 한다", async () => {
      // Arrange
      const { changeContent, clickSubmit } = setup();
      mockMutateAsync.mockResolvedValueOnce({});
      
      // Act
      changeContent("지원합니다");
      await clickSubmit();

      // Assert
      expect(mockMutateAsync).toHaveBeenCalledWith({
        meetingId: 1,
        data: { content: "지원합니다" }
      });
      expect(toast.success).toHaveBeenCalledWith("지원서가 등록되었습니다");
    });

    it("내용이 비어있을 때 에러 메시지가 표시되어야 한다", async () => {
      // Arrange
      const { clickSubmit } = setup();

      // Act
      await clickSubmit();

      // Assert
      expect(toast.error).toHaveBeenCalledWith("내용을 입력해주세요");
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("익명 사용자일 경우 로그인 페이지로 이동해야 한다", async () => {
      // Arrange
      const { changeContent, clickSubmit } = setup({
        userType: UserType.Anonymous
      });

      // Act
      changeContent("지원합니다");
      await clickSubmit();

      // Assert
      expect(toast.error).toHaveBeenCalledWith("모임 지원을 위해서는 로그인이 필요합니다");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });
  });

  describe("에러 케이스 테스트", () => {
    it("API 호출 실패 시 에러가 처리되어야 한다", async () => {
      // Arrange
      const { changeContent, clickSubmit } = setup();
      const error = new Error("API Error");
      mockMutateAsync.mockRejectedValueOnce(error);

      // Act
      changeContent("지원합니다");
      await clickSubmit();

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith("Error:", error);
    });
  });
});