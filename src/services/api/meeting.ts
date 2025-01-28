import {
  CreateMeetingRequest,
  CreateMeetingResponse,
  GetMeetingDetailResponse,
  GetMeetingListResponse,
  PatchMeetingRequest,
  PatchMeetingResponse,
} from "../../types/api/meeting";
import { axiosInstance } from "./axios"
import { mainData, mockDetailData } from "../../assets/data/mainData";

export const meetingService = {
  createMeeting: (data: CreateMeetingRequest) => {
    return axiosInstance.post<CreateMeetingResponse>(
      '/api/v1/meetings',
      data
    );
  },

  getMeetingList: (page: number) => {
    return axiosInstance.get<GetMeetingListResponse>(
      '/api/v1/meetings',
      {
        params: { page }
      }
    );
  },

  getMeetingDetail: (id: number) => {
    return axiosInstance.get<GetMeetingDetailResponse>(
      `/api/v1/meetings/${id}`
    );
  },

  patchMeeting: (id: number, data: PatchMeetingRequest) => {
    return axiosInstance.patch<PatchMeetingResponse>(
      `/api/v1/meetings/${id}`,
      data
    );
  },

  deleteMeeting: (id: number) => {
    return axiosInstance.delete<void>(
      `/api/v1/meetings/${id}`
    );
  }
};

/**
 * 목업용 서비스 코드
 * @description 실제 API 구현 전 임시로 사용하는 목업 서비스
 */
export const mockMeetingService = {
  createMeeting: (data: CreateMeetingRequest) => {
    return Promise.resolve({
      data: {
        "status": 201,
        "code": "SUCCESS_CREATE_MEETING",
        "message": "모임이 성공적으로 생성되었습니다.",
        "data": {
          "id": 12,
          "recruitmentType": "STUDY",
          "maxParticipants": 3,
          "duration": "ONE_WEEK",
          "endDate": "2025-01-31",
          "location": "서울 노원구 동일로205길 21-2(중계동, 가로판매대)",
          "latitude": 37.6406487295482,
          "longitude": 127.064624332673,
          "title": "제목",
          "description": "내용",
          "goal": "목표",
          "otherInfo": "기타정보",
          "isConfirmed": false,
          "creator": {
            "nickname": "다라다라"
          },
          "techStacks": [
            "React",
            "Vue",
            "HTML/CSS",
            "Spring",
            "Docker"
          ]
        }
      }
    });
  },

  getMeetingList: (page: number) => {
    return Promise.resolve({
      data: mainData
    });
  },

  getMeetingDetail: (id: number) => {
    return Promise.resolve({
      data: mockDetailData
    });
  },

  patchMeeting: (id: number, data: PatchMeetingRequest) => {
    return Promise.resolve({
      data: {
        status: 200,
        code: "SUCCESS_UPDATE_MEETING",
        message: "모임이 성공적으로 수정되었습니다.",
        data: {
          ...mockDetailData,
          ...data
        }
      }
    });
  },

  deleteMeeting: (id: number) => {
    return Promise.resolve({
      data: {
        status: 200,
        code: "SUCCESS_DELETE_MEETING",
        message: "모임이 성공적으로 삭제되었습니다.",
        data: null
      }
    });
  }
};