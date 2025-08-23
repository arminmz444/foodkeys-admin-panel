// src/components/ExcelTemplateManager/TemplateManager.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TemplateList from './TemplateList';
import TemplateUpload from './TemplateUpload';
import TemplateDetails from './TemplateDetails';
import TemplateProcessorTab from './TemplateProcessorTab';
import { fetchTemplates } from '../../store/slices/excelTemplateSlice';
import { selectCurrentTemplate } from '../store/templateSlice';

const ExcelTemplateManager = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const { templates, loading, error } = useSelector(state => state.excelTemplate);
  const currentTemplate = useSelector(selectCurrentTemplate);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      handleShowSnackbar(`Error: ${error.message || error}`, 'error');
    }
  }, [error]);

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <Container maxWidth="xl">
      <ToastContainer position="top-center" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            height: '100%',
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <Box sx={{ height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isMobile ? 'fullWidth' : 'standard'}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="لیست قالب‌ها" />
                <Tab label="آپلود قالب" />
                {currentTemplate && (
                  <>
                    <Tab label="جزئیات قالب" />
                    <Tab label="پردازش قالب" />
                  </>
                )}
              </Tabs>
            </Box>

            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div
                  key="list"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                >
                  <TemplateList 
                    onUpload={() => setActiveTab(1)}
                    onViewDetails={(template) => setActiveTab(2)}
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  key="upload"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                >
                  <TemplateUpload 
                    onCancel={() => setActiveTab(0)}
                    onSuccess={() => setActiveTab(0)}
                    isMobile={isMobile}
                  />
                </motion.div>
              )}

              {activeTab === 2 && currentTemplate && (
                <motion.div
                  key="details"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                >
                  <TemplateDetails 
                    onBack={() => setActiveTab(0)}
                    isMobile={isMobile}
                  />
                </motion.div>
              )}

              {activeTab === 3 && currentTemplate && (
                <motion.div
                  key="processor"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                >
                  <TemplateProcessorTab />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
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
    </Container>
  );
};

export default ExcelTemplateManager;