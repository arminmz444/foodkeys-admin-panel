// src/components/ExcelTemplateManager/TemplateDetails.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  IconButton,
  Paper,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import { 
  updateTemplateInfo, 
  removeTemplate 
} from '../../store/slices/excelTemplateSlice';
import ConfirmDialog from '../common/ConfirmDialog';
import { downloadTemplate } from '../../services/excelTemplateService';

const TemplateDetails = ({ onBack, isMobile }) => {
  const dispatch = useDispatch();
  const { currentTemplate, loading } = useSelector(state => state.excelTemplate);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentTemplate?.name || '');
  const [description, setDescription] = useState(currentTemplate?.description || '');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset values
      setName(currentTemplate?.name || '');
      setDescription(currentTemplate?.description || '');
    }
    setIsEditing(!isEditing);
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Template name cannot be empty');
      return;
    }
    
    dispatch(updateTemplateInfo({ 
      id: currentTemplate.id, 
      data: { name, description } 
    }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        toast.success('Template updated successfully');
      })
      .catch((err) => {
        toast.error(`Failed to update template: ${err.message || err}`);
      });
  };
  
  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    dispatch(removeTemplate(currentTemplate.id))
      .unwrap()
      .then(() => {
        toast.success('Template deleted successfully');
        onBack();
      })
      .catch((err) => {
        toast.error(`Failed to delete template: ${err.message || err}`);
      });
    setDeleteConfirmOpen(false);
  };
  
  const handleDownload = async () => {
    try {
      const blob = await downloadTemplate(currentTemplate.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentTemplate.originalFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download template');
    }
  };
  
  if (!currentTemplate) {
    return null;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant={isMobile ? 'h5' : 'h4'}>Template Details</Typography>
      </Box>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            {isEditing ? (
              <TextField
                fullWidth
                label="Template Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography variant="h5">{currentTemplate.name}</Typography>
            )}
            
            <Box>
              {isEditing ? (
                <>
                  <IconButton 
                    onClick={handleEditToggle} 
                    color="error" 
                    title="Cancel"
                  >
                    <CancelIcon />
                  </IconButton>
                  <IconButton 
                    onClick={handleSave} 
                    color="primary" 
                    title="Save"
                    disabled={loading}
                  >
                    <SaveIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton 
                  onClick={handleEditToggle} 
                  color="primary" 
                  title="Edit"
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                File Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Original Filename:</strong> {currentTemplate.originalFilename}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>File Type:</strong> {currentTemplate.contentType}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Created:</strong> {format(new Date(currentTemplate.createdAt), 'MMM d, yyyy HH:mm')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Last Updated:</strong> {format(new Date(currentTemplate.updatedAt), 'MMM d, yyyy HH:mm')}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Description
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={4}
                />
              ) : (
                <Typography variant="body1" gutterBottom>
                  {currentTemplate.description || 'No description provided'}
                </Typography>
              )}
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete Template
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                Download Template
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
      
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Template"
        message={`Are you sure you want to delete the template "${currentTemplate.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </Box>
  );
};

export default TemplateDetails;