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
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Download as DownloadIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import { 
  removeTemplate, 
  setCurrentTemplate, 
  downloadTemplate 
} from '../../store/slices/excelTemplateSlice';
import ConfirmDialog from '../common/ConfirmDialog';
import { downloadTemplate as downloadTemplateApi } from '../../services/excelTemplateService';

const ExcelTemplateList = ({ onUpload, onViewDetails, isMobile, isTablet }) => {
  const dispatch = useDispatch();
  const { templates, loading } = useSelector(state => state.excelTemplate);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

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
          toast.success('Template deleted successfully');
        })
        .catch((err) => {
          toast.error(`Failed to delete template: ${err.message || err}`);
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
      toast.error('Failed to download template');
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'}>Excel Templates</Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onUpload}
            size={isMobile ? 'small' : 'medium'}
          >
            Upload New
          </Button>
        </motion.div>
      </Box>

      {templates.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No templates found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Upload your first Excel template to get started
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onUpload}
            >
              Upload Template
            </Button>
          </motion.div>
        </Box>
      ) : isMobile ? (
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
                    Updated: {format(new Date(template.updatedAt), 'MMM d, yyyy')}
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
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {!isTablet && <TableCell>Original Filename</TableCell>}
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
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
                      <Tooltip title="Download">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDownload(template.id, template.originalFilename)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleViewDetails(template)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
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
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Template"
        message={`Are you sure you want to delete the template "${templateToDelete?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </Box>
  );
};

export default ExcelTemplateList;