import axios from 'axios';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            return Promise.reject(new Error('Request timeout. Please check your connection.'));
        }

        if (!error.response) {
            console.error('Network error:', error);
            return Promise.reject(new Error('Network error. Please check your internet connection.'));
        }

        return Promise.reject(error);
    }
);

export const matchesApi = {
    // Get all matches with pagination
    getAll: async(page = 1, limit = 50) => {
        try {
            const response = await api.get(`/matches?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single match
    getOne: async(id) => {
        try {
            const response = await api.get(`/matches/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Save a match
    save: async(matchData) => {
        try {
            const response = await api.post('/matches', matchData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Bulk save matches (for syncing)
    saveBulk: async(matches) => {
        try {
            const response = await api.post('/matches/bulk', matches);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete a match
    delete: async(id) => {
        try {
            const response = await api.delete(`/matches/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default api;