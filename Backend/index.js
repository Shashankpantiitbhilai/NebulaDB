const express = require('express');
const { createProjectAndCluster, createDatabaseUser, getConnectionUri, deleteCluster, addUserToOrganization } = require('./atlasConfig');
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
      'http://localhost:3000'
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
        res.status(500).json({ error: 'Failed to create project and cluster' });
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

// Start server
app.listen(port, () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const allowedOrigins = getAllowedOrigins();
    
    console.log(`✅ NebulaDB Backend is running on http://localhost:${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for:`, allowedOrigins);
    console.log('🎯 Ready to create MongoDB databases!');
});
