const express = require('express');
const { createProjectAndCluster, createDatabaseUser, getConnectionUri, deleteCluster } = require('./atlasConfig');
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
        const { projectId, clusterName } = await createProjectAndCluster(projectName);
        await createDatabaseUser(projectId, clusterName, username, password);
        const connectionUri = await getConnectionUri(projectId, clusterName, username, password);

        res.status(201).json({ projectId, projectName, connectionString: connectionUri });
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
