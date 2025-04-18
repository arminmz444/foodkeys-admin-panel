// ServiceAPIGeneratorApp.tsx
import React, { useState } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Button, TextField, Paper } from '@mui/material';

const steps = ['API Details', 'Endpoint Configuration', 'Review & Generate'];

function ServiceAPIGeneratorApp() {
  const [activeStep, setActiveStep] = useState(0);
  const [apiDetails, setApiDetails] = useState({ serviceName: '', description: '' });
  const [endpointConfig, setEndpointConfig] = useState({ httpMethod: 'GET', url: '', headers: [{ key: '', value: '' }] });

  const handleNext = () => {
    // Placeholder: validate and proceed
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleGenerate = () => {
    // Placeholder: call API to generate service API based on details
    console.log('Generating service API with', { apiDetails, endpointConfig });
    alert('Service API Generated (mock)');
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Service API Generator</Typography>
      <Paper style={{ padding: 16 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box mt={2}>
            <TextField
              label="Service Name"
              fullWidth
              margin="normal"
              value={apiDetails.serviceName}
              onChange={(e) => setApiDetails({ ...apiDetails, serviceName: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={apiDetails.description}
              onChange={(e) => setApiDetails({ ...apiDetails, description: e.target.value })}
            />
            <Box mt={2}>
              <Button variant="contained" onClick={handleNext}>Next</Button>
            </Box>
          </Box>
        )}
        {activeStep === 1 && (
          <Box mt={2}>
            <TextField
              label="HTTP Method"
              fullWidth
              margin="normal"
              value={endpointConfig.httpMethod}
              onChange={(e) => setEndpointConfig({ ...endpointConfig, httpMethod: e.target.value })}
            />
            <TextField
              label="Endpoint URL"
              fullWidth
              margin="normal"
              value={endpointConfig.url}
              onChange={(e) => setEndpointConfig({ ...endpointConfig, url: e.target.value })}
            />
            {/* For headers, a more complex UI can be built here */}
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleNext}>Next</Button>
            </Box>
          </Box>
        )}
        {activeStep === 2 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Review your settings:</Typography>
            <pre>{JSON.stringify({ apiDetails, endpointConfig }, null, 2)}</pre>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleGenerate}>Generate</Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ServiceAPIGeneratorApp;