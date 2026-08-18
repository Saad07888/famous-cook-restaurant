import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export const menuService = {
    getMenu: async () => {
        const response = await api.get('/menu');
        return response.data;
    },

    createItem: async (item) => {
        const response = await api.post('/menu', item);
        return response.data;
    },

    updateItem: async (id, item) => {
        const response = await api.put(`/menu/${id}`, item);
        return response.data;
    },

    deleteItem: async (id) => {
        const response = await api.delete(`/menu/${id}`);
        return response.data;
    },
};

export const orderService = {
    createOrder: async (order) => {
        const response = await api.post('/orders', order);
        return response.data;
    },
    getOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    },
};

export default api;
