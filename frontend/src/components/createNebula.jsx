import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { createProject, deleteProject } from "../services/utils"; // Import createProject and deleteProject functions
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgressWithLabel from "./Loading/circularProgreess.jsx"; // Import CircularProgressWithLabel
import { addUserToOrg } from "../services/atlas.js";
const CreateNebulaDialog = ({ open, onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [connectionString, setConnectionString] = useState("");
  const [databaseUsername, setDatabaseUsername] = useState("");
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [projectId, setProjectId] = useState("");
  const [progress, setProgress] = useState(0);

  const handleCreate = async () => {
    setLoading(true);
    setInfoMessage("Please wait, this may take up to one minute...");
    setLoadingMessage("Setting up project");
    try {
      await delay(2000); // Simulate setting up project
      setLoadingMessage("Creating Nebula...");
      await delay(2000); // Simulate creating cluster
      setLoadingMessage("Deploying to cloud...");
      
      // Create the actual project
      const response = await createProject(projectName, username, password);
      console.log('Project created:', response);
      setProjectId(response.projectId);
      setProjectName(response.projectName || projectName);
      setConnectionString(response.connectionString);
      setDatabaseUsername(response.databaseUsername);
      setProgress(90);
      
      setLoadingMessage("Setting up user access...");
      await delay(1000);
      
      // Try to add user to organization (optional)
      try {
        const add = await addUserToOrg(username);
        console.log('User org result:', add);
      } catch (orgError) {
        console.log('User organization setup failed (not critical):', orgError);
        // Don't fail the entire process if user org fails
      }
      
      setProgress(100);
      setCreationSuccess(true);
      toast.success("Database created successfully!");
      setInfoMessage("");
      setLoadingMessage("");
      
    } catch (error) {
      console.error("Error creating project:", error);
      
      // Extract the detailed error message from the backend
      let errorMessage = "Error creating project. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Show detailed error to user
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 8000, // Show for 8 seconds for longer error messages
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Clear loading states
      setProgress(0);
      setInfoMessage("");
      setLoadingMessage("");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleDeleteProject = async () => {
    try {
      console.log(projectId, projectName);
      await deleteProject(projectId, projectName);
      toast.success(`Project '${projectName}' deleted successfully!`);
      handleClose();
    } catch (error) {
      console.error(`Error deleting project '${projectName}':`, error);
      
      // Extract the detailed error message from the backend
      let errorMessage = `Error deleting project '${projectName}'. Please try again.`;
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Show detailed error to user
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(connectionString).then(() => {
      toast.info("Connection string copied to clipboard!");
    });
  };

  const handleClose = () => {
    setProjectName("");
    setUsername("");
    setPassword("");
    setConnectionString("");
    setDatabaseUsername("");
    setCreationSuccess(false);
    setProgress(0);

    onClose();
  };

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= 90 ? 90 : prevProgress + 10
        );
      }, 800);
    }
    return () => {
      clearInterval(timer);
    };
  }, [loading]);

  return (
    <>
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
        style={{ whiteSpace: 'pre-line' }} // Allow line breaks in error messages
      />
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Nebula</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <CircularProgressWithLabel value={progress} />
              <Typography variant="body1">{loadingMessage}</Typography>
            </Box>
          ) : creationSuccess ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <Typography variant="h6">Database Created Successfully! 🎉</Typography>
              
              {databaseUsername && databaseUsername !== username && (
                <Typography variant="body2" color="info.main">
                  📝 Note: Your database username was converted from "{username}" to "{databaseUsername}" 
                  (MongoDB Atlas database usernames cannot contain @ symbols)
                </Typography>
              )}
              
              <Typography variant="h6">Connection String:</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body1"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    backgroundColor: "#f0f0f0",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  {connectionString}
                </Typography>
                <Tooltip title="Copy to clipboard">
                  <IconButton onClick={handleCopy}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {databaseUsername && (
                <Typography variant="body2" color="text.secondary">
                  💡 Use username: <strong>{databaseUsername}</strong> and your password to connect
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <TextField
                autoFocus
                label="Project Name"
                fullWidth
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">📁</InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Username/Email"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                helperText="You can enter an email address - it will be converted to a valid database username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">👤</InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🔒</InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Typography variant="body2">{infoMessage}</Typography>
          <Button onClick={handleClose}>Close</Button>
          {!creationSuccess && (
            <Button
              onClick={handleCreate}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Creating...</Typography>
                </Box>
              ) : (
                "Create"
              )}
            </Button>
          )}
          {creationSuccess && (
            <Button
              onClick={handleDeleteProject}
              variant="contained"
              color="error"
            >
              Delete Project
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateNebulaDialog;
