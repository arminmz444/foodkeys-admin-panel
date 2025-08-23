// src/components/ExcelTemplateManager/TemplateProcessor.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  TextField,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { processTemplate } from '../store/templateSlice';
import { selectCurrentTemplate } from '../store/templateSlice';

const TemplateProcessor = ({ onBack, isMobile }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const currentTemplate = useSelector(selectCurrentTemplate);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  
  const handleShowSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  
  const handleProcess = async () => {
    if (!currentTemplate) {
      handleShowSnackbar('لطفا ابتدا یک قالب را انتخاب کنید', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await dispatch(processTemplate(currentTemplate.id)).unwrap();
      handleShowSnackbar('قالب با موفقیت پردازش شد', 'success');
    } catch (error) {
      handleShowSnackbar('خطا در پردازش قالب', 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };
  
  if (!currentTemplate) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          لطفا یک قالب را برای پردازش انتخاب کنید
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'}>پردازش قالب</Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleProcess}
            disabled={isProcessing}
            size={isMobile ? 'small' : 'medium'}
          >
            {isProcessing ? 'در حال پردازش...' : 'پردازش قالب'}
          </Button>
        </motion.div>
      </Box>
      
      {isProcessing && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">نام قالب: {currentTemplate.name}</Typography>
          <Typography variant="body1">توضیحات: {currentTemplate.description}</Typography>
          <Typography variant="body1">وضعیت: {currentTemplate.status === 'processed' ? 'پردازش شده' : 'پردازش نشده'}</Typography>
        </Box>
      </Paper>
      
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
    </Box>
  );
};

export default TemplateProcessor;