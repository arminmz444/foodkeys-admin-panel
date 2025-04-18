// NewTaskDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { Task } from './TaskSchedulerPage';

function NewTaskDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scriptType, setScriptType] = useState<'groovy' | 'javascript'>('groovy');

  const handleSave = () => {
    const newTask = {
      id: Date.now(),
      name,
      description,
      scheduleTime,
      scriptType,
      status: 'Scheduled',
      createdAt: new Date().toLocaleString(),
    };
    // Placeholder: call API to save task
    // await saveTask(newTask);
    onCreate(newTask);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Task Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Schedule Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
        />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewTaskDialog;