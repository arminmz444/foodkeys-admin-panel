// dialogs/FormConfigDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function FormConfigDialog({ open, formId, onClose }) {
  // In a real app, you might load the form’s configuration and allow editing.
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Form Configuration</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2">Edit the settings of Form ID: {formId}</Typography>
        {/* Replace with form–builder or configuration inputs as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onClose()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormConfigDialog;