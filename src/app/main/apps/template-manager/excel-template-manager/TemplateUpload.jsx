// src/components/ExcelTemplateManager/TemplateUpload.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Grid,
  IconButton
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { addTemplate } from '../../store/slices/excelTemplateSlice';

const TemplateUpload = ({ onCancel, onSuccess, isMobile }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.excelTemplate);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      setFileError('');
      return;
    }
    
    const fileType = selectedFile.type;
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(fileType)) {
      setFile(null);
      setFileError('Please select a valid Excel file (.xls or .xlsx)');
      return;
    }
    
    setFile(selectedFile);
    setFileError('');
    
    // Set a default name if name is empty
    if (!name) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setName(fileName);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setFileError('Please select an Excel file');
      return;
    }
    
    if (!name.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    
    const formData = {
      name,
      description
    };
    
    dispatch(addTemplate({ file, data: formData }))
      .unwrap()
      .then(() => {
        toast.success('Template uploaded successfully');
        onSuccess();
      })
      .catch((err) => {
        toast.error(`Failed to upload template: ${err.message || err}`);
      });
  };
  
  const inputMotion = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onCancel} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant={isMobile ? 'h5' : 'h4'}>Upload New Template</Typography>
      </Box>
      
      <motion.form 
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div variants={inputMotion}>
          <TextField
            fullWidth
            label="Template Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            variant="outlined"
          />
        </motion.div>
        
        <motion.div variants={inputMotion}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
          />
        </motion.div>
        
        <motion.div variants={inputMotion}>
          <Box sx={{ mt: 3, mb: 3 }}>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".xls,.xlsx"
            />
            <label htmlFor="file-upload">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px dashed',
                    borderColor: fileError ? 'error.main' : 'primary.light',
                    backgroundColor: 'background.default',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {file ? file.name : 'Select or Drop Excel Template'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Only .xls or .xlsx files are allowed
                  </Typography>
                  {fileError && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {fileError}
                    </Typography>
                  )}
                </Paper>
              </motion.div>
            </label>
          </Box>
        </motion.div>
        
        <motion.div variants={inputMotion}>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ mr: 2 }}
              startIcon={<CloseIcon />}
              disabled={loading}
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="submit"
                variant="contained" 
                color="primary"
                disabled={!file || loading}
                startIcon={<CloudUploadIcon />}
              >
                {loading ? 'Uploading...' : 'Upload Template'}
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </motion.form>
    </Box>
  );
};

export default TemplateUpload;