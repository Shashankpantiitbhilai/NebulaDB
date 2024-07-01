// utils.js

import axios from 'axios';

// Create an instance of axios with custom configuration
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Replace with your backend server URL
      // Timeout of 5 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

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
