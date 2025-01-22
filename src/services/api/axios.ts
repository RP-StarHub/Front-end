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

// 토큰 재발급 상태 관리
let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// 요청 인터셉터
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
  async (error) => {
    const originalRequest = error.config;
    
    // BAD_CREDENTIALS는 로그인 실패이므로 별도 처리
    if (error.response?.status === 401 && 
        error.response.data.code === 'BAD_CREDENTIALS') {
      return Promise.reject(error);
    }

    // 토큰 만료로 인한 401 에러 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 재발급 진행 중인 경우 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { userServices } = await import('./user');
        const response = await userServices.postTokenReissue();
        const newToken = getTokensFromResponse(response);
        
        useAuthStore.getState().setAccessToken(newToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        processQueue();
        isRefreshing = false;
        
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError);
        isRefreshing = false;
        
        // refresh token도 만료된 경우 로그아웃
        useAuthStore.getState().logout();
        toast.error('인증이 만료되었습니다. 다시 로그인해주세요.', {
          duration: 3000,
          position: 'top-center'
        });
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // 404 에러 처리
    if (error.response?.status === 404 && 
        error.response.data.code === 'USER_NOT_FOUND') {
      toast.error('유저 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const getTokensFromResponse = (response: any) => {
  const authHeader = response.headers.Authorization || response.headers.authorization;
  const accessToken = authHeader?.replace('Bearer ', '') || '';
  return accessToken;
};