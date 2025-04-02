import React from 'react';
import { cleanup, render } from "@testing-library/react";
import EventMarker from "./EventMarker";
import { RecruitmentType, DURATION } from "../../types/models/meeting";

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

const mockNaverMaps = {
  Marker: jest.fn(() => mockMarker),
  InfoWindow: jest.fn(() => mockInfoWindow),
  LatLng: jest.fn(),
  Size: jest.fn(),
  Point: jest.fn(),
  Event: {
    addListener: jest.fn()
  }
};

const MOCK_MEETING = {
  id: 1,
  title: "리액트 스터디",
  recruitmentType: RecruitmentType.STUDY,
  maxParticipants: 5,
  duration: DURATION.ONE_MONTH,
  endDate: "2024-03-01",
  techStacks: ["React", "SpringBoot"],
  location: "서울시 강남구",
  latitude: 37.123,
  longitude: 127.123,
  likeDto: {
    isLiked: false,
    likeCount: 0
  }
};

describe("EventMarker 컴포넌트", () => {
  const setup = (props = {}) => {
    const mockMap = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      getCenter: jest.fn(),
      getBounds: jest.fn(),
      userMap: true
    } as unknown as naver.maps.Map;

    const defaultProps = {
      meeting: MOCK_MEETING,
      position: {
        latitude: 37.123,
        longitude: 127.123
      },
      map: mockMap
    };

    window.naver = {
      maps: mockNaverMaps
    };

    const utils = render(
      <EventMarker {...defaultProps} {...props} />
    );

    return {
      mockMarker,
      mockInfoWindow,
      mockNaverMaps,
      mockMap,
      defaultProps,
      ...utils,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("UI 렌더링 테스트", () => {
    it("마커가 올바른 위치에 생성되어야 한다", () => {
      // Arrange
      const expectedLat = 37.123;
      const expectedLng = 127.123;

      // Act
      const { mockNaverMaps } = setup();

      // Assert
      expect(mockNaverMaps.Marker).toHaveBeenCalled();
      expect(mockNaverMaps.LatLng).toHaveBeenCalledWith(expectedLat, expectedLng);
    });

    it("InfoWindow가 올바른 설정으로 생성되어야 한다", () => {
      // Arrange
      const expectedConfig = {
        content: '',
        backgroundColor: '#fff',
        borderColor: '#7C8BBE',
        borderWidth: 1,
        anchorSkew: true,
        anchorColor: '#fff'
      };

      // Act
      const { mockNaverMaps } = setup();

      // Assert
      expect(mockNaverMaps.InfoWindow).toHaveBeenCalledWith(
        expect.objectContaining(expectedConfig)
      );
    });
  });

  describe("사용자 동작 테스트", () => {
    it("마커 클릭시 InfoWindow가 열리고 상태가 유지되어야 한다", () => {
      // Arrange
      const { mockNaverMaps, mockInfoWindow } = setup();
      const clickHandler = mockNaverMaps.Event.addListener.mock.calls.find(
        call => call[1] === 'click'
      )?.[2];
      const mouseoutHandler = mockNaverMaps.Event.addListener.mock.calls.find(
        call => call[1] === 'mouseout'
      )?.[2];

      // Act
      clickHandler?.();
      mouseoutHandler?.();

      // Assert
      expect(mockInfoWindow.setContent).toHaveBeenCalled();
      expect(mockInfoWindow.open).toHaveBeenCalled();
      expect(mockInfoWindow.close).not.toHaveBeenCalled();
    });

    it("클릭되지 않은 상태에서 마우스 동작시 InfoWindow가 토글되어야 한다", () => {
      // Arrange
      const { mockNaverMaps, mockInfoWindow } = setup();
      mockInfoWindow.getMap.mockReturnValue(null);
      const mouseoverHandler = mockNaverMaps.Event.addListener.mock.calls.find(
        call => call[1] === 'mouseover'
      )?.[2];
      const mouseoutHandler = mockNaverMaps.Event.addListener.mock.calls.find(
        call => call[1] === 'mouseout'
      )?.[2];

      // Act
      mouseoverHandler?.();
      mockInfoWindow.getMap.mockReturnValue({});
      mouseoutHandler?.();

      // Assert
      expect(mockInfoWindow.open).toHaveBeenCalled();
      expect(mockInfoWindow.close).toHaveBeenCalled();
    });
  });

  describe("에러 케이스 테스트", () => {
    it("잘못된 위치 정보가 주어졌을 때 에러가 발생하지 않아야 한다", () => {
      // Arrange
      const invalidPosition = {
        latitude: null,
        longitude: null
      };

      // Act & Assert
      expect(() => {
        setup({ position: invalidPosition });
      }).not.toThrow();
    });

    it("지도가 제공되지 않았을 때 에러가 발생하지 않아야 한다", () => {
      // Arrange
      const nullMap = null;

      // Act & Assert
      expect(() => {
        setup({ map: nullMap });
      }).not.toThrow();
    });

    it("InfoWindow가 이미 열려있는 상태에서 마우스오버시 중복으로 열리지 않아야 한다", () => {
      // Arrange
      const { mockNaverMaps, mockInfoWindow } = setup();
      mockInfoWindow.getMap.mockReturnValue({});
      const mouseoverHandler = mockNaverMaps.Event.addListener.mock.calls.find(
        call => call[1] === 'mouseover'
      )?.[2];

      // Act
      mouseoverHandler?.();

      // Assert
      expect(mockInfoWindow.open).not.toHaveBeenCalled();
    });
  });

  describe("성능 테스트", () => {
    it("컴포넌트 언마운트시 마커와 InfoWindow가 제거되어야 한다", () => {
      // Arrange
      const { unmount, mockMarker, mockInfoWindow } = setup();

      // Act
      unmount();

      // Assert
      expect(mockMarker.setMap).toHaveBeenCalledWith(null);
      expect(mockInfoWindow.close).toHaveBeenCalled();
    });
  });
});