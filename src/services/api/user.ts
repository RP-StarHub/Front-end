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
  getLogout: (loginId: number) => {
    return axiosInstance.get(
      `/api/user/logout/`,
      {
        params: { loginId },
      }
    )
  }
}