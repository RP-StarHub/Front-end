import { 
  LoginUserRequest, 
  RegisterUserRequest,
  PostUserLogout,
  CreateProfileRequest,
  CheckUsernameRequest,
  PostTokenReissue
} from "../../types/api/user";
import { axiosInstance } from "./axios"

export const userServices = {
  // 회원가입
  postRegister: (data: RegisterUserRequest) => {
    return axiosInstance.post<RegisterUserRequest>(
      '/api/v1/register',
      data
    );
  },

  // 사용자 이름 중복 확인
  postCheckUsername: (data: CheckUsernameRequest) => {
    return axiosInstance.post<CheckUsernameRequest>(
      '/api/v1/users/check',
      data
    );
  },

  // 프로필 생성
  postCreateProfile: (data: CreateProfileRequest) => {
    return axiosInstance.post<CreateProfileRequest>(
      '/api/v1/users/profile',
      data
    );
  },

  // 로그인
  postLogin: (data: LoginUserRequest) => {
    return axiosInstance.post<LoginUserRequest>(
      '/api/v1/login',
      data
    );
  },

  // 로그아웃
  postLogout: () => {
    return axiosInstance.post<PostUserLogout>(
      '/api/v1/logout'
    );
  },

  // 토큰 재발급
  postTokenReissue: () => {
    return axiosInstance.post<PostTokenReissue>(
      '/api/v1/reissue'
    );
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