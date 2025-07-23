import React from "react";
import {
  Drawer,
  Toolbar,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
  IconButton,
  Tooltip,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import {
  Home as HomeIcon,
  Star as StarIcon,
  FlashOn as ZapIcon,
  Storage as StorageIcon,
  GitHub as GitHubIcon,
  Archive as NpmIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar = ({ activePage, setActivePage }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: drawerWidth,
        boxSizing: "border-box",
        backgroundColor: "#312E81",
        color: "white",
      },
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: "auto", p: 2 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 4 }}
      >
        <RocketLaunchIcon sx={{ mr: 2, fontSize: "2rem" }} /> NebulaDB
      </Typography>
      <List>
        {[
          { name: "Home", icon: <HomeIcon /> },
          { name: "Clusters", icon: <StorageIcon /> },
          { name: "Nebulas", icon: <StarIcon /> },
          { name: "Connect", icon: <ZapIcon /> },
        ].map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={() => setActivePage(item.name)}
            selected={activePage === item.name}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#4C51BF",
              },
              "&:hover": {
                backgroundColor: "#4C51BF",
              },
              borderRadius: "8px",
              mt: 1,
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>

      {/* Links Section */}
      <Divider sx={{ my: 3, backgroundColor: "rgba(255,255,255,0.2)" }} />
      
      <Typography variant="body2" sx={{ mb: 2, color: "rgba(255,255,255,0.7)" }}>
        Quick Links
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Tooltip title="View on NPM Package" arrow>
          <Link
            href="https://www.npmjs.com/package/nebula-db1"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "white",
              textDecoration: "none",
              p: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <NpmIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2">NPM Package</Typography>
          </Link>
        </Tooltip>

        <Tooltip title="View GitHub Repository" arrow>
          <Link
            href="https://github.com/Shashankpantiitbhilai/NebulaDB"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "white",
              textDecoration: "none",
              p: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <GitHubIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2">GitHub Repo</Typography>
          </Link>
        </Tooltip>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
          Made with ❤️ by Shashank
        </Typography>
      </Box>
    </Box>
  </Drawer>
);

export default Sidebar;
