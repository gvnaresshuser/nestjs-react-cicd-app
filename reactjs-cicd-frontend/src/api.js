import axios from 'axios';
import { Toast } from './utils/toast';
//baseURL: 'http://localhost:3000',    
console.log("BACKEND API URL:"+import.meta.env.VITE_API_URL);
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
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
        console.log("STATUS:::" + status);

        //----------------------------------------------
        // 🚨 HANDLE 429 HERE
        if (status === 429) {
            console.log('🚫 Too many requests');

            Toast.fire({
                icon: 'warning',
                title: 'Too many requests [429]. Please wait ⏳',
            });

            return Promise.reject(error);
        }
        //----------------------------------------------

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
            //|| message === 'Token expired'
            //--comment for Refresh Token and get new access token --uncomment for redirect to login
            //IF UNCOMMENTED IT WILL REDIRECT TO LOGIN PAGE, 
            //ELSE IT WILL REFRESH TOKEN - NEW ACCESS TOKEN WILL BE GENERATED
        ) {
            console.log('🚨 Session issue → redirect to login');
            /* window.location.replace('/login');
            return Promise.reject(error); */
            //-------------------------------------
            // ✅ SHOW TOAST
            Toast.fire({
                icon: 'warning',
                title: message || 'Session expired. Please login again',
            });

            // ⏳ Delay redirect so user can see toast
            setTimeout(() => {
                window.location.replace('/login');
            }, 1500);

            return Promise.reject(error);
            //-------------------------------------

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

    
        //-------------------------------------------------
        try {
            console.log('🔄 Access token expired → calling refresh NOW');

            // 🔄 Show refreshing toast (longer duration)
            Toast.fire({
                icon: 'info',
                title: 'Refreshing session...',
                timer: 1500, // 👈 ensures visibility
            });

            await api.post('/auth/refresh');

            // ⏳ Wait for first toast to finish
            setTimeout(() => {
                Toast.fire({
                    icon: 'success',
                    title: 'Session refreshed',
                    timer: 2000,
                });
            }, 1500); // 👈 match first toast duration

            processQueue(null);
            return api(originalRequest);

        } catch (refreshError) {
            console.log('❌ Refresh failed → redirecting to login');

            processQueue(refreshError);

            // ❌ Error toast
            Toast.fire({
                icon: 'error',
                title: 'Session expired. Please login again',
            });

            setTimeout(() => {
                window.location.replace('/login');
            }, 1500);

            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
        //-------------------------------------------------
    }
);

export default api;