import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true // CORS 요청에 쿠키 포함
});

// 요청 인터셉터: 인증 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;




// // import { config } from 'dotenv';
// //config();
// import axios from "axios";

// // API 기본 URL 설정
// const API_URL = import.meta.env.VITE_API_URL as string;

// // Axios 인스턴스 생성
// const axiosInstance = axios.create({
//   baseURL: API_URL,
// });

// // 요청 인터셉터: 인증 토큰 추가
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


// // 파일에서 axios 사용하실 때 아래 import문 넣으시고 사용하시면 됩니다.
// // import axiosInstance from './axios/ProjectAxios';