import { useMutation } from "@tanstack/react-query"
import { LoginUserRequest } from "../../types/api/user"
import { userServices, mockUserService } from "../../services/api/user"

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