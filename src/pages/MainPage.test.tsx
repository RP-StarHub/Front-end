import React from 'react';
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import MainPage from './MainPage';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { DURATION, RecruitmentType } from '../types/models/meeting';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const MOCK_MEETING = {
  "id": 1,
  "title": "ㅎㅇ",
  "recruitmentType": RecruitmentType.STUDY,
  "maxParticipants": 3,
  "duration": DURATION.ONE_WEEK,
  "endDate": "2025-01-31",
  "techStacks": [
    "GraphQL",
    "Kafka",
    "GraphQL",
    "Kafka"
  ],
  "location": "서울 노원구 동일로207길 186(하계동, 학여울청구아파트)",
  "latitude": 37.6379556162713,
  "longitude": 127.059802173858,
  "likeDto": {
    "likeCount": 0,
    "isLiked": null
  }
}

const MOCK_MAIN_MEETING = {
  "data": {
    "content": [
      { ...MOCK_MEETING, id: 1 },
      { ...MOCK_MEETING, id: 2 },
      { ...MOCK_MEETING, id: 3 },
      { ...MOCK_MEETING, id: 4 },
    ],
    "totalPages": 2,
  }
};

const mockGeolocation = jest.fn();
jest.mock('../hooks/common/useGeolocation', () => ({
  useGeolocation: () => ({
    location: {
      latitude: 37.123,
      longitude: 127.123
    },
    loaded: true
  })
}));

const mockMeeting = jest.fn();
jest.mock('../hooks/api/useMeeting', () => ({
  useMeetingList: (page: number) => {
    mockMeeting(page);
    return {
      data: MOCK_MAIN_MEETING,
      isLoading: false
    };
  }
}));


jest.mock('react-dom/server', () => ({
  renderToString: jest.fn().mockReturnValue('<div data-overcard></div>')
}));

const mockMarker = {
  setMap: jest.fn(),
  setPosition: jest.fn()
};

const mockInfoWindow = {
  setContent: jest.fn(),
  open: jest.fn(),
  close: jest.fn(),
  getMap: jest.fn()
};

const mockMap = {
  destroy: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  getCenter: jest.fn(),
  getBounds: jest.fn(),
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  userMap: true
}

const mockNaverMaps = {
  Map: jest.fn(() => mockMap),
  Marker: jest.fn(() => mockMarker),
  InfoWindow: jest.fn(() => mockInfoWindow),
  LatLng: jest.fn(),
  Size: jest.fn(),
  Point: jest.fn(),
  Position: {
    TOP_RIGHT: 'TOP_RIGHT'
  },
  Event: {
    addListener: jest.fn()
  }
};

describe("MainPage 통합 테스트", () => {
  const setup = (props = {}) => {
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

    window.naver = {
      maps: mockNaverMaps
    };

    const utils = render(
      <MainPage {...props} />,
      { wrapper }
    );

    return {
      mockGeolocation,
      mockMeeting,
      ...utils,
      getMainContainer: () => screen.getByTestId("main-container"),
      getStudyListContainer: () => screen.getByTestId("study-list-wrapper"),
      getMapContainer: () => screen.getByTestId("map-container"),
      getMapElement: () => screen.getByTestId("map-element"),
      getAllInformItems: () => screen.getAllByTestId("inform-card"),
      getPrevButton: () => screen.getByTestId("prev-button"),
      getNextButton: () => screen.getByTestId("next-button"),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 데이터에 맞게 올바르게 렌더링되어야 한다.", () => {
      // Arrange  
      const {
        getMainContainer,
        getStudyListContainer,
        getMapContainer,
        getMapElement,
        getAllInformItems
      } = setup();

      // Assert
      expect(getMainContainer()).toBeInTheDocument();
      expect(getStudyListContainer()).toBeInTheDocument();
      expect(getMapContainer()).toBeInTheDocument();
      expect(getMapElement()).toBeInTheDocument();
      expect(getAllInformItems()).toHaveLength(MOCK_MAIN_MEETING.data.content.length);
    });

    it("지도가 올바른 설정으로 초기화 되어야 한다.", () => {
      // Arrange  
      setup();

      // Assert
      expect(mockNaverMaps.Map).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        {
          center: expect.any(mockNaverMaps.LatLng),
          zoom: 17,
          zoomControl: true,
          zoomControlOptions: {
            position: mockNaverMaps.Position.TOP_RIGHT
          }
        }
      )
    });

    it("반응형 레이아웃이 적용되어야 한다.", () => {
      // Arrange
      const {
        getMainContainer,
        getStudyListContainer,
        getMapContainer,
      } = setup();

      // Assert
      expect(getMainContainer()).toHaveClass("flex-col", "md:flex-row");
      expect(getStudyListContainer()).toHaveClass("w-full", "md:w-1/3", "lg:w-1/4");
      expect(getMapContainer()).toHaveClass("w-full", "md:w-2/3", "lg:w-3/4");
    });
  });

  describe("사용자 동작 테스트", () => {
    it("페이지 변경 시 새로운 데이터를 요청해야 한다.", () => {
      // Arrange  
      const { getNextButton } = setup();
      expect(mockMeeting).toHaveBeenNthCalledWith(1, 1);

      // Act
      fireEvent.click(getNextButton());

      // Assert
      expect(mockMeeting).toHaveBeenLastCalledWith(2);
    });
  });

  describe("에러 케이스 테스트", () => {
    it("데이터가 없는 경우에도 UI가 렌더링되어야 한다", () => {
      // Arrange
      mockMeeting.mockImplementation(() => ({
        data: { data: { content: [], totalPages: 0 } },
        isLoading: false
      }));

      // Act
      const { getMainContainer, getStudyListContainer } = setup();

      // Assert
      expect(getMainContainer()).toBeInTheDocument();
      expect(getStudyListContainer()).toBeInTheDocument();
    });

    it("위치 정보가 없는 경우에도 UI가 렌더링되어야 한다", () => {
      // Arrange
      mockGeolocation.mockImplementation(() => ({
        location: null,
        loaded: true
      }));

      // Act
      const { getMainContainer, getStudyListContainer } = setup();

      // Assert
      expect(getMainContainer()).toBeInTheDocument();
      expect(getStudyListContainer()).toBeInTheDocument();
    });
  });
});