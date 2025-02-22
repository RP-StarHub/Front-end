import React from 'react';
import { fireEvent, render, screen } from "@testing-library/react";
import ParticipantsModal from './ParticipantsModal';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  error: jest.fn()
}));

jest.mock('../../common/ui/BaseModal', () => {
  return function MockBaseModal({ children, isOpen, onConfirm }: { children: React.ReactNode, isOpen: boolean, onConfirm: () => void }) {
    if (!isOpen) return null;
    return (
      <div data-testid="base-modal">
        {children}
        <button onClick={onConfirm} data-testid="confirm-button">확인</button>
      </div>
    );
  };
});

describe("ParticipantsModal 컴포넌트", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      onSelect: jest.fn(),
      selectedParticipants: 1,
      anchorEl: null
    };

    const utils = render(<ParticipantsModal {...defaultProps} {...props} />);

    return {
      // 주요 컨테이너
      getBaseModal: () => screen.getByTestId("base-modal"),
      getParticipantsContent: () => screen.getByTestId("participants-content"),
      // 참가자 수 표시
      getParticipantsText: () => screen.getByTestId("participants-text"),
      // 슬라이더 관련
      getSliderContainer: () => screen.getByTestId("slider-container"),
      getSliderTrack: () => screen.getByTestId("slider-track"),
      getSliderProgress: () => screen.getByTestId("slider-progress"),
      getSliderInput: () => screen.getByTestId("slider-input"),
      // 라벨
      getSliderLabels: () => screen.getByTestId("slider-labels"),
      getMinLabel: () => screen.getByTestId("min-label"),
      getMidLabel: () => screen.getByTestId("mid-label"),
      getMaxLabel: () => screen.getByTestId("max-label"),
      // 버튼
      getConfirmButton: () => screen.getByTestId("confirm-button"),
      // props
      onCloseMock: defaultProps.onClose,
      onSelectMock: defaultProps.onSelect,
      ...utils,
    };
  };

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 데이터에 맞게 올바르게 렌더링되어야 한다.", () => {
      // Arrange
      const { 
        getParticipantsContent, 
        getParticipantsText, 
        getSliderContainer,
        getSliderInput,
        getSliderLabels
      } = setup();

      // Assert
      expect(getParticipantsContent()).toBeInTheDocument();
      expect(getParticipantsText()).toBeInTheDocument();
      expect(getParticipantsText()).toHaveTextContent("1명");
      expect(getSliderContainer()).toBeInTheDocument();
      expect(getSliderInput()).toHaveAttribute("type", "range");
      expect(getSliderInput()).toHaveAttribute("min", "0");
      expect(getSliderInput()).toHaveAttribute("max", "10");
      expect(getSliderLabels()).toBeInTheDocument();
    });

    it("라벨이 올바르게 표시되어야 한다.", () => {
      // Arrange
      const { getMinLabel, getMidLabel, getMaxLabel } = setup();

      // Assert
      expect(getMinLabel()).toHaveTextContent("최소");
      expect(getMidLabel()).toHaveTextContent("5명");
      expect(getMaxLabel()).toHaveTextContent("최대");
    });

    it("초기값이 올바르게 표시되어야 한다.", () => {
      // Arrange
      const initialValue = 5;
      const { getSliderInput, getParticipantsText, getSliderProgress } = setup({ 
        selectedParticipants: initialValue 
      });

      // Assert
      expect(getSliderInput()).toHaveValue(String(initialValue));
      expect(getParticipantsText()).toHaveTextContent("5명");
      expect(getSliderProgress()).toHaveStyle({ width: '50%' });
    });

    it("모달이 열려있을 때만 렌더링 되어야 한다.", () => {
      // Arrange & Act
      const { container } = setup({ isOpen: false });

      // Assert
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("사용자 동작 테스트", () => {
    it("슬라이더 값 변경이 올바르게 동작해야 한다.", () => {
      // Arrange
      const { getSliderInput, getParticipantsText, getSliderProgress } = setup();
      const newValue = "7";

      // Act
      fireEvent.change(getSliderInput(), { target: { value: newValue } });

      // Assert
      expect(getSliderInput()).toHaveValue(newValue);
      expect(getParticipantsText()).toHaveTextContent("7명");
      expect(getSliderProgress()).toHaveStyle({ width: '70%' });
    });

    it("10명 이상 선택 시 텍스트가 올바르게 표시되어야 한다.", () => {
      // Arrange
      const { getSliderInput, getParticipantsText, getSliderProgress } = setup();

      // Act
      fireEvent.change(getSliderInput(), { target: { value: "10" } });

      // Assert
      expect(getParticipantsText()).toHaveTextContent("10명 이상");
      expect(getSliderProgress()).toHaveStyle({ width: '100%' });
    });

    it("0명 선택 후 확인 시 에러가 표시되어야 한다.", () => {
      // Arrange
      const { getSliderInput, getConfirmButton } = setup();

      // Act
      fireEvent.change(getSliderInput(), { target: { value: "0" } });
      fireEvent.click(getConfirmButton());

      // Assert
      expect(toast.error).toHaveBeenCalledWith("모집 인원은 0명 이상이어야합니다.");
    });

    it("유효한 값 선택 후 확인 시 onSelect와 onClose가 호출되어야 한다.", () => {
      // Arrange
      const { getSliderInput, getConfirmButton, onSelectMock, onCloseMock } = setup();
      const validValue = "5";

      // Act
      fireEvent.change(getSliderInput(), { target: { value: validValue } });
      fireEvent.click(getConfirmButton());

      // Assert
      expect(onSelectMock).toHaveBeenCalledWith(Number(validValue));
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe("에러 케이스 테스트", () => {
    it("selectedParticipants가 undefined일 때 기본값(1)이 설정되어야 한다.", () => {
      // Arrange
      const { getSliderInput, getParticipantsText } = setup({ 
        selectedParticipants: undefined 
      });

      // Assert
      expect(getSliderInput()).toHaveValue("1");
      expect(getParticipantsText()).toHaveTextContent("1명");
    });
  });
});