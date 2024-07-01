const axios = require('axios');
const  axiosDigestAuth  = require('@mhoc/axios-digest-auth').default;
const dotenv = require('dotenv');

dotenv.config();


const publicKey = process.env.ATLAS_PUBLIC_KEY;
const privateKey = process.env.ATLAS_PRIVATE_KEY;
const organizationId = process.env.ATLAS_ORG_ID;


const digestAuth = new axiosDigestAuth({
    username: publicKey,
    password: privateKey, });
   
   


const getUserIP = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error getting user IP address:', error);
        throw error;
    }
};

const addIpToOrgAccessList = async (orgId, ipAddress) => {
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/orgs/${orgId}/access/apiKeys/edit/${publicKey}/1`;
    const data = {
        ipAddress: ipAddress,
        comment: 'Automated IP addition'
    };

    try {
        const response = await digestAuth.request({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: [data],
        });
        console.log('IP address added to organization access list:', response.data);
    } catch (error) {
        console.error('Error adding IP to organization access list:', error.response ? error.response.data : error.message);
        throw error;
    }
};
const addIpToProjectAccessList = async (projectId, ipAddress) => {
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/accessList`;
    const data = {
        ipAddress: ipAddress,
        comment: 'Automated IP addition'
    };

    try {
        const response = await digestAuth.request({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: [data],
        });
        console.log('IP address added to project access list:', response.data);
    } catch (error) {
        console.error('Error adding IP to project access list:', error.response ? error.response.data : error.message);
        throw error;
    }
};
module.exports= {getUserIP,addIpToOrgAccessList,addIpToProjectAccessList}