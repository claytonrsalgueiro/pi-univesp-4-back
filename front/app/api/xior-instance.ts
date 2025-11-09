// app/api/xior-instance.ts
import xior from 'xior';
import { getSession as getSessionToken } from '@/app/lib/session';

const isServer = () => typeof window === 'undefined';

const xiorInstance = xior.create({
    baseURL: process.env.API_URL, // ex.: http://localhost:8080/api
    cache: 'no-store',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
});

xiorInstance.interceptors.request.use(
    async (config) => {
        if (isServer()) {
            const username = process.env.BASIC_USER || 'admin';
            const password = process.env.BASIC_PASS || '123456';
            const basic = Buffer.from(`${username}:${password}`).toString('base64');
            config.headers = { ...(config.headers || {}), Authorization: `Basic ${basic}` };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

xiorInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        return Promise.reject({
            error: error.response?.data?.message || error.message,
            status: error.response?.status,
        });
    }
);

export default xiorInstance;
