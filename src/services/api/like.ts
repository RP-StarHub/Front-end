import { axiosInstance } from "./axios"

export const likeServices = {
  postLikes: (meetingId: number) => {
    return axiosInstance.post<void>(
      `/api/v1/meetings/${meetingId}/likes`
    )
  },

  deleteLikes: (meetingId: number) => {
    return axiosInstance.delete<void>(
      `/api/v1/meetings/${meetingId}/likes`
    )
  }
}