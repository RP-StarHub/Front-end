import { axiosInstance } from "./axios"

export const likeServices = {
  postLikes: (meetingId: number) => {
    return axiosInstance.post(
      `/api/v1/meetings/${meetingId}/likes`
    )
  },

  deleteLikes: (meetingId: number) => {
    return axiosInstance.delete(
      `/api/v1/meetings/${meetingId}/likes`
    )
  }
}