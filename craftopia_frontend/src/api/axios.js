import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to ensure trailing slashes and attach token
api.interceptors.request.use(
    (config) => {
        // Add trailing slash to URL if not present
        // This prevents 307 redirects that drop the Authorization header
        if (config.url && !config.url.endsWith('/')) {
            config.url = config.url + '/';
        }
        
        // Attach token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem('token');
            // Optionally redirect to login page
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;