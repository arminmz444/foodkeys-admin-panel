/* -----------------------------------------
 * MessageManagerApp.tsx
 * -----------------------------------------
 */
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import MessageTable from './MessageManagerAppTable';
import MessageCreateDialog from './MessageAppCreateDialog';


function MessageManagerApp() {
  const [messages, setMessages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Example: fetch messages from mock or real API
  useEffect(() => {
    // mock fetch
    const fakeData = [
      {
        id: 1,
        medium: 'SMS',
        content: 'Hello, your request is approved.',
        recipients: 'username:alice',
        status: 'SENT',
        createdAt: '2025-03-01 10:00',
        createdBy: 'admin',
      },
      {
        id: 2,
        medium: 'Email',
        content: 'Please review your submission details.',
        recipients: 'role:EXPERT',
        status: 'SENT',
        createdAt: '2025-03-01 10:15',
        createdBy: 'admin',
      },
    ];
    setMessages(fakeData);
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Example: add a newly created message
  const handleMessageCreated = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  // Example: filter messages by search text
  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box className="w-full h-full flex flex-col p-4">
      {/* Title and "New Message" button */}
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h6">Message Manager</Typography>
        <Button variant="contained" onClick={handleOpenDialog}>
          New Message
        </Button>
      </Box>

      {/* Search bar */}
      <Box className="mb-4 flex space-x-2">
        <TextField
          label="Search messages"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      {/* Table of messages */}
      <MessageTable messages={filteredMessages} />

      {/* Dialog for creating a new message */}
      {openDialog && (
        <MessageCreateDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onCreate={handleMessageCreated}
        />
      )}
    </Box>
  );
}

export default MessageManagerApp;