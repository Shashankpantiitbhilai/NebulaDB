// DatabaseDashboard.jsx - Main component for viewing and managing database clusters

import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    ExpandMore as ExpandMoreIcon,
    Storage as StorageIcon,
    Cloud as CloudIcon,
    Info as InfoIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import {
    getUserClusters,
    getClusterDetails,
    getUserProjects,
    getClusterStatusColor,
    getClusterStatusText,
    formatClusterTier,
    formatClusterRegion
} from '../services/clusterService';

const DatabaseDashboard = () => {
    // State management
    const [clusters, setClusters] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [clusterDetails, setClusterDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    // Load initial data
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            console.log('🔄 Loading dashboard data...');

            // Load clusters and projects in parallel
            const [clustersResponse, projectsResponse] = await Promise.all([
                getUserClusters(),
                getUserProjects()
            ]);

            setClusters(clustersResponse.clusters || []);
            setProjects(projectsResponse.projects || []);

            console.log(`✅ Dashboard loaded: ${clustersResponse.clusters?.length || 0} clusters, ${projectsResponse.projects?.length || 0} projects`);

            if (clustersResponse.clusters?.length === 0) {
                toast.info('No database clusters found. Create your first database to get started!');
            } else {
                toast.success(`Found ${clustersResponse.clusters.length} database cluster(s)`);
            }

        } catch (error) {
            console.error('❌ Error loading dashboard:', error);
            toast.error(`Failed to load dashboard: ${error.message}`, {
                autoClose: 8000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await loadDashboardData();
        } catch (error) {
            // Error already handled in loadDashboardData
        } finally {
            setRefreshing(false);
        }
    };

    const handleViewDetails = async (cluster) => {
        try {
            setDetailsLoading(true);
            setSelectedCluster(cluster);
            setDetailsDialogOpen(true);

            console.log(`🔍 Loading details for cluster "${cluster.name}"`);

            const details = await getClusterDetails(cluster.projectId, cluster.name);
            setClusterDetails(details.cluster);

            console.log('✅ Cluster details loaded successfully');

        } catch (error) {
            console.error('❌ Error loading cluster details:', error);
            toast.error(`Failed to load cluster details: ${error.message}`, {
                autoClose: 6000
            });
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleCloseDetails = () => {
        setDetailsDialogOpen(false);
        setSelectedCluster(null);
        setClusterDetails(null);
    };

    // Group clusters by project for better organization
    const clustersByProject = clusters.reduce((acc, cluster) => {
        const projectName = cluster.projectName || 'Unknown Project';
        if (!acc[projectName]) {
            acc[projectName] = [];
        }
        acc[projectName].push(cluster);
        return acc;
    }, {});

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="400px"
                gap={2}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" color="textSecondary">
                    Loading your database clusters...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StorageIcon fontSize="large" />
                        My Database Clusters
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Manage and monitor your MongoDB Atlas clusters
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Clusters
                            </Typography>
                            <Typography variant="h4">
                                {clusters.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Projects
                            </Typography>
                            <Typography variant="h4">
                                {projects.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Active Clusters
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {clusters.filter(c => c.stateName === 'IDLE').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Free Tier Clusters
                            </Typography>
                            <Typography variant="h4" color="info.main">
                                {clusters.filter(c => c.providerSettings?.instanceSizeName === 'M0').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Clusters by Project */}
            {clusters.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <CloudIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        No Database Clusters Found
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                        You haven't created any database clusters yet. Create your first database to get started!
                    </Typography>
                    <Button variant="contained" color="primary">
                        Create Database
                    </Button>
                </Paper>
            ) : (
                Object.entries(clustersByProject).map(([projectName, projectClusters]) => (
                    <Accordion key={projectName} defaultExpanded sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                📁 {projectName}
                                <Chip 
                                    label={`${projectClusters.length} cluster${projectClusters.length !== 1 ? 's' : ''}`}
                                    size="small"
                                    color="primary"
                                />
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {projectClusters.map((cluster) => (
                                    <Grid item xs={12} md={6} lg={4} key={cluster.id}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        {cluster.name}
                                                    </Typography>
                                                    <Tooltip title="View Details">
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleViewDetails(cluster)}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>

                                                <Box sx={{ mb: 2 }}>
                                                    <Chip
                                                        label={getClusterStatusText(cluster.stateName)}
                                                        color={getClusterStatusColor(cluster.stateName)}
                                                        size="small"
                                                        sx={{ mb: 1 }}
                                                    />
                                                </Box>

                                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                                    <strong>Tier:</strong> {formatClusterTier(cluster.providerSettings)}
                                                </Typography>

                                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                                    <strong>Region:</strong> {formatClusterRegion(cluster.providerSettings)}
                                                </Typography>

                                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                                    <strong>MongoDB:</strong> {cluster.mongoDBVersion || 'Unknown'}
                                                </Typography>

                                                <Box sx={{ mt: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        onClick={() => handleViewDetails(cluster)}
                                                        startIcon={<InfoIcon />}
                                                    >
                                                        View Details
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}

            {/* Cluster Details Dialog */}
            <Dialog
                open={detailsDialogOpen}
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Cluster Details: {selectedCluster?.name}
                </DialogTitle>
                <DialogContent>
                    {detailsLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>Loading cluster details...</Typography>
                        </Box>
                    ) : clusterDetails ? (
                        <Grid container spacing={3}>
                            {/* General Information */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    📊 General Information
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemText
                                            primary="Status"
                                            secondary={
                                                <Chip
                                                    label={getClusterStatusText(clusterDetails.stateName)}
                                                    color={getClusterStatusColor(clusterDetails.stateName)}
                                                    size="small"
                                                />
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="MongoDB Version"
                                            secondary={clusterDetails.mongoDBVersion || 'Unknown'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Cluster Type"
                                            secondary={clusterDetails.clusterType || 'Unknown'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Created"
                                            secondary={clusterDetails.createDate ? new Date(clusterDetails.createDate).toLocaleString() : 'Unknown'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>

                            {/* Configuration */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    ⚙️ Configuration
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemText
                                            primary="Instance Size"
                                            secondary={formatClusterTier(clusterDetails.providerSettings)}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Provider"
                                            secondary={clusterDetails.providerSettings?.providerName || 'Unknown'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Region"
                                            secondary={formatClusterRegion(clusterDetails.providerSettings)}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Disk Size"
                                            secondary={clusterDetails.diskSizeGB ? `${clusterDetails.diskSizeGB} GB` : 'Unknown'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>

                            {/* Connection Information */}
                            {clusterDetails.connectionStrings && (
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" gutterBottom>
                                        🔗 Connection Information
                                    </Typography>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Use your database username and password to connect to this cluster.
                                    </Alert>
                                    {clusterDetails.srvAddress && (
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                                            {clusterDetails.srvAddress}
                                        </Typography>
                                    )}
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Typography>No details available</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Box>
    );
};

export default DatabaseDashboard;
