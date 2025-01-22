import axios from 'axios';
import { useAuthStore } from '../../store';

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

// 로그인 응답에서 토큰을 처리하는 함수
export const getTokensFromResponse = (response: any) => {
  const accessToken = response.headers.authorization?.replace('Bearer ', '') || '';
  return accessToken;
};