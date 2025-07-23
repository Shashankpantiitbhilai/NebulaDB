// clusterService.js - Service for managing cluster operations

import axios from 'axios';
import config from '../config/config.js';

// Create an instance of axios with custom configuration
const axiosInstance = axios.create({
    baseURL: config.backend.current,
    timeout: 30000, // 30 second timeout for cluster operations
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('🔗 Cluster service connecting to backend:', config.backend.current);

// ========== CLUSTER MANAGEMENT FUNCTIONS ==========

// Get all user clusters across all projects
export const getUserClusters = async () => {
    try {
        console.log('🔍 Fetching user clusters...');
        const response = await axiosInstance.get('/api/user-clusters');
        console.log('✅ Clusters fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching clusters:', error);
        
        if (error.response) {
            // Server responded with error status
            const errorData = error.response.data;
            let errorMessage = errorData.error || 'Failed to fetch clusters';
            
            // Add specific error details if available
            if (errorData.details) {
                errorMessage = errorData.details.message || errorMessage;
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

// Get specific cluster details
export const getClusterDetails = async (projectId, clusterName) => {
    try {
        console.log(`🔍 Fetching details for cluster "${clusterName}" in project "${projectId}"`);
        const response = await axiosInstance.get(`/api/cluster-details/${projectId}/${clusterName}`);
        console.log('✅ Cluster details fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching cluster details for ${clusterName}:`, error);
        
        if (error.response) {
            const errorData = error.response.data;
            let errorMessage = errorData.error || `Failed to fetch details for cluster "${clusterName}"`;
            
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

// Get all projects (useful for filtering/organization)
export const getUserProjects = async () => {
    try {
        console.log('🔍 Fetching user projects...');
        const response = await axiosInstance.get('/api/projects');
        console.log('✅ Projects fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        
        if (error.response) {
            const errorData = error.response.data;
            let errorMessage = errorData.error || 'Failed to fetch projects';
            
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

// Get clusters for a specific project
export const getProjectClusters = async (projectId) => {
    try {
        console.log(`🔍 Fetching clusters for project "${projectId}"`);
        const response = await axiosInstance.get(`/api/project-clusters/${projectId}`);
        console.log('✅ Project clusters fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching clusters for project ${projectId}:`, error);
        
        if (error.response) {
            const errorData = error.response.data;
            let errorMessage = errorData.error || `Failed to fetch clusters for project`;
            
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

// ========== UTILITY FUNCTIONS ==========

// Helper function to get cluster status color for UI
export const getClusterStatusColor = (stateName) => {
    switch (stateName?.toUpperCase()) {
        case 'IDLE':
            return 'success';
        case 'CREATING':
            return 'warning';
        case 'UPDATING':
            return 'info';
        case 'DELETING':
            return 'error';
        case 'DELETED':
            return 'default';
        default:
            return 'default';
    }
};

// Helper function to get cluster status display text
export const getClusterStatusText = (stateName) => {
    switch (stateName?.toUpperCase()) {
        case 'IDLE':
            return '🟢 Active';
        case 'CREATING':
            return '🟡 Creating';
        case 'UPDATING':
            return '🔵 Updating';
        case 'DELETING':
            return '🔴 Deleting';
        case 'DELETED':
            return '⚫ Deleted';
        default:
            return `⚪ ${stateName || 'Unknown'}`;
    }
};

// Helper function to format cluster tier for display
export const formatClusterTier = (providerSettings) => {
    if (!providerSettings) return 'Unknown';
    
    const { instanceSizeName, providerName, regionName } = providerSettings;
    
    let tier = instanceSizeName || 'Unknown';
    if (tier === 'M0') {
        tier += ' (Free Tier)';
    }
    
    return tier;
};

// Helper function to format cluster region for display
export const formatClusterRegion = (providerSettings) => {
    if (!providerSettings?.regionName) return 'Unknown';
    
    // Convert region codes to readable names
    const regionMap = {
        'US_EAST_1': 'US East (N. Virginia)',
        'US_WEST_2': 'US West (Oregon)',
        'EU_WEST_1': 'Europe (Ireland)',
        'AP_SOUTHEAST_1': 'Asia Pacific (Singapore)',
        'AP_NORTHEAST_1': 'Asia Pacific (Tokyo)',
    };
    
    return regionMap[providerSettings.regionName] || providerSettings.regionName;
};
