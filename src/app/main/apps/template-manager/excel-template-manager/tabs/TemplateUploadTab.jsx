// src/app/excel-templates/tabs/TemplateUploadTab.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

function TemplateUploadTab() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const handleShowSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
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
      setFileError('لطفا یک فایل اکسل معتبر انتخاب کنید (.xls یا .xlsx)');
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setFileError('لطفا یک فایل اکسل انتخاب کنید');
      return;
    }
    
    if (!name.trim()) {
      handleShowSnackbar('لطفا نام قالب را وارد کنید', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);

      const response = await axios.post('/template/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      handleShowSnackbar('قالب با موفقیت آپلود شد', 'success');
      navigate('/apps/excel-templates/list');
    } catch (err) {
      console.error('Upload error:', err);
      handleShowSnackbar(`خطا در آپلود قالب: ${err.response?.data?.message || err.message || 'خطای ناشناخته'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      <Box className="flex items-center mb-24">
        <IconButton onClick={() => navigate('/apps/excel-templates/list')} className="mr-8">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">آپلود قالب اکسل</Typography>
      </Box>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="p-24">
          <form onSubmit={handleSubmit}>
            <TextField
              label="نام قالب"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              className="mb-16"
            />
            
            <TextField
              label="توضیحات"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              className="mb-24"
            />
            
            <input
              type="file"
              id="template-file-upload"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            <label htmlFor="template-file-upload">
              <Paper
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-24 text-center cursor-pointer mb-24"
                elevation={fileError ? 0 : 1}
                style={{
                  border: '2px dashed',
                  borderColor: fileError ? 'red' : '#ccc'
                }}
              >
                <CloudUploadIcon fontSize="large" color="action" className="mb-8" />
                <Typography variant="subtitle1" className="mb-8">
                  {file ? file.name : 'برای انتخاب یا رها کردن فایل اکسل کلیک کنید'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  فقط فایل‌های .xls یا .xlsx پشتیبانی می‌شوند
                </Typography>
                {fileError && (
                  <Typography variant="caption" color="error" className="block mt-8">
                    {fileError}
                  </Typography>
                )}
              </Paper>
            </label>
            
            <Box className="flex justify-end">
              <Button
                onClick={() => navigate('/apps/excel-templates/list')}
                className="mr-8"
                disabled={isLoading}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isLoading || !file}
                startIcon={isLoading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
              >
                {isLoading ? 'در حال آپلود...' : 'آپلود قالب'}
              </Button>
            </Box>
          </form>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default TemplateUploadTab;