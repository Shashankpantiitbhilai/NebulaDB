import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  Paper,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Storage as StorageIcon,
  CloudQueue as CloudIcon,
  Speed as PerformanceIcon,
  Security as SecurityIcon,
  Launch as LaunchIcon,
  GitHub as GitHubIcon,
  Archive as NpmIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon,
  CloudUpload as CloudUploadIcon,
  MenuBook as DocsIcon,
} from "@mui/icons-material";

const DatabaseOverviewCard = () => {
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [stats, setStats] = useState({
    totalDatabases: 0,
    activeClusters: 0,
    totalConnections: 0,
    uptime: "99.9%",
  });

  const refreshStats = () => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        totalDatabases: Math.floor(Math.random() * 50) + 10,
        activeClusters: Math.floor(Math.random() * 10) + 2,
        totalConnections: Math.floor(Math.random() * 1000) + 100,
        uptime: "99.9%",
      });
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      alert("✅ NebulaDB deployed successfully!");
      setDeploying(false);
    }, 2000);
  };

  const features = [
    {
      icon: <StorageIcon />,
      title: "MongoDB Atlas Integration",
      description: "Seamless cloud database management",
      color: "#4CAF50",
    },
    {
      icon: <CloudIcon />,
      title: "Cloud-Native Architecture",
      description: "Built for modern cloud environments",
      color: "#2196F3",
    },
    {
      icon: <PerformanceIcon />,
      title: "High Performance",
      description: "Optimized for speed and reliability",
      color: "#FF9800",
    },
    {
      icon: <SecurityIcon />,
      title: "Enterprise Security",
      description: "Advanced authentication and encryption",
      color: "#9C27B0",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            🌌 NebulaDB Platform
          </Typography>
          <Tooltip title="Refresh Statistics">
            <IconButton onClick={refreshStats} disabled={loading} sx={{ color: "white" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Enterprise-Grade Database Management Platform
        </Typography>
      </Paper>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <StorageIcon sx={{ fontSize: 40, color: "#4CAF50", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {loading ? "-" : stats.totalDatabases}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Databases
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CloudIcon sx={{ fontSize: 40, color: "#2196F3", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {loading ? "-" : stats.activeClusters}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Clusters
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <PerformanceIcon sx={{ fontSize: 40, color: "#FF9800", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {loading ? "-" : stats.totalConnections}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Connections
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <SecurityIcon sx={{ fontSize: 40, color: "#9C27B0", mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {stats.uptime}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              System Uptime
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Features */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Platform Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  border: `1px solid ${feature.color}20`,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: `${feature.color}10`,
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <Box sx={{ color: feature.color, mb: 1 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Action Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <NpmIcon sx={{ fontSize: 48, color: "#CB3837", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                NPM Package
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Install NebulaDB via NPM for easy integration
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                href="https://www.npmjs.com/package/nebula-db1"
                target="_blank"
                startIcon={<LaunchIcon />}
              >
                View Package
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <GitHubIcon sx={{ fontSize: 48, color: "#333", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Source Code
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Explore the codebase and contribute to development
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                href="https://github.com/Shashankpantiitbhilai/NebulaDB"
                target="_blank"
                startIcon={<LaunchIcon />}
              >
                View Repository
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <CodeIcon sx={{ fontSize: 48, color: "#1976d2", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                API Documentation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Complete API reference and integration guides
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() =>
                  window.open(
                    "https://github.com/Shashankpantiitbhilai/NebulaDB/wiki",
                    "_blank"
                  )
                }
                startIcon={<LaunchIcon />}
              >
                Read Docs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Deployment */}
      <Card sx={{ backgroundColor: "#1976d2", color: "white", mt: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                  🌐 View Demo
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  href="https://nebula-db.vercel.app"
                  target="_blank"
                  startIcon={<LaunchIcon />}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.8)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  View Demo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                  📦 NPM Install
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  href="https://www.npmjs.com/package/nebula-db1"
                  target="_blank"
                  startIcon={<CodeIcon />}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.8)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  npm install
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                  📚 Documentation
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  href="https://github.com/Shashankpantiitbhilai/NebulaDB#readme"
                  target="_blank"
                  startIcon={<DocsIcon />}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.8)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Read Docs
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                  ⭐ Star Repo
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  href="https://github.com/Shashankpantiitbhilai/NebulaDB"
                  target="_blank"
                  startIcon={<LaunchIcon />}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.8)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  GitHub
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mb: 2 }}>
              Deploy your own NebulaDB instance instantly with one click
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleDeploy}
              disabled={deploying}
              startIcon={<CloudUploadIcon />}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                "&:disabled": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            >
              {/* {deploying ? "🚀 Deploying..." : "🌟 Deploy Application"} */}
            </Button>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
              <Chip label="✅ Production Ready" size="small" sx={{ bgcolor: "rgba(76, 175, 80, 0.2)", color: "white" }} />
              <Chip label="🔒 Secure" size="small" sx={{ bgcolor: "rgba(33, 150, 243, 0.2)", color: "white" }} />
              <Chip label="⚡ Fast" size="small" sx={{ bgcolor: "rgba(255, 193, 7, 0.2)", color: "white" }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Status */}
      <Alert severity="success" sx={{ mt: 3 }} action={<Chip label="OPERATIONAL" color="success" variant="outlined" size="small" />}>
        All systems operational. NebulaDB is running smoothly with {stats.uptime} uptime.
      </Alert>
    </Box>
  );
};

export default DatabaseOverviewCard;
