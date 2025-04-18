import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { useUpdateConfigMutation } from '../api/configManagementApi';

function ConfigEditorModal({ config, onClose }) {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState('');
  const [placement, setPlacement] = useState('');
  const [data, setData] = useState('');
  
  const [updateConfig, { isLoading, error }] = useUpdateConfigMutation();

  useEffect(() => {
    if (config) {
      setName(config.name);
      setDisplayName(config.displayName);
      setCategory(config.category || '');
      setPlacement(config.placement || '');
      setData(JSON.stringify(config.data, null, 2));
    }
  }, [config]);

  const handleSave = async () => {
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      alert("Invalid JSON in config data");
      return;
    }
    await updateConfig({ configName: name, configData: { ...config, displayName, category, placement, data: parsedData } });
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Config: {name}</DialogTitle>
      <DialogContent>
        <TextField
          label="Display Name"
          fullWidth
          margin="normal"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          label="Category"
          fullWidth
          margin="normal"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          label="Placement"
          fullWidth
          margin="normal"
          value={placement}
          onChange={(e) => setPlacement(e.target.value)}
        />
        <TextField
          label="Config Data (JSON)"
          fullWidth
          margin="normal"
          multiline
          minRows={6}
          value={data}
          onChange={(e) => setData(e.target.value)}
          helperText="Enter valid JSON data for the config"
        />
        {error && <p style={{ color: 'red' }}>Error updating config.</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={isLoading}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfigEditorModal;
