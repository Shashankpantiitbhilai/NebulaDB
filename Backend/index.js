const express = require('express');
const { 
    createProjectAndCluster, 
    createDatabaseUser, 
    getConnectionUri, 
    deleteCluster, 
    addUserToOrganization,
    // New cluster management functions
    getUserProjects,
    getProjectClusters,
    getClusterDetails,
    getClusterConnectionStrings
} = require('./atlasConfig');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || process.env.PORT || 3000;

// Dynamic CORS origins based on environment
const getAllowedOrigins = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return [
      process.env.FRONTEND_URL_DEV,
        process.env.BACKEND_URL_DEV,
     
    ];
  } else {
    return [
      process.env.FRONTEND_URL_PROD,
      process.env.FRONTEND_URL_DEV, // Allow dev for testing
    process.env.BACKEND_URL_PROD//nebuladb-backend.onrender.com

    ];
  }
};

app.use(cors({
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Additional CORS preflight handling
app.options('*', cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'NebulaDB Backend is running!', timestamp: new Date().toISOString() });
});

// POST endpoint to create project and initiate cluster creation
app.post('/create-project', async (req, res) => {
    const { projectName, username, password } = req.body;

    try {
        const { projectId, clusterName } = await createProjectAndCluster(projectName);

        // Create database user and get the actual username used
        const userResult = await createDatabaseUser(projectId, clusterName, username, password);
        const actualUsername = userResult.username;
        
        // Get connection string with the actual username
        const connectionUri = await getConnectionUri(projectId, clusterName, actualUsername, password);

        res.status(201).json({ 
            projectId, 
            projectName, 
            connectionString: connectionUri,
            databaseUsername: actualUsername,
            originalInput: userResult.originalInput
        });
    } catch (error) {
        console.error('Error creating project and cluster:', error.message);
        
        // Extract detailed error information from Atlas API response
        let errorDetails = {
            message: 'Failed to create project and cluster',
            type: 'GENERAL_ERROR'
        };

        // Check if error contains Atlas API response details
        if (error.response?.data) {
            const atlasError = error.response.data;
            errorDetails = {
                message: atlasError.detail || atlasError.message || error.message,
                type: atlasError.errorCode || 'ATLAS_API_ERROR',
                error: atlasError.error || 500,
                reason: atlasError.reason || 'Server Error',
                parameters: atlasError.parameters || []
            };
        } else if (error.message) {
            errorDetails.message = error.message;
        }

        // Send appropriate HTTP status code
        const statusCode = errorDetails.error || 500;
        res.status(statusCode).json({ 
            success: false,
            error: errorDetails.message,
            errorType: errorDetails.type,
            details: errorDetails
        });
    }
});

// DELETE endpoint to delete a cluster
app.delete('/delete-project/:projectId/:projectName', async (req, res) => {
    const { projectId, projectName} = req.params;
console.log("deleting cluster",projectId,projectName)
    try {
        await deleteCluster(projectId, projectName);
        res.status(200).json({ message: `Cluster ${projectName} deleted successfully` });
    } catch (error) {
        console.error(`Error deleting cluster ${projectName}:`, error.message);
        res.status(500).json({ error: `Failed to delete project ${projectName}` });
    }
});

// POST endpoint to add user to organization
app.post('/add-user-to-org', async (req, res) => {
    const { email } = req.body;

    try {
        const result = await addUserToOrganization(email);
        res.status(201).json({ message: 'User organization process completed', data: result });
    } catch (error) {
        console.error('Error adding user to organization:', error.message);
        
        // Don't fail the request if user organization fails - it's not critical
        console.log('User organization feature failed, but this is not critical for database creation');
        res.status(200).json({ 
            message: 'User organization feature not available, but database creation will work normally',
            warning: 'Could not add user to organization - this may require higher API permissions'
        });
    }
});

// ========== CLUSTER MANAGEMENT ENDPOINTS ==========

