import axios from 'axios';

// During development, Vite proxy handles the base URL. In prod, it's relative.
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercept requests to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('notifyhub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('notifyhub_token');
      // Optionally dispatch an event or redirect to login here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
