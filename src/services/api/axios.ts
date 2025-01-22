import axios from 'axios';
import { useAuthStore } from '../../store';
import { toast } from 'react-hot-toast';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // refresh 토큰은 자동으로 쿠키에서 처리, 헤더에 추가 X
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 공통 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 로그인은 따로 처리
          if (error.response.data.code !== 'BAD_CREDENTIALS') {
            toast.error('인증이 만료되었습니다. 다시 로그인해주세요.', {
              duration: 3000,
              position: 'top-center'
            });
            window.location.href = '/login';
          }
          break;

        case 404:
          if (error.response.data.code === 'USER_NOT_FOUND') {
            toast.error('유저 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
          }
          break;
      }
    }
    return Promise.reject(error);
  }
);

// 로그인 응답에서 토큰을 처리하는 함수
export const getTokensFromResponse = (response: any) => {
  const authHeader = response.headers.Authorization || response.headers.authorization;
  const accessToken = authHeader?.replace('Bearer ', '') || '';
  return accessToken;
};