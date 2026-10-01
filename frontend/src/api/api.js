import axios from 'axios';

// Base URL defaults to '/api' (proxied by Vite to FastAPI http://127.0.0.1:8000)
// or can be overridden via VITE_API_BASE_URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for RAG processing
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('documind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and parse clean error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401 Unauthorized handling
      if (error.response.status === 401) {
        const isAuthRequest =
          error.config.url.includes('/login') ||
          error.config.url.includes('/register');

        if (!isAuthRequest) {
          localStorage.removeItem('documind_token');
          localStorage.removeItem('documind_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?session_expired=true';
          }
        }
      }

      // Extract meaningful error message
      let message = 'An error occurred';
      const data = error.response.data;

      if (typeof data?.detail === 'string') {
        message = data.detail;
      } else if (Array.isArray(data?.detail)) {
        // FastAPI / Pydantic validation errors
        message = data.detail
          .map((err) => `${err.loc?.[err.loc?.length - 1] || 'field'}: ${err.msg}`)
          .join(', ');
      } else if (data?.message) {
        message = data.message;
      } else if (error.message) {
        message = error.message;
      }

      const enhancedError = new Error(message);
      enhancedError.status = error.response.status;
      enhancedError.originalError = error;
      return Promise.reject(enhancedError);
    }

    if (error.request) {
      const enhancedError = new Error(
        'Unable to connect to DocuMind backend server. Please verify the backend is running.'
      );
      enhancedError.status = 0;
      return Promise.reject(enhancedError);
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: async ({ email, password }) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  register: async ({ name, email, password }) => {
    const response = await api.post('/register', { name, email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
};

// Document API endpoints (aligned with FastAPI backend routes)
export const documentsAPI = {
  upload: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/documents');
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/document/${id}`);
    return response.data;
  },
};

// Chat API endpoints
export const chatAPI = {
  send: async ({ document_id, question }) => {
    const response = await api.post('/chat', {
      document_id: Number(document_id),
      question,
    });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },
};

// Health Check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
