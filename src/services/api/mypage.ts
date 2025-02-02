import { myDetail, myRecent } from "../../assets/data/mypageData";
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

export const mockMypageService = {
  getMyUser: () => {
    return Promise.resolve({
      "id": 1,
      "profileImage": "string",
      "name": "류지예",
      "nickname": "다라다라",
      "age": 25,
      "phoneNumber": "01012345678",
      "email": "devdaradara@gmail.com",
      "bio": "바이오"
    });
  },

  getMyCreateMeetingRecent: () => {
    return Promise.resolve({
      myRecent
    });
  },

  getMyLikeMeetingRecent: () => {
    return Promise.resolve({
      myRecent
    });
  },

  getMyApplyMeetingRecent: () => {
    return Promise.resolve({
      myRecent
    });
  },

  patchMyUser: (data: UserProfilePatch) => {
    return Promise.resolve({
      "id": 1,
      "profileImage": "string",
      "name": "류지예",
      "nickname": "다라다라",
      "age": 25,
      "phoneNumber": "01012345678",
      "email": "devdaradara@gmail.com",
      "bio": "바이오"
    });
  },

  getMyCreateMeeting: (page: number) => {
    return Promise.resolve({
      myDetail
    });
  },

  getMyLikeMeeting: (page: number) => {
    return Promise.resolve({
      myDetail
    });
  },

  getMyApplyMeeting: (page: number) => {
    return Promise.resolve({
      myDetail
    });
  },
}