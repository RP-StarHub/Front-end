import { GetMeetingListResponse } from "../../types/api/meeting";
import { axiosInstance } from "./axios"
import { mainData } from "../../assets/data/mainData";

export const meetingService = {
  getMeetingList: (page: number) => {
    return axiosInstance.get<GetMeetingListResponse>(
      '/api/v1/meetings',
      {
        params: { page }
      }
    );
  }
};

/**
 * 목업용 서비스 코드
 * @description 실제 API 구현 전 임시로 사용하는 목업 서비스
 */
export const mockMeetingService = {
  getMeetingList: (page: number) => {
    return Promise.resolve({
      data: mainData
    });
  }
};