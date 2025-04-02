import React from 'react';
import { render, screen } from "@testing-library/react";
import MeetingContent from "./MeetingContent";
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

describe("MeetingContent 컴포넌트", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      postInfo: MOCK_MEETING_DETAIL,
    };

    const utils = render(
      <MeetingContent {...defaultProps} {...props} />
    );

    return {
      getMeetingContent: () => screen.getByTestId("meeting-content"),
      getDescriptionLabel: () => screen.getByTestId("description-label"),
      getDescriptionContent: () => screen.getByTestId("description-content"),
      getGoalLabel: () => screen.getByTestId("goal-label"),
      getGoalContent: () => screen.getByTestId("goal-content"),
      getOtherInfoLabel: () => screen.getByTestId("other-info-label"),
      getOtherInfoContent: () => screen.getByTestId("other-info-content"),
      getDividers: () => screen.getAllByTestId("divider"),
      ...utils,
    };
  };

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      const { 
        getMeetingContent,
        getDescriptionContent,
        getGoalContent,
        getOtherInfoContent
      } = setup();

      // Assert
      expect(getMeetingContent()).toBeInTheDocument();
      expect(getDescriptionContent()).toHaveTextContent("리액트 스터디");
      expect(getGoalContent()).toHaveTextContent("리액트 마스터하기");
      expect(getOtherInfoContent()).toHaveTextContent("");
    });

    it("조건부 렌더링이 올바르게 동작해야 한다", () => {
      // Arrange
      const { getDescriptionLabel, getGoalLabel, getOtherInfoLabel } = setup();

      // Assert
      expect(getDescriptionLabel()).toHaveTextContent("🚀 스터디/프로젝트 소개");
      expect(getGoalLabel()).toHaveTextContent("👍 목표");
      expect(getOtherInfoLabel()).toHaveTextContent("😊 기타 정보");
    });

    it("모든 라벨이 올바르게 표시되어야 한다", () => {
      // Arrange
      const { 
        getDescriptionLabel,
        getGoalLabel,
        getOtherInfoLabel
      } = setup();

      // Assert
      expect(getDescriptionLabel()).toHaveTextContent("🚀 스터디/프로젝트 소개");
      expect(getGoalLabel()).toHaveTextContent("👍 목표");
      expect(getOtherInfoLabel()).toHaveTextContent("😊 기타 정보");
    });

    it("구분선이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      const { getDividers } = setup();
      const dividers = getDividers();

      // Assert
      expect(dividers).toHaveLength(2);
      dividers.forEach(divider => {
        expect(divider).toHaveClass("bg-main");
      });
    });
  });

  describe("에러 케이스 테스트", () => {
    it("빈 정보로도 렌더링되어야 한다", () => {
      // Arrange
      const { getDescriptionContent, getGoalContent, getOtherInfoContent } = setup({
        postInfo: {
          ...MOCK_MEETING_DETAIL,
          description: "",
          goal: "",
          otherInfo: ""
        }
      });

      // Assert
      expect(getDescriptionContent()).toHaveTextContent("");
      expect(getGoalContent()).toHaveTextContent("");
      expect(getOtherInfoContent()).toHaveTextContent("");
    });
  });
});