import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const auth = {
    register: (userData) => {
        return api.post('/users/register', userData);
    },
    login: (credentials) => {
        return api.post('/users/login', credentials);
    }
};
export const characters = {
    getAll: () => {
        return api.get('/characters');
    },
    // Get a single character
    getById: (id) => {
        return api.get(`/characters/${id}`);
    },
    // Search characters
    search: (query) => {
        return api.get('/characters/search', { params: { q: query } });
      },
    addToFavorites: (id) => {
        return api.post(`/characters/${id}/favorite`);
    },
    removeFromFavorites: (id) => {
        return api.delete(`/characters/${id}/favorite`);
    },
    
    rateCharacter: (id, data) => {
        return api.post(`/characters/${id}/rate`, data);
    },
    
    getFavorites: () => {
        return api.get('/characters/user/favorites');
    }
    
};

export default { auth, characters };