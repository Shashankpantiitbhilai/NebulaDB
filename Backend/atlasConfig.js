const axios = require('axios');
const axiosDigestAuth = require('@mhoc/axios-digest-auth').default;
const dotenv = require('dotenv');
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

    const userConfig = {
        databaseName: 'admin',
        roles: [
            {
                roleName: 'readWriteAnyDatabase',
                databaseName: 'admin'
            }
        ],
        username: username,
        password: password,
        x509Type: 'NONE', // Ensure x509Type is set to NONE
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
    } catch (error) {
        console.error('Error creating database user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const getConnectionUri = async (projectId, clusterName, username, password) => {
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters/${clusterName}`;
console.log(username,password)
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
                const connectionString = `mongodb+srv://${username}:${password}@${connectionStrings.standardSrv.split('//')[1]}/?retryWrites = true & w= majority & appName=${clusterName}/`;
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
        const projectId = await createProject(projectName);
        const clusterName = await initiateClusterCreation(projectId, projectName); // Use projectName as clusterName
        return { projectId, clusterName };
    } catch (error) {
        console.error('Error creating project and cluster:', error.message);
        throw error;
    }
};

module.exports = {
    createProjectAndCluster,
    createDatabaseUser,
    getConnectionUri,
};
