import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
} from "@mui/material";
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
              <Button variant="contained" fullWidth onClick={handleOpenDialog}>
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
      <CreateNebulaDialog open={openDialog} onClose={handleCloseDialog} />
    </Container>
  );
};

export default HomePage;
