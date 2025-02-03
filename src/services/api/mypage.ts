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
      'api/v1/mypage/meetings/created/recent'
    );
  },

  getMyLikeMeetingRecent: () => {
    return axiosInstance.get<GetMyMeetingRecent>(
      'api/v1/mypage/meetings/liked/recent'
    );
  },

  getMyApplyMeetingRecent: () => {
    return axiosInstance.get<GetMyMeetingRecent>(
      'api/v1/mypage/meetings/applied/recent'
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
      'api/v1/mypage/meetings/created',
      {
        params: { page }
      }
    );
  },

  getMyLikeMeeting: (page: number) => {
    return axiosInstance.get<GetMyMeetingDetail>(
      'api/v1/mypage/meetings/liked',
      {
        params: { page }
      }
    );
  },

  getMyApplyMeeting: (page: number) => {
    return axiosInstance.get<GetMyMeetingDetail>(
      'api/v1/mypage/meetings/applied',
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
      "profileImage": "/static/media/profile2.7a0e468ce59adc3ec8f3.png",
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
      status: 200,
      code: "SUCCESS_GET_CREATED_RECENT_MEETINGS",
      message: "내가 작성한 모임 최신 3개를 성공적으로 불러왔습니다.",
      data: myRecent
    });
  },

  getMyLikeMeetingRecent: () => {
    return Promise.resolve({
      status: 200,
      code: "SUCCESS_GET_CREATED_RECENT_MEETINGS",
      message: "내가 작성한 모임 최신 3개를 성공적으로 불러왔습니다.",
      data: myRecent
    });
  },

  getMyApplyMeetingRecent: () => {
    return Promise.resolve({
      status: 200,
      code: "SUCCESS_GET_CREATED_RECENT_MEETINGS",
      message: "내가 작성한 모임 최신 3개를 성공적으로 불러왔습니다.",
      data: myRecent
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
      status: 200,
      code: "SUCCESS_GET_LIKED_MEETINGS",
      message: "내가 관심 있는 모임 목록을 성공적으로 불러왔습니다.",
      data: myDetail
    });
  },

  getMyLikeMeeting: (page: number) => {
    return Promise.resolve({
      status: 200,
      code: "SUCCESS_GET_LIKED_MEETINGS",
      message: "내가 관심 있는 모임 목록을 성공적으로 불러왔습니다.",
      data: myDetail
    });
  },

  getMyApplyMeeting: (page: number) => {
    return Promise.resolve({
      status: 200,
      code: "SUCCESS_GET_LIKED_MEETINGS",
      message: "내가 관심 있는 모임 목록을 성공적으로 불러왔습니다.",
      data: myDetail
    });
  },
}