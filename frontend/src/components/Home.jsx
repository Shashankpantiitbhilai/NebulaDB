import React, { useState } from "react";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
 
  Description as DescriptionIcon,
  Storage as StorageIcon,
  FileCopy as FileCopyIcon,

  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useSpring, animated } from "@react-spring/web";
import {
  Home as HomeIcon,
  Star as StarIcon,
  FlashOn as ZapIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
})
  
  
  ;


const Sidebar = ({ activePage, setActivePage }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#312E81', // MUI uses theme.palette.background.paper by default
        color: 'white',
      },
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <RocketLaunchIcon sx={{ mr: 2, fontSize: '2rem' }} /> NebulaDB
      </Typography>
      <List>
        {[
          { name: 'Home', icon: <HomeIcon /> },
          { name: 'Nebulas', icon: <StarIcon /> },
          { name: 'Connect', icon: <ZapIcon /> },
          { name: 'Settings', icon: <SettingsIcon /> },
        ].map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={() => setActivePage(item.name)}
            selected={activePage === item.name}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#4C51BF', // same as bg-indigo-800
              },
              '&:hover': {
                backgroundColor: '#4C51BF',
              },
              borderRadius: '8px',
              mt: 1,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
);

const HomePage = () => {
  const props = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 1000 },
  });

  return (
    <Container>
      <animated.div style={props}>
        <Typography variant="h4" gutterBottom>
          Welcome to NebulaDB
        </Typography>
      </animated.div>
      <Typography variant="subtitle1" paragraph>
        Make database connections faster and easier than ever before!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Quick Start" />
            <CardContent>
              <Typography variant="body2" paragraph>
                Create your first Nebula in minutes
              </Typography>
              <Button variant="contained" fullWidth>
                Create Nebula
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Learn More" />
            <CardContent>
              <Typography variant="body2" paragraph>
                Discover the power of NebulaDB
              </Typography>
              <Button variant="outlined" fullWidth>
                View Tutorials
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

const DeploymentCard = () => {
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = () => {
    setDeploying(true);
    // Simulating deployment process
    setTimeout(() => {
      setDeploying(false);
      // Show success message or handle errors
    }, 3000);
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title="One-Click Deployment" />
      <CardContent>
        <Typography variant="body2" paragraph>
          Deploy your NebulaDB application instantly
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleDeploy}
          disabled={deploying}
          startIcon={<CloudUploadIcon />}
        >
          {deploying ? "Deploying..." : "Deploy Application"}
        </Button>
      </CardContent>
    </Card>
  );
};

const FormsPage = () => {
  const [forms, setForms] = useState([
    { name: "User Registration", fields: 5 },
    { name: "Product Catalog", fields: 8 },
  ]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Forms
      </Typography>
      <Grid container spacing={3}>
        {forms.map((form, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardHeader title={form.name} />
              <CardContent>
                <Typography variant="body2" paragraph>
                  Fields: {form.fields}
                </Typography>
                <Button variant="outlined" fullWidth>
                  Edit Form
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <CardContent>
              <Button variant="contained" fullWidth startIcon={<AddIcon />}>
                Create New Form
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

const NebulaDBUI = () => {
  const [activePage, setActivePage] = useState("Home");

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {activePage === "Home" && <HomePage />}
          {activePage === "Forms" && <FormsPage />}
          <DeploymentCard />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default NebulaDBUI;
