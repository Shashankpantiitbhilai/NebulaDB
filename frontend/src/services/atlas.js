import axios from 'axios';

const atlasBaseUrl = 'https://cloud.mongodb.com/api/atlas/v1.0';
const orgId = import.meta.env.VITE_ATLAS_ORG_ID;
const apiKey = import.meta.env.VITE_ATLAS_PUBLIC_KEY;
const axiosInstance = axios.create({
    baseURL: atlasBaseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    },
});


export const addUserToOrg = async (email) => {
    console.log(orgId, apiKey)
    try {
       
        const response = await axiosInstance.post(`/orgs/${orgId}/users`, {
            emailAddress: email,
            roles: ['ORG_MEMBER'], // Adjust roles as per your requirements (e.g., ORG_MEMBER, ORG_OWNER)
        });
        console.log(response.data)
        return response.data; // Return the response data if needed
    } catch (error) {
        console.error('Error adding user to organization:', error);
        throw error; // Handle errors appropriately in your component
    }
};
