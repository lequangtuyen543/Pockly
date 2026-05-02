import axios from 'axios';

// Cấu hình Base URL từ biến môi trường hoặc mặc định localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động gắn Token vào Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý phản hồi và lỗi tập trung
api.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp phần data theo chuẩn { code, message, data } của Backend
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
      if (response.status === 401) {
        localStorage.removeItem('token');
        // Có thể redirect về trang login hoặc thông báo
        // window.location.href = '/login';
      }

      // Xử lý lỗi 403 (Forbidden) - Không có quyền truy cập
      if (response.status === 403) {
        console.error('Bạn không có quyền thực hiện hành động này.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
