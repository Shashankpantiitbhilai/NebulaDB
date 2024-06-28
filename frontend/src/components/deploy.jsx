import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

export default DeploymentCard;
