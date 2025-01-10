export interface ApiResponse<T> {
  status: number;
  code: string;
  data: T;
  message: string;
}

// 추후 토큰 넣고 사용
// export interface ApiRequest<T> {
//   headers: {
//     'Content-Type': 'application/json';
//     Authorization: string;
//   };
//   body: T;
// }