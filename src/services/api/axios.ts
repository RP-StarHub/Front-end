import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`,
  },
  timeout: 5000,
});

// 공통 에러 처리
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 404) {
      console.error('요청하신 페이지를 찾을 수 없습니다.');
    }
    if (error.response?.status === 500) {
      console.error('서버 에러가 발생했습니다.');
    }
    return Promise.reject(error);
  }
);
