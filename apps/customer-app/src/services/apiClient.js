import { BASE_URL } from '../constants/api';

/**
 * QuickKart Unified HTTP Client with timeout, auth token injection, and friendly error parsing.
 */
class ApiClient {
  constructor() {
    this.token = null;
    this.defaultTimeoutMs = 8000;
  }

  setAuthToken(token) {
    this.token = token;
  }

  clearAuthToken() {
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const { method = 'GET', body, headers = {}, timeout = this.defaultTimeoutMs } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    };

    if (this.token && !requestHeaders.Authorization) {
      requestHeaders.Authorization = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
    };

    if (body && method !== 'GET' && method !== 'HEAD') {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg =
          responseData?.message ||
          responseData?.error ||
          `Request failed with status ${response.status}`;
        const error = new Error(errorMsg);
        error.status = response.status;
        error.details = responseData?.errors || responseData;
        throw error;
      }

      return responseData;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        const timeoutError = new Error(
          `Connection timed out (${timeout / 1000}s). Please verify that the backend server is running and accessible on ${BASE_URL}`
        );
        timeoutError.code = 'TIMEOUT';
        throw timeoutError;
      }

      if (err.message?.includes('Network request failed') || err.message?.includes('Failed to fetch')) {
        const netError = new Error(
          `Unable to reach server at ${BASE_URL}. Please ensure your phone is connected to the same Wi-Fi and backend is running.`
        );
        netError.code = 'NETWORK_ERROR';
        throw netError;
      }

      throw err;
    }
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  patch(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  del(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
