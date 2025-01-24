import axios from 'axios';

const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// get csrftoken from cookie
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

// Create axios instance with default configs
const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include CSRF token
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getCookie('csrftoken');
    config.headers['X-CSRFToken'] = token;
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

export {
  apiClient,
  baseUrl,
  getCookie
}