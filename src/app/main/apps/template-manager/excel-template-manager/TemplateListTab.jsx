import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  deleteTemplate,
  downloadTemplate,
  selectTemplates,
} from '../store/templateSlice';

function TemplateListTab() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const templates = useSelector(selectTemplates);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
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

  const handleDeleteClick = (template) => {
    setTemplateToDelete(template);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    try {
      await dispatch(deleteTemplate(templateToDelete.id)).unwrap();
      handleShowSnackbar('قالب با موفقیت حذف شد', 'success');
    } catch (error) {
      handleShowSnackbar('خطا در حذف قالب', 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleDownload = async (template) => {
    try {
      const response = await dispatch(downloadTemplate(template.id)).unwrap();
      
      // Create a blob URL
      const url = window.URL.createObjectURL(new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }));
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', template.originalFilename || 'template.xlsx');
      link.setAttribute('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
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

  if (templates.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          هیچ قالبی یافت نشد
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'}>لیست قالب‌ها</Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>نام قالب</TableCell>
                <TableCell>توضیحات</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow dir="rtl" key={template.id}>
                  <TableCell align="right" textAlign="right">{template.name}</TableCell>
                  <TableCell align="right" textAlign="right">{template.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="دانلود">
                        <IconButton
                          color="primary"
                          onClick={() => handleDownload(template)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="حذف">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(template)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
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

export default TemplateListTab; 