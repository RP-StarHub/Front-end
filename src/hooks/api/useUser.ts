import { useMutation } from "@tanstack/react-query"
import { 
  LoginUserRequest,
  RegisterUserRequest,
  CreateProfileRequest,
  CheckUsernameRequest 
} from "../../types/api/user";
import { userServices, mockUserService } from "../../services/api/user"
import { toast } from "react-hot-toast";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterUserRequest) =>
      userServices.postRegister(data),
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.error('잘못된 입력입니다.');
      } else {
        toast.error('회원가입 중 오류가 발생했습니다.');
      }
    }
  });
  // return useMutation({
  //   mutationFn: (form: FormData) => mockUserService.postRegister(form)
  // });
};

export const useCheckUsername = () => {
  return useMutation({
    mutationFn: (data: CheckUsernameRequest) =>
      userServices.postCheckUsername(data),
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.error('유효하지 않은 사용자명입니다.');
      }
    }
  });
};

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: (data: CreateProfileRequest) =>
      userServices.postCreateProfile(data),
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error('로그인이 필요합니다.');
      } else if (error?.response?.status === 409) {
        toast.error('이미 프로필이 존재합니다.');
      } else {
        toast.error('프로필 생성 중 오류가 발생했습니다.');
      }
    }
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginUserRequest) =>
      userServices.postLogin(data)
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => userServices.postLogout()
  });
};

export const useTokenReissue = () => {
  return useMutation({
    mutationFn: () => userServices.postTokenReissue()
  });
};