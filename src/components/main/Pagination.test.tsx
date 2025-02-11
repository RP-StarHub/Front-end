import { render, screen, fireEvent } from "@testing-library/react";

import Pagination from "./Pagination";

describe("Pagination 컴포넌트", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      currentPage: 1,
      totalPages: 10,
      onPageChange: jest.fn(),
    };

    const utils = render(
      <Pagination {...defaultProps} {...props} />
    );

    return {
      nextButton: screen.getByText("다음"),
      prevButton: screen.getByText("이전"),
      getPageButton: (num: number) => screen.getByText(num.toString()),
      getEllipsis: () => screen.getAllByText("..."),
      mockOnPageChange: defaultProps.onPageChange,
      ...utils,
    };
  };

  // 경계값 테스트
  describe("페이지 수에 따른 표시 테스트", () => {
    it("페이지가 1개일 때는 1만 표시되어야 한다", () => {
      // Arrange
      const { getPageButton } = setup({ totalPages: 1 });

      // Assert
      expect(getPageButton(1)).toBeInTheDocument();
      expect(screen.queryByText("2")).not.toBeInTheDocument();
    });

    it("페이지가 7개일 때는 모든 숫자가 표시되어야 한다", () => {
      // Arrange
      const totalPages = 7;
      setup({ totalPages });

      // Assert
      for (let i = 1; i <= totalPages; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("페이지가 8개일 때부터는 생략 부호가 표시되어야 한다", () => {
      // Arrange
      const { getPageButton, getEllipsis } = setup({
        currentPage: 4,
        totalPages: 8
      });

      // Assert
      expect(getPageButton(1)).toBeInTheDocument();
      expect(getEllipsis()).toHaveLength(2);
      expect(getPageButton(8)).toBeInTheDocument();
    });
  });

  // 페이지 위치 테스트
  describe("페이지 위치에 따른 표시 테스트", () => {
    it("현재 페이지가 1일 때는 시작 부분의 숫자들이 표시되어야 한다", () => {
      // Arrange
      const { getPageButton, getEllipsis } = setup();

      // Assert
      // 현재 페이지 활성화 확인
      expect(getPageButton(1)).toHaveAttribute("aria-current", "page");

      // 표시되는 숫자들 확인
      expect(getPageButton(1)).toBeInTheDocument();
      expect(getPageButton(2)).toBeInTheDocument();
      expect(getEllipsis()).toHaveLength(1);
      expect(getPageButton(10)).toBeInTheDocument();
    });

    it("현재 페이지가 마지막일 때는 끝 부분의 숫자들이 표시되어야 한다", () => {
      // Arrange
      const { getPageButton, getEllipsis } = setup({ currentPage: 10 });

      // Assert
      // 현재 페이지 활성화 확인
      expect(getPageButton(10)).toHaveAttribute("aria-current", "page");

      // 표시되는 숫자들 확인
      expect(getPageButton(1)).toBeInTheDocument();
      expect(getEllipsis()).toHaveLength(1);
      expect(getPageButton(9)).toBeInTheDocument();
      expect(getPageButton(10)).toBeInTheDocument();
    });

    it("중간 페이지에서는 현재 페이지 주변 숫자들이 표시되어야 한다", () => {
      // Arrange
      const { getPageButton, getEllipsis } = setup({ currentPage: 5 });

      // Assert
      // 현재 페이지 활성화 확인
      expect(getPageButton(5)).toHaveAttribute("aria-current", "page");

      // 항상 표시되어야 하는 처음과 끝 확인
      [1, 10].forEach((num) => {
        expect(getPageButton(num)).toBeInTheDocument();
      });

      // 현재 페이지 주변 숫자들
      [4, 5, 6].forEach((num) => {
        expect(getPageButton(num)).toBeInTheDocument();
      });

      // 생략 부호
      expect(getEllipsis()).toHaveLength(2);
    });
  });

  // 사용자 인터랙션 테스트
  describe("사용자 동작 테스트", () => {
    it("숫자를 클릭하면 해당 페이지로 이동해야 한다", () => {
      // Arrange
      const { getPageButton, mockOnPageChange } = setup();

      // Act
      fireEvent.click(getPageButton(2));

      // Assert
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it("연속으로 다음 버튼을 클릭하면 페이지가 순차적으로 증가해야 한다", () => {
      // Arrange
      let currentPage = 1;
      const { nextButton, mockOnPageChange, rerender, getPageButton } = setup({
        currentPage,
        totalPages: 5
      });

      // Act & Assert
      expect(getPageButton(1)).toHaveAttribute("aria-current", "page");
      fireEvent.click(nextButton);
      expect(mockOnPageChange).toHaveBeenLastCalledWith(2);

      // Arrange
      currentPage = 2;
      rerender(
        <Pagination currentPage={currentPage} totalPages={5} onPageChange={mockOnPageChange} />
      );

      // Act & Assert
      expect(getPageButton(2)).toHaveAttribute("aria-current", "page");
      fireEvent.click(nextButton);
      expect(mockOnPageChange).toHaveBeenLastCalledWith(3);
    });

    it("연속으로 이전 버튼을 클릭하면 페이지가 순차적으로 감소해야 한다", () => {
      // Arrange
      let currentPage = 3;
      const { prevButton, mockOnPageChange, rerender, getPageButton } = setup({
        currentPage,
        totalPages: 5
      });

      // Act & Assert
      expect(getPageButton(3)).toHaveAttribute("aria-current", "page");
      fireEvent.click(prevButton);
      expect(mockOnPageChange).toHaveBeenLastCalledWith(2);

      // Arrange
      currentPage = 2;
      rerender(
        <Pagination currentPage={currentPage} totalPages={5} onPageChange={mockOnPageChange} />
      );

      // Act & Assert
      expect(getPageButton(2)).toHaveAttribute("aria-current", "page");
      fireEvent.click(prevButton);
      expect(mockOnPageChange).toHaveBeenLastCalledWith(1);
    });

    it("첫 페이지에서는 이전 버튼이 비활성화되어야 한다", () => {
      // Arrange
      const { prevButton } = setup();

      // Assert
      expect(prevButton).toBeDisabled();
    });

    it("마지막 페이지에서는 다음 버튼이 비활성화되어야 한다", () => {
      // Arrange
      const { nextButton } = setup({ currentPage: 10, totalPages: 10 });

      // Assert
      expect(nextButton).toBeDisabled();
    });
  });

  // 접근성 테스트
  describe("접근성 테스트", () => {
    it("이전/다음 버튼에는 적절한 aria-label이 있어야 한다", () => {
      // Arrange
      const { prevButton, nextButton } = setup();

      // Assert
      expect(prevButton).toHaveAttribute("aria-label", "이전 페이지");
      expect(nextButton).toHaveAttribute("aria-label", "다음 페이지");
    });

    it("현재 페이지 버튼에는 aria-current 속성이 있어야 한다", () => {
      // Arrange
      const { getPageButton } = setup({ currentPage: 5 });

      // Assert
      expect(getPageButton(5)).toHaveAttribute("aria-current", "page");
    });
  });

  describe("에러 케이스 테스트", () => {
    it("totalPages가 0이거나 음수일 때 모든 페이지 버튼이 보이지 않아야 한다", () => {
      // Arrange
      const { prevButton } = setup({ totalPages: 0 });

      // Assert
      expect(screen.queryByText("1")).not.toBeInTheDocument();
      expect(prevButton).toBeDisabled();
    });

    it("currentPage가 totalPages보다 크면 onPageChange가 호출되지 않아야 한다", () => {
      // Arrange
      const { nextButton, mockOnPageChange } = setup({
        currentPage: 10,
        totalPages: 10
      });

      // Act
      fireEvent.click(nextButton);

      // Assert
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it("생략 부호(...)는 클릭해도 페이지 변경이 되지 않아야 한다", () => {
      // Arrange
      const { mockOnPageChange, getEllipsis } = setup({
        currentPage: 5,
        totalPages: 10
      });

      // Act
      const ellipsis = getEllipsis()[0];
      fireEvent.click(ellipsis);

      // Assert
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });
});