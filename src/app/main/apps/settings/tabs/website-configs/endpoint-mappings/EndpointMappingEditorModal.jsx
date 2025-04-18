import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { createEndpoint, useUpdateEndpointMappingMutation } from '../configManagementApi.js';

function EndpointMappingEditorModal({ mapping, onClose }) {
  const [endpoint, setEndpoint] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [configKeys, setConfigKeys] = useState('');

  useEffect(() => {
    if (mapping) {
      setEndpoint(mapping.endpoint);
      setDisplayName(mapping.displayName);
      setConfigKeys(mapping.configKeys);
    } else {
      setEndpoint('');
      setDisplayName('');
      setConfigKeys('');
    }
  }, [mapping]);

  const handleSave = async () => {
    const data = { endpoint, displayName, configKeys };
    if (mapping && mapping.id) {
      await updateEndpoint(mapping.id, data);
    } else {
      await createEndpoint(data);
    }
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>{mapping ? 'Edit Endpoint Mapping' : 'Create New Endpoint Mapping'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Endpoint"
          fullWidth
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Display Name"
          fullWidth
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Config Keys (JSON array)"
          fullWidth
          value={configKeys}
          onChange={(e) => setConfigKeys(e.target.value)}
          helperText='Example: ["homePageConfig", "footerPageConfig"]'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EndpointMappingEditorModal;
