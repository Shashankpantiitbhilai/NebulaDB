// utils.js

import axios from 'axios';

// Get backend URL based on environment
const getBackendUrl = () => {
    const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development';
    
    if (isDevelopment) {
        return import.meta.env.VITE_BACKEND_URL_DEV ;
    } else {
        return import.meta.env.VITE_BACKEND_URL_PROD ;
    }
};

// Create an instance of axios with custom configuration
const axiosInstance = axios.create({
    baseURL: getBackendUrl(),
    timeout: 1200000, // 60 second timeout for database creation
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('🔗 Frontend connecting to backend:', getBackendUrl());

// Function to create a project
export const createProject = async (projectName,username,password) => {
    try {
        const response = await axiosInstance.post('/create-project', { projectName, username, password });
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};
export const deleteProject = async (projectId,projectName) => {
    try {
        console.log(projectId,projectName)
        const response = await axiosInstance.delete(`/delete-project/${projectId}/${projectName}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};
