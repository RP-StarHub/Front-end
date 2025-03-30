import { axiosInstance } from "./axios";
import { 
  GetPopularProjectsResponse, 
  GetPopularStudiesResponse, 
  GetPopularExpiringResponse 
} from "../../types/api/popular";

/**
 * 인기글 관련 API 서비스
 */
export const popularService = {
  /**
   * 인기 프로젝트 목록을 조회합니다.
   */
  getPopularProjects: () => {
    return axiosInstance.get<GetPopularProjectsResponse>(
      '/api/v1/meetings/popular/projects'
    );
  },

  /**
   * 인기 스터디 목록을 조회합니다.
   */
  getPopularStudies: () => {
    return axiosInstance.get<GetPopularStudiesResponse>(
      '/api/v1/meetings/popular/studies'
    );
  },

  /**
   * 마감 임박 모임 목록을 조회합니다.
   */
  getPopularExpiring: () => {
    return axiosInstance.get<GetPopularExpiringResponse>(
      '/api/v1/meetings/popular/expiring'
    );
  }
};

/**
 * 목업용 인기글 서비스
 */
export const mockPopularService = {
  getPopularProjects: () => {
    return Promise.resolve({
      data: {
        status: 200,
        code: "SUCCESS_GET_POPULAR_PROJECTS",
        message: "프로젝트 인기글을 성공적으로 불러왔습니다.",
        data: [
          {
            id: 1,
            title: "[프로젝트] 리액트 개발자 모집합니다",
            recruitmentType: "PROJECT",
            maxParticipants: 6,
            duration: "MONTH_3",
            endDate: "2025-12-22",
            techStacks: ["React.js", "SpringBoot"],
            location: "서울 강남구 삼성동 542",
            latitude: 37.5090,
            longitude: 127.0607,
            likeDto: {
              isLiked: false,
              likeCount: 19
            }
          },
          {
            id: 2,
            title: "[프로젝트] Vue.js 프로젝트 팀원 구합니다",
            recruitmentType: "PROJECT",
            maxParticipants: 4,
            duration: "MONTH_3",
            endDate: "2025-12-30",
            techStacks: ["Vue.js", "Node.js"],
            location: "서울 서초구 강남대로 373",
            latitude: 37.4923,
            longitude: 127.0292,
            likeDto: {
              isLiked: false,
              likeCount: 15
            }
          },
          {
            id: 3,
            title: "[프로젝트] 앱 개발자 모집합니다",
            recruitmentType: "PROJECT",
            maxParticipants: 5,
            duration: "MONTH_6",
            endDate: "2026-01-15",
            techStacks: ["Flutter", "Firebase"],
            location: "서울 강남구 테헤란로 152",
            latitude: 37.5037,
            longitude: 127.0430,
            likeDto: {
              isLiked: false,
              likeCount: 12
            }
          }
        ]
      }
    });
  },
  
  getPopularStudies: () => {
    return Promise.resolve({
      data: {
        status: 200,
        code: "SUCCESS_GET_POPULAR_STUDIES",
        message: "스터디 인기글을 성공적으로 불러왔습니다.",
        data: [
          {
            id: 4,
            title: "[스터디] 알고리즘 스터디원 모집",
            recruitmentType: "STUDY",
            maxParticipants: 8,
            duration: "MONTH_3",
            endDate: "2025-12-25",
            techStacks: ["Java", "Python", "JavaScript"],
            location: "서울 강남구 역삼동 824-9",
            latitude: 37.5004,
            longitude: 127.0368,
            likeDto: {
              isLiked: false,
              likeCount: 21
            }
          },
          {
            id: 5,
            title: "[스터디] React/NextJS 스터디",
            recruitmentType: "STUDY",
            maxParticipants: 6,
            duration: "MONTH_3",
            endDate: "2025-12-28",
            techStacks: ["React.js", "Next.js"],
            location: "서울 강남구 테헤란로 427",
            latitude: 37.5063,
            longitude: 127.0547,
            likeDto: {
              isLiked: false,
              likeCount: 18
            }
          },
          {
            id: 6,
            title: "[스터디] 데이터 분석 스터디 모집",
            recruitmentType: "STUDY",
            maxParticipants: 5,
            duration: "MONTH_2",
            endDate: "2025-12-31",
            techStacks: ["Python", "R", "SQL"],
            location: "서울 서초구 서초동 1337-20",
            latitude: 37.4910,
            longitude: 127.0271,
            likeDto: {
              isLiked: false,
              likeCount: 16
            }
          }
        ]
      }
    });
  },
  
  getPopularExpiring: () => {
    return Promise.resolve({
      data: {
        status: 200,
        code: "SUCCESS_GET_POPULAR_EXPIRING",
        message: "마감임박 인기글을 성공적으로 불러왔습니다.",
        data: [
          {
            id: 7,
            title: "[프로젝트] 백엔드 개발자 급구",
            recruitmentType: "PROJECT",
            maxParticipants: 3,
            duration: "MONTH_6",
            endDate: "2025-12-10",
            techStacks: ["Spring Boot", "JPA", "MySQL"],
            location: "서울 강남구 삼성동 159",
            latitude: 37.5140,
            longitude: 127.0565,
            likeDto: {
              isLiked: false,
              likeCount: 14
            }
          },
          {
            id: 8,
            title: "[스터디] DevOps 스터디 모집",
            recruitmentType: "STUDY",
            maxParticipants: 4,
            duration: "MONTH_3",
            endDate: "2025-12-12",
            techStacks: ["Docker", "Kubernetes", "AWS"],
            location: "서울 강남구 역삼동 736-1",
            latitude: 37.5016,
            longitude: 127.0400,
            likeDto: {
              isLiked: false,
              likeCount: 11
            }
          },
          {
            id: 9,
            title: "[프로젝트] 웹 디자이너 구합니다",
            recruitmentType: "PROJECT",
            maxParticipants: 2,
            duration: "MONTH_1",
            endDate: "2025-12-15",
            techStacks: ["Figma", "Adobe XD", "HTML/CSS"],
            location: "서울 서초구 서초중앙로 14",
            latitude: 37.4868,
            longitude: 127.0137,
            likeDto: {
              isLiked: false,
              likeCount: 9
            }
          }
        ]
      }
    });
  }
};