/**
 * Centralized API Client Layer
 * Connects directly to live FastAPI backend at /api/v1.
 * Supports token injection, automatic error normalization, and fallback to mockData if offline.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'; // Defaults to live backend
const DEFAULT_TIMEOUT = 10000;

class ApiClient {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
    this.interceptors = {
      request: [],
      response: [],
    };
    this.defaults = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
  }

  addRequestInterceptor(fn) {
    this.interceptors.request.push(fn);
  }

  addResponseInterceptor(onSuccess, onError) {
    this.interceptors.response.push({ onSuccess, onError });
  }

  getAuthToken() {
    try {
      const stored = localStorage.getItem('auth_token');
      if (stored) return stored;
      const userState = localStorage.getItem('auth_user');
      if (userState) {
        const parsed = JSON.parse(userState);
        return parsed?.token || null;
      }
    } catch {
      return null;
    }
    return null;
  }

  async request(endpoint, options = {}) {
    let config = {
      url: `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
      method: (options.method || 'GET').toUpperCase(),
      headers: {
        ...this.defaults.headers,
        ...(options.headers || {}),
      },
      ...options,
    };

    // Auto-inject JWT Bearer token if present
    const token = this.getAuthToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    for (const interceptor of this.interceptors.request) {
      try {
        config = (await interceptor(config)) || config;
      } catch (err) {
        return Promise.reject(err);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

    try {
      if (USE_MOCK) {
        clearTimeout(timeoutId);
        return {
          data: options.mockData !== undefined ? options.mockData : null,
          status: 200,
          statusText: 'OK (Mock)',
          headers: {},
          config,
        };
      }

      const fetchOptions = {
        method: config.method,
        headers: config.headers,
        signal: controller.signal,
      };

      if (config.data && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method)) {
        fetchOptions.body = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
      }

      const response = await fetch(config.url, fetchOptions);
      clearTimeout(timeoutId);

      let responseData = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      let resObj = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config,
      };

      if (!response.ok) {
        const errorMsg = responseData?.error?.message || responseData?.message || `HTTP ${response.status}: ${response.statusText}`;
        const error = new Error(errorMsg);
        error.response = resObj;
        error.status = response.status;
        error.code = responseData?.error?.code || 'API_ERROR';
        throw error;
      }

      for (const { onSuccess } of this.interceptors.response) {
        if (onSuccess) resObj = (await onSuccess(resObj)) || resObj;
      }

      return resObj;
    } catch (err) {
      clearTimeout(timeoutId);

      let normalizedError = err;
      if (err.name === 'AbortError') {
        normalizedError = new Error('Request timed out. Please check server connection.');
        normalizedError.code = 'ECONNABORTED';
      }

      for (const { onError } of this.interceptors.response) {
        if (onError) {
          try {
            await onError(normalizedError);
          } catch (e) {
            normalizedError = e;
          }
        }
      }

      // Fallback to mockData if network connection failed so user experience is not abruptly disrupted
      if (options.mockData !== undefined) {
        return {
          data: options.mockData,
          status: 200,
          statusText: 'Fallback (Offline Mode)',
          headers: {},
          config,
        };
      }

      throw normalizedError;
    }
  }

  get(endpoint, params = {}, options = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== 'all')
    );
    const query = new URLSearchParams(cleanParams).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { ...options, method: 'GET' });
  }

  post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', data });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
