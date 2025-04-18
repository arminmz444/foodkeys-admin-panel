// UploadMiniappDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputLabel, FormControl } from '@mui/material';
import { Miniapp } from './MiniappsManagerApp';

export default function UploadMiniappDialog({ open, onClose, onUpload }) {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [forcedVersion, setForcedVersion] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if(e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Placeholder: call API to upload miniapp (file and metadata)
    const newMiniapp: Miniapp = {
      id: Date.now(),
      name,
      version,
      status: 'Active',
      forcedVersion,
      updatedAt: new Date().toLocaleString(),
    };
    onUpload(newMiniapp);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload New Miniapp</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Miniapp Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Version"
          fullWidth
          margin="normal"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
        <TextField
          label="Forced Version (optional)"
          fullWidth
          margin="normal"
          value={forcedVersion}
          onChange={(e) => setForcedVersion(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="miniapp-file">Miniapp ZIP File</InputLabel>
          <input id="miniapp-file" type="file" accept=".zip" onChange={handleFileChange} style={{ marginTop: '16px' }} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpload}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadMiniappDialog;