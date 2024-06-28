import  { useState } from "react";
import { Box, CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import Sidebar from "./sidebar";
import HomePage from "./Home";
import FormsPage from "./formspage";
import DeploymentCard from "./deploy";
import theme from "./theme";

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
