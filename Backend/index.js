const axios = require('axios');
const axiosDigestAuth = require('@mhoc/axios-digest-auth').default;
const dotenv = require('dotenv');
dotenv.config();

const publicKey = process.env.ATLAS_PUBLIC_KEY;  // Organization Public Key
const privateKey = process.env.ATLAS_PRIVATE_KEY; // Organization Private Key
const organizationId = process.env.ATLAS_ORG_ID; // Replace with your organization ID

const client = new axiosDigestAuth({
    username: publicKey,
    password: privateKey,
});
console.log(organizationId)
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
                orgId: organizationId, // Include organization ID in the request body
            },
        });
        console.log('Project created successfully:', JSON.stringify(response.data, null, 2));
        return response.data.id; // Return the project ID
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
            instanceSizeName: 'M0',  // M0 for free tier
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
    } catch (error) {
        console.error('Error creating cluster:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Main function to orchestrate project and cluster creation
const main = async () => {
    const projectName = 'myNe';
    const clusterName = 'myNe';

    try {
        // Create a new project within the organization
        const projectId = await createProject(projectName);

        // Initiate cluster creation within the created project
        await initiateClusterCreation(projectId, clusterName);
    } catch (error) {
        console.error('Error in main function:', error.message);
    }
};

main();
