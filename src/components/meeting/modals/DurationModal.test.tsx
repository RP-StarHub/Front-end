import React from 'react';
import { fireEvent, render, screen } from "@testing-library/react";
import DurationModal from './DurationModal';
import { DURATION } from '../../../types/models/meeting';
import { toKoreanDuration } from '../../../util/transformKorean';

jest.mock('../../common/ui/BaseModal', () => {
  return function MockBaseModal({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) {
    if (!isOpen) return null;
    return <div data-testid="base-modal">{children}</div>;
  };
});

describe("DurationModal 컴포넌트", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      onSelect: jest.fn(),
      selectedDuration: DURATION.ONE_MONTH,
      anchorEl: null
    };

    const utils = render(<DurationModal {...defaultProps} {...props} />);

    return {
      getBaseModal: () => screen.getByTestId("base-modal"),
      getDurationOptions: () => screen.getByTestId("duration-options"),
      getDurationOption: (duration: DURATION) => screen.getByTestId(`duration-option-${duration}`),
      getDurationRadio: (duration: DURATION) => screen.getByTestId(`duration-radio-${duration}`),
      getDurationRadioDot: (duration: DURATION) => screen.getByTestId(`duration-radio-dot-${duration}`),
      getDurationText: (duration: DURATION) => screen.getByTestId(`duration-text-${duration}`),
      onCloseMock: defaultProps.onClose,
      onSelectMock: defaultProps.onSelect,
      defaultProps,
      ...utils,
    };
  };

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 데이터에 맞게 올바르게 렌더링되어야 한다.", () => {
      // Arrange
      const { getBaseModal, getDurationOptions, getDurationOption, getDurationRadio, getDurationText } = setup();

      // Assert
      expect(getBaseModal()).toBeInTheDocument();
      expect(getDurationOptions()).toBeInTheDocument();

      Object.values(DURATION).forEach((duration) => {
        expect(getDurationOption(duration)).toBeInTheDocument();
        expect(getDurationRadio(duration)).toBeInTheDocument();
        expect(getDurationText(duration)).toHaveTextContent(toKoreanDuration(duration));
      });
    });

    it("선택된 기간이 올바르게 표시되어야 한다.", () => {
      // Arrange
      const { getDurationRadio, getDurationRadioDot } = setup({ DURATION: DURATION.ONE_MONTH });

      // Assert
      expect(getDurationRadio(DURATION.ONE_MONTH)).toHaveClass("border-bold bg-bold");
      expect(getDurationRadioDot(DURATION.ONE_MONTH)).toBeInTheDocument();
    });

    it("모달이 열려있을 때만 렌더링 되어야 한다.", () => {
      // Arrange
      const { getBaseModal } = setup();

      // Assert
      expect(getBaseModal()).toBeInTheDocument();

      // Arrange & Act
      const { container } = setup({ isOpen: false });

      // Assert
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("사용자 동작 테스트", () => {
    it("기간을 선택하면 onSelect 콜백이 호출되어야 한다.", () => {
      // Arrange
      const { getDurationOption, onSelectMock } = setup();

      // Act
      fireEvent.click(getDurationOption(DURATION.THREE_MONTHS));

      // Assert
      expect(onSelectMock).toHaveBeenCalledWith(DURATION.THREE_MONTHS);
    });

    it("선택된 기간이 변경되면 스타일이 업데이트되어야 한다.", () => {
      // Arrange
      const initialDuration = DURATION.ONE_MONTH;
      const newDuration = DURATION.THREE_MONTHS;
      const { getDurationOption, onSelectMock } = setup({ selectedDuration: initialDuration });

      // Act
      fireEvent.click(getDurationOption(newDuration));

      // Assert
      expect(onSelectMock).toHaveBeenCalledWith(newDuration);
    });

    it("모든 duration은 클릭 가능해야 한다.", () => {
      // Arrange
      const { getDurationOption } = setup();

      // Act & Assert
      Object.values(DURATION).forEach((duration) => {
        fireEvent.click(getDurationOption(duration));
        expect(getDurationOption(duration)).toHaveClass("cursor-pointer");
      });
    });
  });

  describe("에러 케이스 테스트", () => {
    it("selectedDuration가 undefined인 경우 처리가 되어야 한다.", () => {
      // Arrange
      const { getDurationOptions } = setup({ selectedDuration: undefined });

      // Assert
      expect(getDurationOptions()).toBeInTheDocument();
    });
  });
});