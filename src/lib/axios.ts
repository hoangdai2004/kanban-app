import axios from "axios";


const instance = axios.create({
  baseURL: typeof window === 'undefined' ? 'http:/localhost:3000' : '',
  headers: {
    'Content-Type': 'application/json',
  },
});

//Request Interceptor (Chặn và xử lý request khi trước khi nó rời khỏi client)
instance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

//Response Interceptor (Chặn và xử lý response trước khi trả về cho code)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung
    console.error('API Error:', error.response.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;