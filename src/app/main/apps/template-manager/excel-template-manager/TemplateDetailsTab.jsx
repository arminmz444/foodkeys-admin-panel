import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Save as SaveIcon } from '@mui/icons-material';
import {
  updateTemplate,
  selectCurrentTemplate,
} from '../store/templateSlice';

function TemplateDetailsTab() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentTemplate = useSelector(selectCurrentTemplate);
  const [formData, setFormData] = useState({
    name: currentTemplate?.name || '',
    description: currentTemplate?.description || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentTemplate) {
      handleShowSnackbar('لطفا ابتدا یک قالب را انتخاب کنید', 'error');
      return;
    }

    try {
      await dispatch(updateTemplate({
        id: currentTemplate.id,
        ...formData,
      })).unwrap();
      handleShowSnackbar('اطلاعات قالب با موفقیت بروزرسانی شد', 'success');
    } catch (error) {
      handleShowSnackbar('خطا در بروزرسانی اطلاعات قالب', 'error');
    }
  };

  if (!currentTemplate) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          لطفا یک قالب را برای مشاهده جزئیات انتخاب کنید
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'}>جزئیات قالب</Typography>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  size={isMobile ? 'small' : 'medium'}
                >
                  ذخیره تغییرات
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

export default TemplateDetailsTab; 