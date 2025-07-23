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
            const errorData = error.response.data;
            
            // Create a detailed error message
            let errorMessage = errorData.error || 'Failed to create project';
            
            // Add specific error details if available
            if (errorData.details) {
                const details = errorData.details;
                
                // Handle specific error types
                if (details.type === 'COMMON_PASSWORD') {
                    errorMessage = '🔒 Password Error: ' + details.message + '\n\nPlease choose a stronger password that is not commonly used.';
                } else if (details.type === 'ATLAS_API_ERROR') {
                    errorMessage = '🌐 Atlas API Error: ' + details.message;
                    if (details.reason) {
                        errorMessage += `\nReason: ${details.reason}`;
                    }
                } else {
                    errorMessage = details.message || errorMessage;
                }
            }
            
            throw new Error(errorMessage);
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
            const errorData = error.response.data;
            let errorMessage = errorData.error || 'Failed to delete project';
            
            // Add detailed error information if available
            if (errorData.details) {
                errorMessage = errorData.details.message || errorMessage;
            }
            
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('No response from server. Please check if the backend is running.');
        } else {
            throw new Error('Request setup error: ' + error.message);
        }
    }
};
