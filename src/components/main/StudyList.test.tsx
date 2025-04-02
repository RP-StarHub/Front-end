import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StudyList from "./StudyList";
import { Meeting, RecruitmentType, DURATION } from "../../types/models/meeting";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockToggleLike = jest.fn();
jest.mock("../../hooks/api/useLike", () => ({
  useLike: () => ({
    toggleLike: {
      mutate: mockToggleLike
    }
  })
}));

const MOCK_MEETINGS: Meeting[] = [
  {
    id: 1,
    title: "리액트 스터디",
    recruitmentType: RecruitmentType.STUDY,
    maxParticipants: 5,
    duration: DURATION.ONE_MONTH,
    endDate: "2024-03-01",
    techStacks: ["React", "SpringBoot"],
    location: "서울 노원구 동일로207길 186(하계동, 학여울청구아파트)",
    latitude: 37.6379556162713,
    longitude: 127.059802173858,
    likeDto: {
      isLiked: false,
      likeCount: 0
    }
  }
];

describe("StudyList 컴포넌트", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      meetings: MOCK_MEETINGS,
      currentPage: 1,
      totalPages: 3,
      onPageChange: jest.fn(),
      onSearch: jest.fn()
    };

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        }
      }
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );

    const utils = render(
      <StudyList {...defaultProps} {...props} />,
      { wrapper }
    );

    return {
      mockOnPageChange: defaultProps.onPageChange,
      ...utils,
    };
  };


  describe("UI 렌더링 테스트", () => {
    it("스터디 카드의 제목이 올바르게 렌더링되어야 한다", () => {
      setup();
      const title = screen.getByText(/리액트 스터디/);
      expect(title).toBeInTheDocument();
    });

    it("빈 스터디 목록이 전달되어도 렌더링되어야 한다", () => {
      setup({ meetings: [] });
      expect(screen.getByTestId("study-grid")).toBeInTheDocument();
    });

    it("스터디 목록이 4개의 행을 가진 그리드로 표시되어야 한다", () => {
      setup();
      const gridContainer = screen.getByTestId("study-grid");
      expect(gridContainer).toHaveClass("grid-rows-4");
    });

    it("스터디 목록이 중앙 정렬되어야 한다", () => {
      setup();
      const cardContainers = screen.getAllByTestId("card-container");
      cardContainers.forEach(container => {
        expect(container).toHaveClass("justify-center");
      });
    });

    it("전체 컨테이너가 flex-col 레이아웃을 가져야 한다", () => {
      setup();
      const container = screen.getByTestId("study-list-container");
      expect(container).toHaveClass("flex", "flex-col");
    });

    it("meetings 배열 길이만큼 스터디 카드가 렌더링되어야 한다", () => {
      const meetings = [
        { ...MOCK_MEETINGS[0], id: 1 },
        { ...MOCK_MEETINGS[0], id: 2 },
        { ...MOCK_MEETINGS[0], id: 3 }
      ];
      setup({ meetings });
      const cards = screen.getAllByTestId("card-container");
      expect(cards).toHaveLength(3);
    });
  });

  describe("사용자 동작 테스트", () => {
    it("페이지 변경 시 onPageChange가 호출되어야 한다", () => {
      const { mockOnPageChange } = setup();
      const pageButton = screen.getByRole("button", { name: "2" });
      
      fireEvent.click(pageButton);
      
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe("에러 케이스 테스트", () => {
    it("meetings가 undefined여도 렌더링되어야 한다", () => {
      setup({ meetings: undefined });
      expect(screen.getByTestId("study-grid")).toBeInTheDocument();
    });
  });
});