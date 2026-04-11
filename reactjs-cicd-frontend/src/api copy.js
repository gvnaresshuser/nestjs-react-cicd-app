import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // ❌ Not auth error → just reject
        if (status !== 401) {
            return Promise.reject(error);
        }

        console.log('❌ 401 Error:', message);

        // 🚨 CASE 1: Idle timeout / invalid token → direct logout
        if (
            message === 'Session expired due to inactivity' ||
            message === 'Invalid token' ||
            message === 'No token provided'
        ) {
            console.log('🚨 Session issue → redirect to login');
            window.location.replace('/login');
            return Promise.reject(error);
        }

        // 🚨 Prevent infinite loop
        if (originalRequest._retry) {
            console.log('❌ Already retried → redirecting');
            window.location.replace('/login');
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // 🔄 Queue requests if refresh in progress
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: () => resolve(api(originalRequest)),
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            console.log('🔄 Access token expired → calling refresh');
            await api.post('/auth/refresh');
            console.log('✅ Token refreshed');
            processQueue(null);
            return api(originalRequest);
        } catch (refreshError) {
            console.log('❌ Refresh failed → redirecting to login');
            processQueue(refreshError);
            window.location.replace('/login');
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;