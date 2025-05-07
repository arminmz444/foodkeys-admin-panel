// src/components/ExcelTemplateManager/TemplateManager.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Paper, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TemplateList from './TemplateList';
import TemplateUpload from './TemplateUpload';
import TemplateDetails from './TemplateDetails';
import { fetchTemplates } from '../../store/slices/excelTemplateSlice';

const ExcelTemplateManager = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeView, setActiveView] = useState('list'); // 'list', 'upload', 'details'
  
  const { templates, loading, error, currentTemplate } = useSelector(state => state.excelTemplate);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message || error}`);
    }
  }, [error]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <Container maxWidth="lg">
      <ToastContainer position="top-center" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            mt: 4, 
            textAlign: 'center',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}
        >
          Excel Template Manager
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: isMobile ? 2 : 3, 
            mt: 3, 
            minHeight: '70vh',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ height: '100%' }}>
            <AnimatePresence mode="wait">
              {activeView === 'list' && (
                <motion.div
                  key="list"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  style={{ height: '100%' }}
                >
                  <TemplateList 
                    onUpload={() => setActiveView('upload')}
                    onViewDetails={(template) => setActiveView('details')}
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                </motion.div>
              )}

              {activeView === 'upload' && (
                <motion.div
                  key="upload"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                >
                  <TemplateUpload 
                    onCancel={() => setActiveView('list')}
                    onSuccess={() => setActiveView('list')}
                    isMobile={isMobile}
                  />
                </motion.div>
              )}

              {activeView === 'details' && currentTemplate && (
                <motion.div
                  key="details"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                >
                  <TemplateDetails 
                    onBack={() => setActiveView('list')}
                    isMobile={isMobile}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ExcelTemplateManager;