// GET endpoint to retrieve all user clusters across all projects
app.get('/api/user-clusters', async (req, res) => {
    try {
        console.log('🔍 Getting all user clusters...');
        
        // First get all projects for the organization
        const projects = await getUserProjects();
        console.log(`Found ${projects.results?.length || 0} projects`);
        
        let allClusters = [];
        
        // Get clusters for each project
        for (const project of projects.results || []) {
            try {
                const clusters = await getProjectClusters(project.id);
                
                // Add project info to each cluster
                const clustersWithProject = (clusters.results || []).map(cluster => ({
                    ...cluster,
                    projectId: project.id,
                    projectName: project.name,
                    projectCreated: project.created
                }));
                
                allClusters = [...allClusters, ...clustersWithProject];
                console.log(`📊 Found ${clustersWithProject.length} clusters in project "${project.name}"`);
            } catch (error) {
                console.log(`⚠️ No clusters found for project "${project.name}" or error accessing it`);
                // Continue with other projects even if one fails
            }
        }
        
        console.log(`✅ Total clusters found: ${allClusters.length}`);
        res.json({ 
            success: true,
            clusters: allClusters,
            totalClusters: allClusters.length,
            totalProjects: projects.results?.length || 0
        });
    } catch (error) {
        console.error('❌ Error getting user clusters:', error.message);
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: 'Failed to retrieve clusters' 
        });
    }
});

// GET endpoint to retrieve specific cluster details
app.get('/api/cluster-details/:projectId/:clusterName', async (req, res) => {
    try {
        const { projectId, clusterName } = req.params;
        console.log(`🔍 Getting details for cluster "${clusterName}" in project "${projectId}"`);
        
        // Get cluster details
        const clusterDetails = await getClusterDetails(projectId, clusterName);
        
        // Try to get connection strings (optional, may fail for some cluster states)
        let connectionStrings = null;
        try {
            connectionStrings = await getClusterConnectionStrings(projectId, clusterName);
        } catch (connError) {
            console.log(`⚠️ Could not get connection strings for ${clusterName}: ${connError.message}`);
        }
        
        const result = {
            ...clusterDetails,
            connectionStrings: connectionStrings
        };
        
        console.log(`✅ Cluster details retrieved for "${clusterName}"`);
        res.json({
            success: true,
            cluster: result
        });
    } catch (error) {
        console.error(`❌ Error getting cluster details:`, error.message);
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: 'Failed to retrieve cluster details' 
        });
    }
});

// GET endpoint to get all projects (useful for dropdown/selection)
app.get('/api/projects', async (req, res) => {
    try {
        console.log('🔍 Getting all projects...');
        const projects = await getUserProjects();
        
        console.log(`✅ Found ${projects.results?.length || 0} projects`);
        res.json({
            success: true,
            projects: projects.results || [],
            totalCount: projects.totalCount || 0
        });
    } catch (error) {
        console.error('❌ Error getting projects:', error.message);
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: 'Failed to retrieve projects' 
        });
    }
});

// GET endpoint to get clusters for a specific project
app.get('/api/project-clusters/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log(`🔍 Getting clusters for project "${projectId}"`);
        
        const clusters = await getProjectClusters(projectId);
        
        console.log(`✅ Found ${clusters.results?.length || 0} clusters in project`);
        res.json({
            success: true,
            clusters: clusters.results || [],
            totalCount: clusters.totalCount || 0,
            projectId: projectId
        });
    } catch (error) {
        console.error(`❌ Error getting clusters for project:`, error.message);
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: 'Failed to retrieve project clusters' 
        });
    }
});

// Start server
app.listen(port, () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const allowedOrigins = getAllowedOrigins();
    
    console.log(`✅ NebulaDB Backend is running on http://localhost:${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for:`, allowedOrigins);
    console.log('🎯 Ready to create MongoDB databases!');
});
