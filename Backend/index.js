const express = require('express');
const { createProjectAndCluster, createDatabaseUser, getConnectionUri } = require('./atlasConfig');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to create project and initiate cluster creation
app.post('/create-project', async (req, res) => {
    const { projectName, username, password } = req.body;

    try {
        console.log(req.body);
        const { projectId, clusterName } = await createProjectAndCluster(projectName);
        await createDatabaseUser(projectId, clusterName, username, password);
        const connectionUri = await getConnectionUri(projectId, clusterName,username,password);
        console.log(connectionUri);
       
        res.status(201).json({ projectId, clusterName, connectionString: connectionUri });
    } catch (error) {
        console.error('Error creating project and cluster:', error.message);
        res.status(500).json({ error: 'Failed to create project and cluster' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
