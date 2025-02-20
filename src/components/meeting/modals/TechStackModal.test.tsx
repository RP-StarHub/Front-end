import React from 'react';
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import TechStackModal from './TechStackModal';

const MOCK_TECH_STACKS = [
  { id: 1, name: "React", category: "FRONTEND" },
  { id: 2, name: "Vue", category: "FRONTEND" },
  { id: 5, name: "Spring", category: "BACKEND" }
];

const mockGetTechStack = jest.fn();

jest.mock('../../../hooks/api/useTechstack', () => ({
  useGetTechStack: () => mockGetTechStack()
}));

jest.mock('../../common/ui/BaseModal', () => {
  return function MockBaseModal({ children, isOpen, onConfirm }: {
    children: React.ReactNode,
    isOpen: boolean,
    onConfirm?: () => void
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="base-modal">
        {children}
        <button onClick={onConfirm} data-testid="confirm-button">확인</button>
      </div>
    );
  };
});

describe("TechStackModal 컴포넌트", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      onSelect: jest.fn(),
      selectedTechStacks: { selectedIds: [], customStacks: [] },
      anchorEl: document.createElement('div')
    };

    const utils = render(<TechStackModal {...defaultProps} {...props} />);

    return {
      getBaseModal: () => screen.getByTestId("base-modal"),
      getConfirmButton: () => screen.getByTestId("confirm-button"),
      getCustomInput: () => screen.getByPlaceholderText("스페이스바 또는 엔터로 구분"),
      onCloseMock: defaultProps.onClose,
      onSelectMock: defaultProps.onSelect,
      ...utils,
    };
  };

  beforeEach(() => {
    mockGetTechStack.mockReturnValue({
      data: {
        data: MOCK_TECH_STACKS
      },
      isLoading: false
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("UI 렌더링 테스트", () => {
    it("모달이 열려있을 때만 렌더링 되어야 한다.", () => {
      // Arrange & Act
      const { container } = setup({ isOpen: false });

      // Assert
      expect(container).toBeEmptyDOMElement();
    });

    it("기본 UI 요소들이 올바르게 렌더링되어야 한다.", () => {
      // Arrange
      const { getBaseModal, getCustomInput } = setup();

      // Assert
      expect(getBaseModal()).toBeInTheDocument();
      expect(getCustomInput()).toBeInTheDocument();
      MOCK_TECH_STACKS.forEach(stack => {
        expect(screen.getByText(stack.name)).toBeInTheDocument();
      });
    });
  });

  describe("사용자 동작 테스트", () => {
    it("기술 스택 선택 후 확인 시 onSelect가 호출되어야 한다.", () => {
      // Arrange
      const { getConfirmButton, onSelectMock } = setup();

      // Act
      fireEvent.click(screen.getByText("React"));
      fireEvent.click(screen.getByText("Spring"));
      fireEvent.click(getConfirmButton());

      // Assert
      expect(onSelectMock).toHaveBeenCalledWith({
        selectedIds: [1, 5],
        customStacks: []
      });
    });

    it("커스텀 스택이 추가되어야 한다.", () => {
      // Arrange
      const { getCustomInput, getConfirmButton, onSelectMock } = setup();

      // Act
      fireEvent.change(getCustomInput(), { target: { value: "Docker" } });
      fireEvent.keyDown(getCustomInput(), { key: 'Enter' });
      fireEvent.click(getConfirmButton());

      // Assert
      expect(onSelectMock).toHaveBeenCalledWith({
        selectedIds: [],
        customStacks: ["Docker"]
      });
    });
  });
});