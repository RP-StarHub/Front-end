// 현재는 응답이 다양하게 오는 상태라 추후 옵셔널 타입 변경 필요
export interface ApiResponse<T> {
  status?: number;
  code?: string;
  data: T;
  message?: string;
}

// 추후 토큰 넣고 사용
// export interface ApiRequest<T> {
//   headers: {
//     'Content-Type': 'application/json';
//     Authorization: string;
//   };
//   body: T;
// }