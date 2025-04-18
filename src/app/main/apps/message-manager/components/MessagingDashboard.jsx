import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Mail,
  MessageSquare,
  Plus,
  Settings,
  Users,
  Trash2
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { mockTemplates, mockSmartTextVariables, mockRecipients } from '../data/more-mock-data';

const MessagingDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplateDialog, setNewTemplateDialog] = useState(false);
  const [smartTextDialog, setSmartTextDialog] = useState(false);
  const [recipientsDialog, setRecipientsDialog] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewTemplate = () => {
    setNewTemplateDialog(true);
  };

  const handleSmartText = () => {
    setSmartTextDialog(true);
  };

  const handleRecipients = () => {
    setRecipientsDialog(true);
  };

  return (
    <Box className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <Box className="w-64 bg-[#2A3447] text-white p-4">
        <Typography variant="h6" className="mb-4">Messaging</Typography>
        <List>
          <ListItem button selected={activeTab === 0} onClick={() => setActiveTab(0)}>
            <ListItemIcon><Mail className="text-white" /></ListItemIcon>
            <ListItemText primary="Email Templates" />
          </ListItem>
          <ListItem button selected={activeTab === 1} onClick={() => setActiveTab(1)}>
            <ListItemIcon><MessageSquare className="text-white" /></ListItemIcon>
            <ListItemText primary="SMS Templates" />
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box className="flex-1 p-6">
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h5">
            {activeTab === 0 ? 'Email Templates' : 'SMS Templates'}
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<Users />}
              onClick={handleRecipients}
              className="mr-2"
            >
              Recipients
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={handleNewTemplate}
            >
              New Template
            </Button>
          </Box>
        </Box>

        {/* Template List */}
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTemplates
            .filter(template => template.type === (activeTab === 0 ? 'email' : 'sms'))
            .map(template => (
              <Box
                key={template.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <Typography variant="h6" className="mb-2">{template.name}</Typography>
                <Typography variant="body2" className="mb-4 text-gray-600">
                  {template.content.substring(0, 100)}...
                </Typography>
                <Box className="flex justify-between items-center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={template.enabled}
                        onChange={() => {}}
                      />
                    }
                    label="Enabled"
                  />
                  <IconButton onClick={() => setSelectedTemplate(template)}>
                    <Settings size={20} />
                  </IconButton>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>

      {/* New Template Dialog */}
      <Dialog
        open={newTemplateDialog}
        onClose={() => setNewTemplateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Template</DialogTitle>
        <DialogContent>
          <TextField
            label="Template Name"
            fullWidth
            className="mb-4 mt-4"
          />
          {activeTab === 0 && (
            <TextField
              label="Subject"
              fullWidth
              className="mb-4"
            />
          )}
          <Box className="mb-4">
            <Button
              variant="outlined"
              onClick={handleSmartText}
              size="small"
            >
              Add Smart Text
            </Button>
          </Box>
          <ReactQuill
            theme="snow"
            value=""
            onChange={() => {}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTemplateDialog(false)}>Cancel</Button>
          <Button variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Smart Text Dialog */}
      <Dialog
        open={smartTextDialog}
        onClose={() => setSmartTextDialog(false)}
      >
        <DialogTitle>Insert Smart Text</DialogTitle>
        <DialogContent>
          <FormControl fullWidth className="mt-4">
            <InputLabel>Select Variable</InputLabel>
            <Select
              value=""
              onChange={() => {}}
            >
              {mockSmartTextVariables.map(variable => (
                <MenuItem key={variable.key} value={variable.key}>
                  {variable.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSmartTextDialog(false)}>Cancel</Button>
          <Button variant="contained">Insert</Button>
        </DialogActions>
      </Dialog>

      {/* Recipients Dialog */}
      <Dialog
        open={recipientsDialog}
        onClose={() => setRecipientsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Recipients</DialogTitle>
        <DialogContent>
          <List>
            {mockRecipients.map(recipient => (
              <ListItem
                key={recipient.id}
                secondaryAction={
                  <IconButton edge="end">
                    <Trash2 size={20} />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={recipient.name}
                  secondary={activeTab === 0 ? recipient.email : recipient.phone}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecipientsDialog(false)}>Cancel</Button>
          <Button variant="contained">Send Test</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessagingDashboard;