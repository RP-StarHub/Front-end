import { LoginUserRequest, PostUserLogin, PostUserRegister } from "../../types/api/user";
import { axiosInstance } from "./axios"

export const userServices = {
  postLogin: (data: LoginUserRequest) => {
    return axiosInstance.post<PostUserLogin>(
      '/api/user/login',
      data
    );
  },
  postRegister: (form: FormData) => {
    return axiosInstance.post<PostUserRegister>(
      '/api/user/register',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },
  getLogout: (userId: number) => {
    return axiosInstance.get(
      `/api/user/logout`,
      {
        params: { loginId: userId },
      }
    )
  }
}

/**
 * 목업용 서비스 코드
 * @description 실제 API 구현 전 임시로 사용하는 목업 서비스
 */
export const mockUserService = {
  postRegister: async (form: FormData) => {
    const info = JSON.parse(form.get('info') as string);

    // 실제 API 구조 모방
    return {
      data: {
        "status": 201,
        "code": "SUCCESS_CREATE_USER",
        "message": "사용자 회원가입을 성공했습니다.",
        "data": {
          "username": info.username,
          "isProfileComplete": false,
        }
      }
    }
  }
};