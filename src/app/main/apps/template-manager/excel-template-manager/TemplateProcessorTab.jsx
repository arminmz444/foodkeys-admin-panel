import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import {
  processTemplate,
  downloadProcessedTemplate,
  selectCurrentTemplate,
} from '../store/templateSlice';

function TemplateProcessorTab() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const handleDownload = async () => {
    if (!currentTemplate) {
      handleShowSnackbar('لطفا ابتدا یک قالب را انتخاب کنید', 'error');
      return;
    }

    try {
      const response = await dispatch(downloadProcessedTemplate(currentTemplate.id)).unwrap();
      
      // Create a blob from the response data
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = currentTemplate.originalFilename || 'processed_template.xlsx';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      handleShowSnackbar('قالب با موفقیت دانلود شد', 'success');
    } catch (error) {
      console.error('Download error:', error);
      handleShowSnackbar('خطا در دانلود قالب', 'error');
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
        <Box sx={{ display: 'flex', gap: 2 }}>
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={isProcessing}
              size={isMobile ? 'small' : 'medium'}
            >
              دانلود قالب پردازش شده
            </Button>
          </motion.div>
        </Box>
      </Box>

      {isProcessing && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>نام قالب</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{currentTemplate.name}</TableCell>
                <TableCell>
                  {currentTemplate.status === 'processed' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon color="success" />
                      <Typography>پردازش شده</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ErrorIcon color="error" />
                      <Typography>پردازش نشده</Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="دانلود قالب پردازش شده">
                      <IconButton
                        color="primary"
                        onClick={handleDownload}
                        disabled={isProcessing || currentTemplate.status !== 'processed'}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="پردازش مجدد">
                      <IconButton
                        color="primary"
                        onClick={handleProcess}
                        disabled={isProcessing}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
}

export default TemplateProcessorTab; 