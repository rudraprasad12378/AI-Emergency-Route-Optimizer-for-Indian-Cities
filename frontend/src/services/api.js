// Base API client configured for frontend-only mock environment with graceful transition to live backend

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = {
  get: async (endpoint, params = {}) => {
    // Return mock responses safely
    return { data: null, status: 200 };
  },
  post: async (endpoint, data = {}) => {
    return { data, status: 201 };
  },
  put: async (endpoint, data = {}) => {
    return { data, status: 200 };
  },
  delete: async (endpoint) => {
    return { status: 204 };
  },
};

export default apiClient;
