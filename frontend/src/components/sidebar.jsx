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
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import {
  Home as HomeIcon,
  Star as StarIcon,
  FlashOn as ZapIcon,
  Settings as SettingsIcon,
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
          { name: "Nebulas", icon: <StarIcon /> },
          { name: "Connect", icon: <ZapIcon /> },
          { name: "Settings", icon: <SettingsIcon /> },
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
    </Box>
  </Drawer>
);

export default Sidebar;
