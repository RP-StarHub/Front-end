import React from 'react';
import { render, screen } from "@testing-library/react";
import StepIndicator from "./LagreStepIndicator";

const DEFAULT_STEPS = [
  { title: "기본 정보" },
  { title: "모임 소개" },
  { title: "완료" }
];

describe("LargeStepIndicator 컴포넌트", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      currentStep: 0,
      steps: DEFAULT_STEPS
    };

    const utils = render(<StepIndicator {...defaultProps} {...props} />);

    return {
      getStepIndicator: () => screen.getByTestId("step-indicator"),
      getStepItem: (index: number) => screen.getByTestId(`step-item-${index}`),
      getStepCircle: (index: number) => screen.getByTestId(`step-circle-${index}`),
      getStepTitle: (index: number) => screen.getByTestId(`step-title-${index}`),
      getStepConnector: (index: number) => screen.getByTestId(`step-connector-${index}`),
      getStepConnectorLine: (index: number) => screen.getByTestId(`step-connector-line-${index}`),
      getStepCheck: (index: number) => screen.queryByTestId(`step-check-${index}`),
      getStepDot: (index: number) => screen.queryByTestId(`step-dot-${index}`),
      defaultProps,
      ...utils,
    };
  };

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 데이터에 맞게 올바르게 렌더링되어야 한다.", () => {
      // Arrange
      const { getStepIndicator, getStepItem, getStepTitle } = setup();

      // Assert
      expect(getStepIndicator()).toBeInTheDocument();
      DEFAULT_STEPS.forEach((step, index) => {
        expect(getStepItem(index)).toBeInTheDocument();
        expect(getStepTitle(index)).toHaveTextContent(step.title);
      });
    });

    it("단계별 상태가 올바르게 표시되어야 한다.", () => {
      // Arrange
      const { getStepCircle, getStepCheck, getStepDot } = setup({ currentStep: 1 });

      // Assert
      expect(getStepCircle(0)).toBeInTheDocument();
      expect(getStepDot(1)).toBeInTheDocument();
      expect(getStepCheck(2)).not.toBeInTheDocument();
    });

    it("단계별 연결 선이 올바르게 표시되어야 한다.", () => {
      // Arrange
      const { getStepConnector } = setup();

      // Assert
      expect(getStepConnector(0)).toBeInTheDocument();
      expect(getStepConnector(1)).toBeInTheDocument();
      expect(screen.queryByTestId('step-connector-2')).not.toBeInTheDocument();
    });
  });

  describe("사용자 동작 테스트", () => {
    it("단게 변경 시 상태가 올바르게 변경되어야 한다.", () => {
      // Arrange
      const { getStepCircle, rerender } = setup();

      // Act
      expect(getStepCircle(0)).toHaveClass("bg-white", "border-bold");

      rerender(<StepIndicator currentStep={1} steps={DEFAULT_STEPS} />);

      // Assert
      expect(getStepCircle(0)).toHaveClass("bg-bold", "border-bold");
      expect(getStepCircle(1)).toHaveClass("bg-white", "border-bold");
    });
  });

  describe("에러 케이스 테스트", () => {
    it("steps가 빈 배열일 경우 처리가 되어야 한다.", () => {
      // Arrange
      const { getStepIndicator } = setup({ steps: [] });

      // Assert
      expect(getStepIndicator()).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("currentStep이 steps의 범위를 벗어날 경우 처리가 되어야 한다.", () => {
      // Arrange
      const { getStepCheck } = setup({ currentStep: 5 });

      // Assert
      DEFAULT_STEPS.forEach((_, index) => {
        expect(getStepCheck(index)).toBeInTheDocument();
      });
    });
  });
});