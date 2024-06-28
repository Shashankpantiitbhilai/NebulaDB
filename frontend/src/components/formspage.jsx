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
import AddIcon from "@mui/icons-material/Add";

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

export default FormsPage;
