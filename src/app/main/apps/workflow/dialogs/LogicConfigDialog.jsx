// dialogs/LogicConfigDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';


function LogicConfigDialog({ open, config, onClose }) {
  const [scriptType, setScriptType] = useState(config.scriptType || 'groovy');
  const [scriptCode, setScriptCode] = useState(config.scriptCode || '');

  const handleSave = () => {
    // Placeholder for API call to save configuration
    console.log('Saving logic config:', { scriptType, scriptCode });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Configure Logic Node</DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          label="Script Type"
          fullWidth
          margin="normal"
          value={scriptType}
          onChange={(e) => setScriptType(e.target.value)}
        >
          <MenuItem value="groovy">Groovy</MenuItem>
          <MenuItem value="javascript">JavaScript</MenuItem>
        </TextField>
        <TextField
          label="Script Code"
          multiline
          rows={6}
          fullWidth
          margin="normal"
          value={scriptCode}
          onChange={(e) => setScriptCode(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogicConfigDialog;