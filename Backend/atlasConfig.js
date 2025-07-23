const axios = require('axios');
const axiosDigestAuth = require('@mhoc/axios-digest-auth').default;
const dotenv = require('dotenv');
const { getUserIP, addIpToOrgAccessList, addIpToProjectAccessList } = require('./ip_address');

dotenv.config();

// Now you can use axios, axiosDigestAuth, dotenv, and the imported functions as needed

dotenv.config();

const publicKey = process.env.ATLAS_PUBLIC_KEY;
const privateKey = process.env.ATLAS_PRIVATE_KEY;
const organizationId = process.env.ATLAS_ORG_ID;

const client = new axiosDigestAuth({
    username: publicKey,
    password: privateKey,
});
const createProject = async (projectName) => {
    const url = 'https://cloud.mongodb.com/api/atlas/v1.0/groups';

    try {
        const response = await client.request({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                name: projectName,
                orgId: organizationId,
            },
        });
        console.log('Project created successfully:', JSON.stringify(response.data, null, 2));
        return response.data.id;
    } catch (error) {
        console.error('Error creating project:', error.response ? error.response.data : error.message);
        throw error;
    }
};


const initiateClusterCreation = async (projectId, clusterName) => {
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters`;

    const clusterConfig = {
        name: clusterName,
        providerSettings: {
            providerName: 'TENANT',
            backingProviderName: 'AWS',
            instanceSizeName: 'M0', // M0 for free tier
            regionName: 'US_EAST_1',
        },
        clusterType: 'REPLICASET',
        backupEnabled: false,
    };

    try {
        const response = await client.request({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: clusterConfig,
        });
        console.log('Cluster creation initiated:', JSON.stringify(response.data, null, 2));
        return response.data.name; // Return cluster name
    } catch (error) {
        console.error('Error creating cluster:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const createDatabaseUser = async (projectId, clusterName, username, password) => {
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/databaseUsers`;

    // MongoDB Atlas database usernames cannot contain @ symbol or be email addresses
    // Convert email to valid username by removing @ and domain parts
    let validUsername = username;
    if (username.includes('@')) {
        validUsername = username.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''); // Remove special chars except alphanumeric
        console.log(`📝 Converting email ${username} to valid database username: ${validUsername}`);
    }

    const userConfig = {
        databaseName: 'admin',
        roles: [
            {
                roleName: 'readWriteAnyDatabase',
                databaseName: 'admin'
            }
        ],
        username: validUsername,
        password: password,
        x509Type: 'NONE',
    };

    try {
        const response = await client.request({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: userConfig,
        });
        console.log('Database user created successfully:', JSON.stringify(response.data, null, 2));
        return { username: validUsername, originalInput: username };
    } catch (error) {
        console.error('Error creating database user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const getConnectionUri = async (projectId, clusterName, actualUsername, password) => {
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters/${clusterName}`;
    console.log('Using database username:', actualUsername);

    for (let i = 0; i < 10; i++) { // Retry up to 10 times
        try {
            const response = await client.request({
                method: 'GET',
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { connectionStrings } = response.data;

            if (connectionStrings && connectionStrings.standardSrv) {
                const connectionString = `mongodb+srv://${actualUsername}:${password}@${connectionStrings.standardSrv.split('//')[1]}/?retryWrites=true&w=majority&appName=${clusterName}`;
                console.log('Connection string fetched successfully:', connectionString);
                return connectionString;
            } else {
                console.log('Connection strings data not found, retrying...');
                await sleep(5000); // Wait for 5 seconds before retrying
            }
        } catch (error) {
            console.error('Error fetching connection string:', error.response ? error.response.data : error.message);
            await sleep(5000); // Wait for 5 seconds before retrying
        }
    }
    throw new Error('Connection string not found after multiple retries');
};

const createProjectAndCluster = async (projectName) => {
    try {
        // Create the project
        console.log('🏗️ Creating new MongoDB Atlas project...');
        const projectId = await createProject(projectName);
        console.log('✅ New project created successfully with ID:', projectId);

        // Initiate cluster creation
        console.log('🚀 Creating MongoDB cluster...');
        const clusterName = await initiateClusterCreation(projectId, projectName);

        return { projectId, clusterName };
    } catch (error) {
        console.error('❌ Error creating project and cluster:', error.response ? error.response.data : error.message);
        throw error;
    }
};
const deleteCluster = async (projectId, clusterName) => {
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters/${clusterName}`;

    try {
        const response = await client.request({
            method: 'DELETE',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(`Cluster ${clusterName} deleted successfully`);
        return response.data; // If you need to return anything from the response
    } catch (error) {
        console.error(`Error deleting cluster ${clusterName}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

const addUserToOrganization = async (email) => {
    // Validate email format first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log(`⚠️ Invalid email format: ${email}. Skipping user invitation.`);
        return { message: 'Invalid email format provided, skipping user invitation', warning: true };
    }

    const url = `https://cloud.mongodb.com/api/atlas/v1.0/orgs/${organizationId}/invites`;

    try {
        const response = await client.request({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                username: email, // For invites, username should be the email
                roles: ['ORG_MEMBER'],
            },
        });

        console.log('✅ User invitation sent successfully to:', email);
        return response.data;
    } catch (error) {
        console.error('Error inviting user to organization:', error.response ? error.response.data : error.message);
        
        // Return success message since this is not critical for database creation
        console.log('ℹ️ User invitation feature not available or failed, but database creation will continue');
        return { 
            message: 'User invitation feature not available, but database creation completed successfully',
            warning: 'Could not invite user - this may require higher API permissions or the user may already exist'
        };
    }
};

module.exports={
    createProjectAndCluster,
    createDatabaseUser,
    getConnectionUri,
    deleteCluster,
    addUserToOrganization
};
