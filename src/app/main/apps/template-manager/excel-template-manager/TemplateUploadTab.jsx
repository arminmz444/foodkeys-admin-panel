import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { uploadTemplate } from '../store/templateSlice';

function TemplateUploadTab() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null,
  });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        handleShowSnackbar('لطفا فقط فایل‌های اکسل را آپلود کنید', 'error');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      handleShowSnackbar('لطفا یک فایل اکسل را انتخاب کنید', 'error');
      return;
    }

    if (!formData.name) {
      handleShowSnackbar('لطفا نام قالب را وارد کنید', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('file', formData.file);

      await dispatch(uploadTemplate(formDataToSend)).unwrap();
      handleShowSnackbar('قالب با موفقیت آپلود شد', 'success');
      setFormData({
        name: '',
        description: '',
        file: null,
      });
    } catch (error) {
      handleShowSnackbar('خطا در آپلود قالب', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'}>آپلود قالب جدید</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="نام قالب"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="توضیحات"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1">فایل قالب</Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                size={isMobile ? 'small' : 'medium'}
              >
                انتخاب فایل
                <input
                  type="file"
                  hidden
                  accept=".xlsx"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.file && (
                <Typography variant="body2" color="text.secondary">
                  {formData.file.name}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  size={isMobile ? 'small' : 'medium'}
                >
                  آپلود قالب
                </Button>
              </motion.div>
            </Box>
          </Box>
        </form>
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

export default TemplateUploadTab; 