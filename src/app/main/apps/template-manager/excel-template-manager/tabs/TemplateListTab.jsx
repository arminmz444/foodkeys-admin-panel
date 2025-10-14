// src/app/excel-templates/tabs/TemplateListTab.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Download as DownloadIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
import FuseLoading from '@fuse/core/FuseLoading';
import { 
  useGetExcelTemplatesQuery, 
  useDeleteExcelTemplateMutation,
  useLazyDownloadExcelTemplateQuery
} from '../store/ExcelTemplateApi';

function TemplateListTab() {
  const navigate = useNavigate();
  
  // Query hook to fetch templates list
  const { 
    data: templates = [], 
    isLoading, 
    isError, 
    error 
  } = useGetExcelTemplatesQuery();
  
  // Mutation hook for deleting a template
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteExcelTemplateMutation();
  
  // Lazy query hook for downloading a template
  const [downloadTemplate, { isLoading: isDownloading }] = useLazyDownloadExcelTemplateQuery();
  
  const handleViewDetails = (templateId) => {
    navigate(`/apps/excel-templates/details/${templateId}`);
  };
  
  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(templateId).unwrap();
        // toast.success('Template deleted successfully');
      } catch (err) {
        // toast.error(`Failed to delete template: ${err.message || 'Unknown error'}`);
      }
    }
  };
  
  const handleDownloadTemplate = async (templateId, filename) => {
    try {
      const blob = await downloadTemplate(templateId).unwrap();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // toast.error(`Failed to download template: ${err.message || 'Unknown error'}`);
    }
  };
  
  const handleAddTemplate = () => {
    navigate('/apps/excel-templates/upload');
  };
  
  if (isLoading) {
    return <FuseLoading />;
  }
  
  if (isError) {
    return (
      <Box className="p-24 flex justify-center">
        <Typography color="error">Error loading templates: {error?.message || 'Unknown error'}</Typography>
      </Box>
    );
  }
  
  return (
    <div className="w-full">
      <Box className="flex justify-between items-center mb-16">
        <Typography variant="h6">قالب های اکسل</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleAddTemplate}
        >
          افزودن قالب جدید
        </Button>
      </Box>
      
      {templates.length === 0 ? (
        <Paper className="p-24 text-center">
          <Typography variant="subtitle1" className="mb-16">هیچ قالبی یافت نشد</Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={handleAddTemplate}
          >
            Upload Your First Template
          </Button>
        </Paper>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>نام قالب</TableCell>
                  <TableCell>نام فایل اصلی</TableCell>
                  <TableCell>آخرین به روز رسانی</TableCell>
                  <TableCell align="right">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.originalFilename}</TableCell>
                    <TableCell>
                      {new Date(template.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDownloadTemplate(template.id, template.originalFilename)}
                        disabled={isDownloading}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleViewDetails(template.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteTemplate(template.id)}
                        disabled={isDeleting}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}
    </div>
  );
}

export default TemplateListTab;