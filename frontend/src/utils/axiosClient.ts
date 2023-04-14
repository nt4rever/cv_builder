import { apiAuthEndPoint } from './../apis/auth/index';
import axios, { AxiosResponse } from 'axios';

const axiosServices = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 50000,
});

axiosServices.interceptors.request.use(
    function (config) {
        config.headers['Content-Type'] = 'application/json';
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            config.headers['Authorization'] = `Bearer ${access_token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

axiosServices.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (err) => {
        const originalConfig = err.config;
        if (originalConfig?.url !== apiAuthEndPoint.LOGIN && err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (!refreshToken) {
                        localStorage.removeItem('persist:root');
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('refresh_token');
                        window.location.href = '/home';
                        return;
                    }
                    const baseURL = process.env.REACT_APP_API_URL || 'localhost:3001';
                    const res = await axios.get(baseURL + '/auth/refresh', {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });
                    const { access_token, refresh_token } = res.data;
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);
                    return axiosServices(originalConfig);
                } catch (_error) {
                    localStorage.removeItem('persist:root');
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/home';
                    return Promise.reject(_error);
                }
            }
        }
        return Promise.reject(err);
    },
);

axiosServices.interceptors.request.use(
    function (config) {
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

const axiosUpload = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 50000,
});

axiosUpload.interceptors.request.use(
    function (config) {
        config.headers['Content-Type'] = 'multipart/form-data';
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            config.headers['Authorization'] = `Bearer ${access_token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

export const axiosClientUpload = axiosUpload;

export default axiosServices;
