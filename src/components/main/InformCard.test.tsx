import React from 'react';
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import InformCard, { IconTitleType } from "./InformCard";
import { RecruitmentType, DURATION } from "../../types/models/meeting";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockToggleLike = jest.fn();
jest.mock("../../hooks/api/useLike", () => ({
  useLike: () => ({
    toggleLike: {
      mutate: mockToggleLike
    }
  })
}));

const MOCK_MEETING = {
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
};

describe("InformCard 컴포넌트", () => {
  const setup = (props = {}) => {

    const defaultProps = {
      meeting: MOCK_MEETING,
      fullWidth: false,
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
      <InformCard {...defaultProps} {...props} />,
      { wrapper }
    );

    return {
      mockNavigate,
      mockToggleLike,
      defaultProps,
      getLikeButton: () => screen.getByTestId("like-button"),
      getLikeBorderButton: () => screen.getByTestId("like-border-button"),
      getLikeFilledButton: () => screen.getByTestId("like-filled-button"),
      getInformCard: () => screen.getByTestId("inform-card"),
      getInformTitle: () => screen.getByTestId("meeting-title"),
      getShotInform: (title: string) => screen.getByTestId(`inform-${title}`),
      getShotInformTitle: (title: string) => screen.getByTestId(`inform-${title}-label`),
      getShotInformContent: (title: string) => screen.getByTestId(`inform-${title}-content`),
      ...utils,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup();
  })

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 데이터에 맞게 올바르게 렌더링되어야 한다.", () => {
      // Arrange
      const {
        getLikeBorderButton,
        getShotInformContent,
        getShotInformTitle,
      } = setup();

      const sections: IconTitleType[] = ["관심", "인원", "기간", "마감", "스택", "장소"];
      const expectedContents: Record<IconTitleType, string> = {
        "관심": "0",
        "인원": "5명",
        "기간": "1개월",
        "마감": "2024-03-01",
        "스택": "React, SpringBoot",
        "장소": "하계동, 학여울청구아파트"
      };

      // Assert
      expect(getLikeBorderButton()).toBeInTheDocument();
      sections.forEach(section => {
        expect(getShotInformTitle(section)).toHaveTextContent(section);
        expect(getShotInformContent(section)).toHaveTextContent(expectedContents[section]);
      });
    });

    it("카드 너비가 fullWidth prop에 따라 너비가 변경되어야 한다.", () => {
      // Arrange
      const { getInformCard } = setup({ fullWidth: true });

      // Assert
      expect(getInformCard()).toHaveClass("w-full");
      expect(getInformCard()).not.toHaveClass("w-3/5");
    });

    it("좋아요가 된 상태에서는 채워진 하트 아이콘이 표시되어야 한다.", () => {
      // Arrange
      const { getLikeFilledButton } = setup({
        meeting: {
          ...setup().defaultProps.meeting,
          likeDto: {
            isLiked: true,
            likeCount: 1
          }
        }
      });

      // Assert
      expect(getLikeFilledButton()).toBeInTheDocument();
    });

    it("모집 유형에 따라 올바른 카테고리가 표시되어야 한다.", () => {
      // Arrange
      const recruitmentTypes = {
        [RecruitmentType.PROJECT]: "프로젝트",
        [RecruitmentType.STUDY]: "스터디"
      };

      Object.entries(recruitmentTypes).forEach(([type, text]) => {
        cleanup();
        const { getInformCard } = setup({
          meeting: {
            ...MOCK_MEETING,
            recruitmentType: type as RecruitmentType
          }
        });

        // Assert
        expect(getInformCard()).toHaveTextContent(`[${text}]`);
      });
    });

    it("모든 진행 기간 타입이 올바르게 표시되어야 한다.", () => {
      // Arrange
      const durationMap = {
        [DURATION.ONE_WEEK]: "1주",
        [DURATION.TWO_WEEKS]: "2주",
        [DURATION.ONE_MONTH]: "1개월",
        [DURATION.TWO_MONTHS]: "2개월",
        [DURATION.THREE_MONTHS]: "3개월",
        [DURATION.SIX_MONTHS]: "6개월",
        [DURATION.ONE_YEAR]: "1년",
        [DURATION.MORE_THAN_ONE_YEAR]: "1년 이상"
      };

      Object.entries(durationMap).forEach(([duration, expectedText]) => {
        cleanup();
        const { getShotInformContent } = setup({
          meeting: {
            ...MOCK_MEETING,
            duration: duration as DURATION
          }
        });

        // Assert
        expect(getShotInformContent('기간')).toHaveTextContent(expectedText);
      });
    });

    it("위치 정보가 괄호 안의 내용만 표시되어야 한다.", () => {
      // Arrange
      const { getShotInformContent } = setup({
        meeting: {
          ...MOCK_MEETING,
          location: "서울시 강남구 (테헤란로)"
        }
      });

      // Assert
      expect(getShotInformContent("장소")).toHaveTextContent("테헤란로");
      expect(getShotInformContent("장소")).not.toHaveTextContent("서울시 강남구");
    });

    it("익명 사용자일 경우 빈 하트가 표시되어야 한다.", () => {
      // Arrange
      const { getLikeBorderButton } = setup({
        meeting: {
          ...MOCK_MEETING,
          likeDto: {
            isLiked: undefined,
            likeCount: 0
          }
        }
      });

      // Assert
      expect(getLikeBorderButton()).toBeInTheDocument();
    });

    it("참가 인원이 10명일 경우 '10명 이상'으로 표시되어야 한다.", () => {
      // Arrange
      const { getShotInformContent } = setup({
        meeting: {
          ...MOCK_MEETING,
          maxParticipants: 10
        }
      });

      // Assert
      expect(getShotInformContent('인원')).toHaveTextContent('10명 이상');
    });

    it("여러 기술 스택이 있을 경우 쉼표로 구분되어 표시되어야 한다.", () => {
      // Arrange
      const { getShotInformContent } = setup({
        meeting: {
          ...MOCK_MEETING,
          techStacks: ["React", "Vue", "Angular", "GraphQL"]
        }
      });

      // Assert
      expect(getShotInformContent('스택')).toHaveTextContent("React, Vue, Angular, GraphQL");
    });
  });

  describe("사용자 동작 테스트", () => {
    it("카드 클릭시 정확한 ID의 상세 페이지로 이동해야 한다.", () => {
      // Arrange
      const testId = 123;
      const { getInformCard, mockNavigate } = setup({
        meeting: {
          ...MOCK_MEETING,
          id: testId
        }
      });

      // Act
      fireEvent.click(getInformCard());

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith(`/meeting/detail/${testId}`);
    });

    it("좋아요 버튼을 누르면 토글이 호출되어야 한다.", () => {
      // Arrange
      const { getLikeButton, mockToggleLike } = setup();

      // Act
      fireEvent.click(getLikeButton());

      // Assert
      expect(mockToggleLike).toHaveBeenCalledWith(false);
    });

    it("좋아요 버튼 클릭시 카드 클릭 이벤트가 발생하지 않아야 한다.", () => {
      // Arrange
      const { getLikeButton, mockNavigate } = setup();

      // Act
      fireEvent.click(getLikeButton());

      // Assert
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("에러 케이스 테스트", () => {
    it("필수 데이터가 없을 때도 렌더링되어야 한다", () => {
      // Arrange
      const { getInformCard, getShotInformContent } = setup({
        meeting: {
          ...MOCK_MEETING,
          techStacks: [],
          location: "",
        }
      });

      // Assert
      expect(getInformCard()).toBeInTheDocument();
      expect(getShotInformContent('스택')).toHaveTextContent("");
      expect(getShotInformContent('장소')).toHaveTextContent("");
    });
  });
});