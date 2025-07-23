import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  Box,
  Chip,
  Link,
  Paper,
  Avatar,
} from "@mui/material";
import {
  RocketLaunch as RocketIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  GitHub as GitHubIcon,
  Archive as NpmIcon,
  Star as StarIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useSpring, animated } from "@react-spring/web";
import CreateNebulaDialog from "./createNebula";

const HomePage = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const props = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 1000 },
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg">
      <animated.div style={props}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🌌 Welcome to NebulaDB
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
            A lightweight Node.js wrapper for database operations with 350+ downloads. 
            Simplifying database connections with automated query optimization.
          </Typography>
          
          {/* Badges */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip icon={<DownloadIcon />} label="350+ Downloads" color="success" />
            <Chip icon={<StarIcon />} label="MIT License" color="primary" />
            <Chip icon={<SpeedIcon />} label="60% Faster Setup" color="warning" />
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<RocketIcon />}
              onClick={handleOpenDialog}
              sx={{ 
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
              }}
            >
              Create Database
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<NpmIcon />}
              component={Link}
              href="https://www.npmjs.com/package/nebula-db1"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on NPM
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<GitHubIcon />}
              component={Link}
              href="https://github.com/Shashankpantiitbhilai/NebulaDB"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repo
            </Button>
          </Box>
        </Box>
      </animated.div>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        ✨ Key Features
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <SpeedIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                ⚡ Fast Setup
              </Typography>
              <Typography variant="body2" color="text.secondary">
                60% faster setup compared to traditional database connection methods
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                <SecurityIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                🔒 Secure
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Built-in security features with encrypted connections and best practices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                <StorageIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                🗄️ Multi-DB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports MongoDB, MySQL, PostgreSQL, and more database types
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                <RocketIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                🚀 Optimized
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Automated query optimization and intelligent connection management
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Start Section */}
      <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          🚀 Quick Start
        </Typography>
        <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 3 }}>
          Get started with NebulaDB in just a few steps
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="📦 Install NPM Package" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5', fontFamily: 'monospace' }}>
                  <Typography variant="body2">
                    npm install nebula-db1
                  </Typography>
                </Paper>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  component={Link}
                  href="https://www.npmjs.com/package/nebula-db1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Package Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="🌐 Create Database" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Typography variant="body2" paragraph>
                  Create and manage your MongoDB databases with our intuitive interface
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleOpenDialog}
                  sx={{ mt: 2 }}
                >
                  Create Your First Database
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          📊 By the Numbers
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={3}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              350+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              NPM Downloads
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
              60%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Faster Setup
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
              40%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Better Performance
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              80%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Error Reduction
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <CreateNebulaDialog open={openDialog} onClose={handleCloseDialog} />
    </Container>
  );
};

export default HomePage;
