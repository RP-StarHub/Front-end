import { useMutation } from "@tanstack/react-query"
import { 
  LoginUserRequest,
  RegisterUserRequest,
  CreateProfileRequest,
  CheckUsernameRequest 
} from "../../types/api/user";
import { userServices, mockUserService } from "../../services/api/user"

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterUserRequest) =>
      userServices.postRegister(data)
  });
  // return useMutation({
  //   mutationFn: (form: FormData) => mockUserService.postRegister(form)
  // });
};

export const useCheckUsername = () => {
  return useMutation({
    mutationFn: (data: CheckUsernameRequest) =>
      userServices.postCheckUsername(data)
  });
};

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: (data: CreateProfileRequest) =>
      userServices.postCreateProfile(data)
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