import axios from 'axios';
import config from '../config/config.js';

// Point to your backend instead of Atlas directly
const axiosInstance = axios.create({
    baseURL: config.backend.current,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('🔗 Atlas service connecting to backend:', config.backend.current);

export const addUserToOrg = async (email) => {
    try {
        // Call your backend endpoint instead of Atlas directly
        const response = await axiosInstance.post('/add-user-to-org', {
            email: email
        });
        console.log('User added successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding user to organization:', error);
        throw error;
    }
};
