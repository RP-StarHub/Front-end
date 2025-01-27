import {
  GetApplicationListResponse,
  PostApplicationRequest,
  PostApplicationResponse,
  GetApplicationMeResponse,
  PatchApplicationResponse
} from "../../types/api/application";
import { axiosInstance } from "./axios";

export const applicationService = {
  postApplication: (meetingId: number, data: PostApplicationRequest) => {
    return axiosInstance.post<PostApplicationResponse>(
      `/api/v1/meetings/${meetingId}/applications`,
      data
    );
  },

  getApplicationList: (meetingId: number) => {
    return axiosInstance.get<GetApplicationListResponse>(
      `/api/v1/meetings/${meetingId}/applications`
    );
  },

  getApplicationMe: (meetingId: number) => {
    return axiosInstance.get<GetApplicationMeResponse>(
      `/api/v1/meetings/${meetingId}/applications/me`
    );
  },

  patchApplication: (meetingId: number, data: PostApplicationRequest) => {
    return axiosInstance.patch<PatchApplicationResponse>(
      `/api/v1/meetings/${meetingId}/applications/me`,
      data
    );
  },

  deleteApplication: (meetingId: number) => {
    return axiosInstance.delete<void>(
      `/api/v1/meetings/${meetingId}/applications/me`
    );
  },
};

export const mockApplicationService = {
  postApplication: (meetingId: number, data: PostApplicationRequest) => {
    return Promise.resolve({
      data: {
        "status": 201,
        "code": "SUCCESS_CREATE_APPLICANT",
        "message": "지원서가 성공적으로 생성되었습니다.",
        "data": {
          "id": 5,
          "content": "지원합니당~!",
          "updatedAt": "2025-01-25T23:49:44.437398",
          "applicant": {
            "nickname": "다라다라다라다라다라다라"
          }
        }
      }
    });
  },

  getApplicationList: (meetingId: number) => {
    return Promise.resolve({
      data: {
        "status": 200,
        "code": "SUCCESS_GET_APPLICANT_LIST",
        "message": "지원서 목록을 성공적으로 불러왔습니다.",
        "data": [
          {
            "id": 1,
            "content": "지원합니당~",
            "updatedAt": "2025-01-25T23:38:13.148332",
            "applicant": {
              "nickname": "다라다라"
            }
          },
          {
            "id": 2,
            "content": "지원합니당~!",
            "updatedAt": "2025-01-25T23:44:30.494975",
            "applicant": {
              "nickname": "다라다라다라"
            }
          },
          {
            "id": 3,
            "content": "지원합니당~!",
            "updatedAt": "2025-01-25T23:44:57.1142",
            "applicant": {
              "nickname": "다라다라다라다라"
            }
          },
        ]
      }
    });
  },

  getApplicationMe: (meetingId: number) => {
    return Promise.resolve({
      data: {
        "status": 200,
        "code": "SUCCESS_GET_APPLICANT_DETAIL",
        "message": "지원서 상세 정보를 성공적으로 불러왔습니다.",
        "data": {
          "id": 1,
          "content": "지원합니당~",
          "updatedAt": "2025-01-25T23:38:13.148332",
          "applicant": {
            "nickname": "다라다라"
          }
        }
      }
    });
  },

  patchApplication: (meetingId: number, data: PostApplicationRequest) => {
    return Promise.resolve({
      data: {
        "status": 200,
        "code": "SUCCESS_UPDATE_APPLICANT",
        "message": "지원서가 성공적으로 수정되었습니다.",
        "data": {
          "id": 1,
          "content": "지원합니당~!",
          "updatedAt": "2025-01-25T23:49:44.437398",
          "applicant": {
            "nickname": "다라다라다라다라다라다라"
          }
        }
      }
    });
  },

  deleteApplication: (meetingId: number) => {
    return Promise.resolve({
      data: {
        "status": 200,
        "code": "SUCCESS_DELETE_APPLICANT",
        "message": "지원서가 성공적으로 삭제되었습니다.",
        "data": null
      }
    });
  },
};