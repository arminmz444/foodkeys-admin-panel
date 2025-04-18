// WorkflowSettingsPage.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Switch, FormControlLabel } from '@mui/material';

function WorkflowAppSettings({ onClose }) {
  const [settings, setSettings] = useState({
    name: '',
    description: '',
    enableCustomTriggers: false,
    triggerCondition: '',
  });

  const handleSave = () => {
    // Placeholder: call API to save workflow settings
    console.log('Saving settings:', settings);
    onClose();
  };

  return (
    <Box className="p-4">
      <Typography variant="h6" gutterBottom>Workflow Settings</Typography>
      <Box component="form" className="space-y-4">
        <TextField
          label="Workflow Name"
          fullWidth
          value={settings.name}
          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={settings.description}
          onChange={(e) => setSettings({ ...settings, description: e.target.value })}
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableCustomTriggers}
              onChange={(e) => setSettings({ ...settings, enableCustomTriggers: e.target.checked })}
            />
          }
          label="Enable Custom Triggers"
        />
        {settings.enableCustomTriggers && (
          <TextField
            label="Trigger Condition"
            fullWidth
            value={settings.triggerCondition}
            onChange={(e) => setSettings({ ...settings, triggerCondition: e.target.value })}
          />
        )}
        {/* Add more settings inputs as needed */}
        <Box className="flex space-x-2 mt-4">
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save Settings</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default WorkflowAppSettings;