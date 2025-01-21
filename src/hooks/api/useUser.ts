import { useMutation } from "@tanstack/react-query"
import { LoginUserRequest } from "../../types/api/user"
import { userServices } from "../../services/api/user"

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginUserRequest) =>
      userServices.postLogin(data)
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (form: FormData) =>
      userServices.postRegister(form)
  });
  // return useMutation({
  //   mutationFn: (form: FormData) => mockUserService.postRegister(form)
  // });
}

export const useLogout = () => {
  return useMutation({
    mutationFn: (loginId: number) =>
      userServices.getLogout(loginId)
  });
}

// 목업용 서비스 코드
const mockUserService = {
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
          "isProfileComplete": info.true,
        }
      }
    }
  }
};