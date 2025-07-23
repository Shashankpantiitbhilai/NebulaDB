// utils.js

import axios from 'axios';
import config from '../config/config.js';

// Create an instance of axios with custom configuration
const axiosInstance = axios.create({
    baseURL: config.backend.current,
    timeout: 60000, // 60 second timeout for database creation
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('🔗 Utils service connecting to backend:', config.backend.current);

// Function to create a project
export const createProject = async (projectName, username, password) => {
    try {
        const response = await axiosInstance.post('/create-project', { 
            projectName, 
            username, 
            password 
        });
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        
        if (error.response) {
            // Server responded with error status
            throw new Error(error.response.data.error || 'Failed to create project');
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('No response from server. Please check if the backend is running.');
        } else {
            // Something else happened
            throw new Error('Request setup error: ' + error.message);
        }
    }
};

export const deleteProject = async (projectId, projectName) => {
    try {
        console.log('Deleting project:', projectId, projectName);
        const response = await axiosInstance.delete(`/delete-project/${projectId}/${projectName}`);
        console.log('Delete response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting project:', error);
        
        if (error.response) {
            throw new Error(error.response.data.error || 'Failed to delete project');
        } else if (error.request) {
            throw new Error('No response from server. Please check if the backend is running.');
        } else {
            throw new Error('Request setup error: ' + error.message);
        }
    }
};
