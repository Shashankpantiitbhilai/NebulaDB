const axiosDigestAuth = require('@mhoc/axios-digest-auth').default;
const dotenv = require('dotenv');
dotenv.config();

const {
    getUserIP,
    addIpToOrgAccessList,
    addIpToProjectAccessList
} = require('./ip_address');

const publicKey = process.env.ATLAS_PUBLIC_KEY;
const privateKey = process.env.ATLAS_PRIVATE_KEY;
const organizationId = process.env.ATLAS_ORG_ID;
const atlasBaseUrl = process.env.ATLAS_BASE_URL;

const client = new axiosDigestAuth({
    username: publicKey,
    password: privateKey,
});

// ======================= PROJECT AND CLUSTER CREATION =======================

const createProject = async (projectName) => {
    const url = `${atlasBaseUrl}/groups`;

    try {
        const response = await client.request({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json' },
            data: { name: projectName, orgId: organizationId }
        });
        console.log('✅ Project created successfully:', JSON.stringify(response.data, null, 2));
        return response.data.id;
    } catch (error) {
        console.error('❌ Error creating project:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const initiateClusterCreation = async (projectId, clusterName) => {
    const url = `${atlasBaseUrl}/groups/${projectId}/clusters`;
    const clusterConfig = {
        name: clusterName,
        providerSettings: {
            providerName: 'TENANT',
            backingProviderName: 'AWS',
            instanceSizeName: 'M0',
            regionName: 'US_EAST_1',
        },
        clusterType: 'REPLICASET',
        backupEnabled: false,
    };

    try {
        const response = await client.request({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json' },
            data: clusterConfig
        });
        console.log('✅ Cluster creation initiated:', JSON.stringify(response.data, null, 2));
        return response.data.name;
    } catch (error) {
        console.error('❌ Error creating cluster:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const createProjectAndCluster = async (projectName) => {
    try {
        console.log('🏗️ Creating new MongoDB Atlas project...');
        const projectId = await createProject(projectName);
        console.log('✅ Project created:', projectId);

        console.log('🚀 Creating MongoDB cluster...');
        const clusterName = await initiateClusterCreation(projectId, projectName);

        return { projectId, clusterName };
    } catch (error) {
        console.error('❌ Failed to create project and cluster:', error.message);
        throw error;
    }
};

// ======================= DATABASE USER =======================

const createDatabaseUser = async (projectId, clusterName, username, password) => {
    const url = `${atlasBaseUrl}/groups/${projectId}/databaseUsers`;

    let validUsername = username;
    if (username.includes('@')) {
        validUsername = username.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        console.log(`📝 Converted email to valid DB username: ${validUsername}`);
    }

    const userConfig = {
        databaseName: 'admin',
        roles: [{ roleName: 'readWriteAnyDatabase', databaseName: 'admin' }],
        username: validUsername,
        password: password,
        x509Type: 'NONE',
    };

    try {
        const response = await client.request({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json' },
            data: userConfig
        });
        console.log('✅ Database user created:', JSON.stringify(response.data, null, 2));
        return { username: validUsername, originalInput: username };
    } catch (error) {
        console.error('❌ Error creating database user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// ======================= CONNECTION URI =======================

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const getConnectionUri = async (projectId, clusterName, actualUsername, password) => {
    const url = `${atlasBaseUrl}/groups/${projectId}/clusters/${clusterName}`;

    for (let i = 0; i < 10; i++) {
        try {
            const response = await client.request({
                method: 'GET',
                url,
                headers: { 'Content-Type': 'application/json' },
            });

            const { connectionStrings } = response.data;

            if (connectionStrings?.standardSrv) {
                const connectionString = `mongodb+srv://${actualUsername}:${password}@${connectionStrings.standardSrv.split('//')[1]}/?retryWrites=true&w=majority&appName=${clusterName}`;
                console.log('✅ Connection URI:', connectionString);
                return connectionString;
            }

            console.log('⏳ Connection string not ready, retrying...');
            await sleep(5000);
        } catch (error) {
            console.error('⚠️ Error fetching connection URI:', error.response?.data || error.message);
            await sleep(5000);
        }
    }
    throw new Error('❌ Connection string not found after multiple retries');
};

// ======================= DELETE CLUSTER =======================

const deleteCluster = async (projectId, clusterName) => {
    const url = `${atlasBaseUrl}/groups/${projectId}/clusters/${clusterName}`;

    try {
        await client.request({
            method: 'DELETE',
            url,
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(`✅ Cluster "${clusterName}" deleted successfully.`);
    } catch (error) {
        console.error(`❌ Error deleting cluster "${clusterName}":`, error.response?.data || error.message);
        throw error;
    }
};

// ======================= ORG INVITE =======================

const addUserToOrganization = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log(`⚠️ Invalid email format: ${email}`);
        return { message: 'Invalid email format', warning: true };
    }

    const url = `${atlasBaseUrl}/orgs/${organizationId}/invites`;

    try {
        const response = await client.request({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json' },
            data: { username: email, roles: ['ORG_MEMBER'] }
        });
        console.log(`✅ Invitation sent to ${email}`);
        return response.data;
    } catch (error) {
        console.error('⚠️ Failed to invite user:', error.response?.data || error.message);
        return {
            message: 'Invitation failed (non-critical)',
            warning: true
        };
    }
};

// ======================= PROJECT + CLUSTER INSPECTION =======================

const getUserProjects = async () => {
    const url = `${atlasBaseUrl}/groups`;
    try {
        const response = await client.request({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log('✅ Projects retrieved successfully');
        return response.data;
    } catch (error) {
        console.error('❌ Error getting projects:', error.response?.data || error.message);
        throw error;
    }
};

const getProjectClusters = async (projectId) => {
    const url = `${atlasBaseUrl}/groups/${projectId}/clusters`;

    try {
        const response = await client.request({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log(`✅ Clusters for project ${projectId} retrieved`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching clusters for ${projectId}:`, error.response?.data || error.message);
        throw error;
    }
};

const getClusterDetails = async (projectId, clusterName) => {
    const url = `${atlasBaseUrl}/groups/${projectId}/clusters/${clusterName}`;

    try {
        const response = await client.request({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log(`✅ Cluster details for "${clusterName}" retrieved`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error getting cluster details for ${clusterName}:`, error.response?.data || error.message);
        throw error;
    }
};

const getClusterConnectionStrings = async (projectId, clusterName) => {
    const url = `${atlasBaseUrl}/groups/${projectId}/clusters/${clusterName}/connectStrings`;

    try {
        const response = await client.request({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log(`✅ Connection strings for "${clusterName}" retrieved`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching connection strings for ${clusterName}:`, error.response?.data || error.message);
        throw error;
    }
};

// ======================= EXPORT =======================

module.exports = {
    createProjectAndCluster,
    createDatabaseUser,
    getConnectionUri,
    deleteCluster,
    addUserToOrganization,
    getUserProjects,
    getProjectClusters,
    getClusterDetails,
    getClusterConnectionStrings
};
