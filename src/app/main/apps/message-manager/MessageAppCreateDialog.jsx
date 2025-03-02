/* -----------------------------------------
 * MessageCreateDialog.tsx
 * -----------------------------------------
 */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';

function MessageCreateDialog({ open, onClose, onCreate }) {
  const [medium, setMedium] = useState('SMS');
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState('');

  const handleSave = () => {
    // Example: create a new message object
    const newMessage = {
      id: Date.now(), // mock ID
      medium,
      content,
      recipients,
      status: 'SENT',
      createdAt: new Date().toLocaleString(),
      createdBy: 'admin', // or from auth context
    };

    onCreate(newMessage);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Message</DialogTitle>
      <DialogContent className="space-y-4">
        <TextField
          select
          label="Medium"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          fullWidth
        >
          <MenuItem value="SMS">SMS</MenuItem>
          <MenuItem value="Email">Email</MenuItem>
          <MenuItem value="Telegram">Telegram</MenuItem>
          <MenuItem value="WhatsApp">WhatsApp</MenuItem>
          <MenuItem value="Bale">Bale</MenuItem>
          <MenuItem value="Eitta">Eitta</MenuItem>
        </TextField>

        <TextField
          label="Recipients"
          placeholder="e.g. all, role:EXPERT, username:john"
          fullWidth
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
        />

        <TextField
          label="Message Content"
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MessageCreateDialog;