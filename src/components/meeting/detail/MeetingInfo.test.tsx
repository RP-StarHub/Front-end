import React from 'react';
import { render, screen, cleanup } from "@testing-library/react";
import MeetingInfo from "./MeetingInfo";
import { MeetingDetail, DURATION, RecruitmentType } from "../../../types/models/meeting";

const MOCK_MEETING_DETAIL: MeetingDetail = {
  id: 1,
  title: "리액트 스터디",
  recruitmentType: RecruitmentType.STUDY,
  maxParticipants: 5,
  duration: DURATION.ONE_MONTH,
  endDate: "2024-03-01",
  location: "서울시 강남구 (테헤란로)",
  latitude: 37.123,
  longitude: 127.123,
  description: "리액트 스터디",
  goal: "리액트 마스터하기",
  otherInfo: "",
  techStacks: ["React", "TypeScript"],
  updatedAt: "2024-01-01",
  creator: {
    nickname: "개발자",
    profileImage: "profile.jpg"
  },
  isConfirmed: false
};

describe("MeetingInfo 컴포넌트", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      postInfo: MOCK_MEETING_DETAIL,
    };

    const utils = render(
      <MeetingInfo {...defaultProps} {...props} />
    );

    return {
      getMeetingInfo: () => screen.getByTestId("meeting-info"),
      getTechStackLabel: () => screen.getByTestId("tech-stack-label"),
      getTechStackContent: () => screen.getByTestId("tech-stack-content"),
      getLocationLabel: () => screen.getByTestId("location-label"),
      getLocationContent: () => screen.getByTestId("location-content"),
      getDurationLabel: () => screen.getByTestId("duration-label"),
      getDurationContent: () => screen.getByTestId("duration-content"),
      getParticipantsLabel: () => screen.getByTestId("participants-label"),
      getParticipantsContent: () => screen.getByTestId("participants-content"),
      getEndDateLabel: () => screen.getByTestId("end-date-label"),
      getEndDateContent: () => screen.getByTestId("end-date-content"),
      ...utils,
    };
  };

  afterEach(() => {
    cleanup();
  });

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      const { 
        getMeetingInfo,
        getTechStackContent,
        getLocationContent,
        getDurationContent,
        getParticipantsContent,
        getEndDateContent
      } = setup();

      // Assert
      expect(getMeetingInfo()).toBeInTheDocument();
      expect(getTechStackContent()).toHaveTextContent("React, TypeScript");
      expect(getLocationContent()).toHaveTextContent("서울시 강남구 (테헤란로)");
      expect(getDurationContent()).toHaveTextContent("1개월");
      expect(getParticipantsContent()).toHaveTextContent("5명");
      expect(getEndDateContent()).toHaveTextContent("2024-03-01");
    });

    it("모든 라벨이 올바르게 표시되어야 한다", () => {
      // Arrange
      const { 
        getTechStackLabel,
        getLocationLabel,
        getDurationLabel,
        getParticipantsLabel,
        getEndDateLabel
      } = setup();

      // Assert
      expect(getTechStackLabel()).toHaveTextContent("기술 스택");
      expect(getLocationLabel()).toHaveTextContent("진행 장소");
      expect(getDurationLabel()).toHaveTextContent("진행 기간");
      expect(getParticipantsLabel()).toHaveTextContent("모집 인원");
      expect(getEndDateLabel()).toHaveTextContent("모집 마감일");
    });

    it("진행 기간이 올바르게 표시되어야 한다", () => {
      // Arrange
      const { getDurationContent } = setup({
        postInfo: {
          ...MOCK_MEETING_DETAIL,
          duration: DURATION.ONE_MONTH
        }
      });

      // Assert
      expect(getDurationContent()).toHaveTextContent("1개월");
    });

    it("위치 정보가 올바르게 표시되어야 한다", () => {
      // Arrange
      const { getLocationContent } = setup({
        postInfo: {
          ...MOCK_MEETING_DETAIL,
          location: "서울시 강남구 (테헤란로)"
        }
      });

      // Assert
      expect(getLocationContent()).toHaveTextContent("서울시 강남구 (테헤란로)");
    });

    it("참가 인원이 10명일 경우 '10명 이상'으로 표시되어야 한다", () => {
      // Arrange
      const { getParticipantsContent } = setup({
        postInfo: {
          ...MOCK_MEETING_DETAIL,
          maxParticipants: 10
        }
      });

      // Assert
      expect(getParticipantsContent()).toHaveTextContent("10명 이상");
    });

    it("참가 인원이 undefined일 경우 '1명'으로 표시되어야 한다", () => {
      // Arrange
      const { getParticipantsContent } = setup({
        postInfo: {
          ...MOCK_MEETING_DETAIL,
          maxParticipants: undefined
        }
      });

      // Assert
      expect(getParticipantsContent()).toHaveTextContent("1명");
    });
  });

  describe("에러 케이스 테스트", () => {
    it("필수 데이터가 누락되어도 렌더링되어야 한다", () => {
      // Arrange
      const { getTechStackContent, getLocationContent } = setup({
        postInfo: {
          ...MOCK_MEETING_DETAIL,
          techStacks: [],
          location: "",
        }
      });

      // Assert
      expect(getTechStackContent()).toHaveTextContent("");
      expect(getLocationContent()).toHaveTextContent("");
    });
  });
});