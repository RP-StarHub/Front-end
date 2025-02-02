import { 
  GetMyMeetingDetail,
  GetMyMeetingRecent,
  GetMyUser, 
  UserProfilePatch 
} from "../../types/api/mypage"
import { axiosInstance } from "./axios"


export const mypageService = {
  getMyUser: () => {
    return axiosInstance.get<GetMyUser>(
      'api/v1/mypage/users'
    );
  },

  getMyCreateMeetingRecent: () => {
    return axiosInstance.get<GetMyMeetingRecent>(
      'api/v1/mypage/meeting/created/recent'
    );
  },

  getMyLikeMeetingRecent: () => {
    return axiosInstance.get<GetMyMeetingRecent>(
      'api/v1/mypage/meeting/liked/recent'
    );
  },

  getMyApplyMeetingRecent: () => {
    return axiosInstance.get<GetMyMeetingRecent>(
      'api/v1/mypage/meeting/applied/recent'
    );
  },

  patchMyUser: (data: UserProfilePatch) => {
    return axiosInstance.patch<GetMyUser>(
      'api/v1/mypage/users',
      data
    );
  },

  getMyCreateMeeting: (page: number) => {
    return axiosInstance.get<GetMyMeetingDetail>(
      'api/v1/mypage/meeting/created',
      {
        params: { page }
      }
    );
  },

  getMyLikeMeeting: (page: number) => {
    return axiosInstance.get<GetMyMeetingDetail>(
      'api/v1/mypage/meeting/liked',
      {
        params: { page }
      }
    );
  },

  getMyApplyMeeting: (page: number) => {
    return axiosInstance.get<GetMyMeetingDetail>(
      'api/v1/mypage/meeting/applied',
      {
        params: { page }
      }
    );
  },
}