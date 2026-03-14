import api from './axios.js';

class AuthApi {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    }

    async logout() {
        const response = await api.post('/auth/logout');
        return response.data;
    }

    async me() {
        const response = await api.get('/auth/me');
        return response.data;
    }
}

let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve()
    );
    failedQueue = [];
};


api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const original = error.config;

        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        const skipUrls = ['/auth/refresh', '/auth/login'];
        if (skipUrls.some(url => original.url?.includes(url))) {
            return Promise.reject(error);
        }

        original._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => api(original))
                .catch(err => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            await api.post(
                '/auth/refresh',
                {},
                { withCredentials: true }
            );
            processQueue(null);
            return api(original);
        } catch (refreshError) {
            processQueue(refreshError);

            window.dispatchEvent(new CustomEvent('auth:logout'));

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);


export const authApi = new AuthApi();