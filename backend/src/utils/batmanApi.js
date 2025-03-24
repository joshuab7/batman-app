const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = 'https://api.batmanapi.com/v1';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
const batmanApi = {
    async getCharacters() {
        try {
            const response = await apiClient.get('/characters');
            return response.data;
        } catch (error) {
        console.error('Error fetching characters:', error.response ? error.response.data : error.message);
        throw error;
    }
},
async getCharacterById(id) {
    try {
        const response = await apiClient.get(`/characters/${id}`);
        return response.data;
        } catch (error) {
        console.error(`Error fetching character ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
},
async getCharacterRelationships(id) {
    try {
        const response = await apiClient.get(`/characters/${id}/relationships`);
        return response.data;
        } catch (error) {
        console.error(`Error fetching relationships for character ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
},
async getLocations(params = {}) {
    try {
        const response = await apiClient.get('/locations', { params });
        return response.data;
        } catch (error) {
        console.error('Error fetching locations:', error.response ? error.response.data : error.message);
        throw error;
    }
},
async getLocationById(id) {
    try {
        const response = await apiClient.get(`/locations/${id}`);
        return response.data;
        } catch (error) {
        console.error(`Error fetching location ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
},
async getStorylines(params = {}) {
    try {
        const response = await apiClient.get('/storylines', { params });
        return response.data;
        } catch (error) {
        console.error('Error fetching storylines:', error.response ? error.response.data : error.message);
        throw error;
        }
},
async getStorylineById(id) {
    try {
        const response = await apiClient.get(`/storylines/${id}`);
        return response.data;
        } catch (error) {
        console.error(`Error fetching storyline ${id}:`, error.response ? error.response.data : error.message);
        throw error;
        }
},
async search(query, params = {}) {
    try {
        const response = await apiClient.get('/search', { 
            params: { 
            q: query,
            ...params
            } 
        });
        return response.data;
        } catch (error) {
        console.error(`Error searching for "${query}":`, error.response ? error.response.data : error.message);
        throw error;
        }
    }
};

module.exports = batmanApi;