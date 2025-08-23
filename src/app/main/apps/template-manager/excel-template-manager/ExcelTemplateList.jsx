// src/components/ExcelTemplateManager/TemplateList.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Box, 
  Button, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Download as DownloadIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

import { 
  removeTemplate, 
  setCurrentTemplate
} from '../../store/slices/excelTemplateSlice';
import ConfirmDialog from '../common/ConfirmDialog';
import { downloadTemplate as downloadTemplateApi } from '../../services/excelTemplateService';

function ExcelTemplateList({ onUpload, onViewDetails, isMobile, isTablet }) {
  const dispatch = useDispatch();
  const { templates, loading } = useSelector(state => state.excelTemplate);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
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

  const handleViewDetails = (template) => {
    dispatch(setCurrentTemplate(template));
    onViewDetails(template);
  };

  const handleDeleteClick = (template) => {
    setTemplateToDelete(template);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      dispatch(removeTemplate(templateToDelete.id))
        .unwrap()
        .then(() => {
          handleShowSnackbar('قالب با موفقیت حذف شد', 'success');
        })
        .catch((err) => {
          handleShowSnackbar(`خطا در حذف قالب: ${err.message || err}`, 'error');
        });
    }
    setDeleteConfirmOpen(false);
  };

  const handleDownload = async (id, filename) => {
    try {
      const blob = await downloadTemplateApi(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      handleShowSnackbar('خطا در دانلود قالب', 'error');
    }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        هیچ قالبی یافت نشد
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        برای شروع، اولین قالب اکسل خود را آپلود کنید
      </Typography>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onUpload}
        >
          آپلود قالب
        </Button>
      </motion.div>
    </Box>
  );

  const renderMobileList = () => (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {templates.map(template => (
        <motion.div key={template.id} variants={itemVariants}>
          <Card sx={{ mb: 2 }} elevation={2}>
            <CardContent>
              <Typography variant="h6" noWrap>{template.name}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {template.originalFilename}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                آخرین بروزرسانی: {format(new Date(template.updatedAt), 'MMM d, yyyy')}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <IconButton 
                size="small" 
                onClick={() => handleDownload(template.id, template.originalFilename)}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton 
                size="small" 
                color="primary" 
                onClick={() => handleViewDetails(template)}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => handleDeleteClick(template)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderDesktopTable = () => (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>نام</TableCell>
            {!isTablet && <TableCell>نام فایل اصلی</TableCell>}
            <TableCell>آخرین بروزرسانی</TableCell>
            <TableCell align="right">عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            component="tbody"
          >
            {templates.map(template => (
              <motion.tr
                key={template.id}
                variants={itemVariants}
                component={TableRow}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="td">{template.name}</TableCell>
                {!isTablet && <TableCell>{template.originalFilename}</TableCell>}
                <TableCell>
                  {format(new Date(template.updatedAt), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="دانلود">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDownload(template.id, template.originalFilename)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="مشاهده جزئیات">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleViewDetails(template)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="حذف">
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteClick(template)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </motion.tr>
            ))}
          </motion.div>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderContent = () => {
    if (templates.length === 0) {
      return renderEmptyState();
    }
    
    if (isMobile) {
      return renderMobileList();
    }
    
    return renderDesktopTable();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'}>قالب‌های اکسل</Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onUpload}
            size={isMobile ? 'small' : 'medium'}
          >
            آپلود جدید
          </Button>
        </motion.div>
      </Box>

      {renderContent()}

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="حذف قالب"
        message={`آیا از حذف قالب "${templateToDelete?.name}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

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

export default ExcelTemplateList;