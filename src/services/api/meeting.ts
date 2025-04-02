import {
  CreateMeetingRequest,
  CreateMeetingResponse,
  GetMeetingDetailResponse,
  GetMeetingListResponse,
  GetMeetingMemberResponse,
  PatchMeetingMemberResponse,
  PatchMeetingRequest,
  PatchMeetingResponse,
  PatchMemberRequest,
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
  
  // API 명세에 맞게 검색 API 구현
  searchMeetings: (params: Record<string, any>, body: any) => {
    // API 요구사항에 맞게 body와 params 구성
    const queryParams: Record<string, any> = {};
    
    // 페이지네이션 파라미터
    if (params.page !== undefined) {
      queryParams.page = params.page;
    }
    
    if (params.size !== undefined) {
      queryParams.size = params.size;
    } else {
      queryParams.size = 4; // 기본값으로 4개 설정
    }
    
    // 검색어
    if (params.title) {
      queryParams.title = params.title;
    }
    
    // 좌표 검색 범위 - 필수 파라미터로 추가
    if (params.c) {
      queryParams.c = params.c;
    }
    
    // body는 필터링 조건만 포함하도록 정리
    // 사용자가 선택한 조건만 전송 (null, undefined, 빈 배열 제거)
    const cleanBody: Record<string, any> = {};
    
    if (body.minParticipants) {
      cleanBody.minParticipants = body.minParticipants;
    }
    
    if (body.maxParticipants) {
      cleanBody.maxParticipants = body.maxParticipants;
    }
    
    if (body.techStacks && body.techStacks.length > 0) {
      cleanBody.techStacks = body.techStacks;
    }
    
    if (body.location) {
      cleanBody.location = body.location;
    }
    
    if (body.duration) {
      cleanBody.duration = body.duration;
    }
    
    return axiosInstance.post<GetMeetingListResponse>(
      '/api/v1/meetings/search',
      Object.keys(cleanBody).length > 0 ? cleanBody : {},
      { params: queryParams }
    );
  },
  
  // 기본 목록 조회 메서드도 searchMeetings 활용
  getMeetingList: (page: number, coordinates?: string) => {
    return axiosInstance.post<GetMeetingListResponse>(
      '/api/v1/meetings/search',
      {}, // 빈 body
      {
        params: { 
          page: page,
          size: 4, // 페이지당 4개 항목으로 변경
          // 좌표 정보 필수 추가
          c: coordinates || '37.5,37.7,126.9,127.1' // 서울 기본 좌표 범위 설정
        }
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
  },

  patchMeetingMember: (id: number, data: PatchMemberRequest) => {
    return axiosInstance.patch<PatchMeetingMemberResponse>(
      `/api/v1/meetings/${id}/confirm`,
      data
    )
  },
  
  getMeetingMember: (id: number) => {
    return axiosInstance.get<GetMeetingMemberResponse>(
      `/api/v1/meetings/${id}/confirmed`
    )
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
  
  searchMeetings: (params: Record<string, any>, body: any) => {
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
  },
  
  patchMeetingMember: (id: number, data: PatchMemberRequest) => {
    return Promise.resolve({
      data: {
        status: 200,
        code: "SUCCESS_CONFIRM_MEMBERS",
        message: "스터디원이 확정되었습니다.",
        data: null
      }
    });
  },
  
  getMeetingMember: (id: number) => {
    return Promise.resolve({
      data: {
        status: 200,
        code: "SUCCESS_GET_CONFIRMED_MEMBERS",
        message: "확정된 스터디원 목록을 불러왔습니다.",
        data: []
      }
    });
  }
};