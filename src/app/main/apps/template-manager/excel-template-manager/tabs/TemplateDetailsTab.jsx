// src/app/excel-templates/tabs/TemplateDetailsTab.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  IconButton,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
import FuseLoading from '@fuse/core/FuseLoading';
import { 
  useGetExcelTemplateQuery, 
  useUpdateExcelTemplateMutation,
  useDeleteExcelTemplateMutation,
  useLazyDownloadExcelTemplateQuery
} from '../store/ExcelTemplateApi';
import { ArrowRightIcon } from 'lucide-react';

function TemplateDetailsTab() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  // Fetch template details
  const { 
    data: template, 
    isLoading, 
    isError, 
    error 
  } = useGetExcelTemplateQuery(templateId);
  
  // Mutations
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateExcelTemplateMutation();
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteExcelTemplateMutation();
  const [downloadTemplate, { isLoading: isDownloading }] = useLazyDownloadExcelTemplateQuery();
  
  // Initialize edit form when template data is loaded
  React.useEffect(() => {
    if (template) {
      setEditName(template.name || '');
      setEditDescription(template.description || '');
    }
  }, [template]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(template?.name || '');
    setEditDescription(template?.description || '');
  };
  
  const handleSave = async () => {
    if (!editName.trim()) {
      // toast.error('Template name cannot be empty');
      return;
    }
    
    try {
      await updateTemplate({
        id: templateId,
        data: {
          name: editName,
          description: editDescription
        }
      }).unwrap();
      
      setIsEditing(false);
      // toast.success('Template updated successfully');
    } catch (err) {
      // toast.error(`Failed to update template: ${err.message || 'Unknown error'}`);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      try {
        await deleteTemplate(templateId).unwrap();
        // toast.success('Template deleted successfully');
        navigate('/apps/excel-templates/list');
      } catch (err) {
        // toast.error(`Failed to delete template: ${err.message || 'Unknown error'}`);
      }
    }
  };
  
  const handleDownload = async () => {
    try {
      const blob = await downloadTemplate(templateId).unwrap();
      
      // Create a blob URL
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', template?.originalFilename || 'template.xlsx');
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      // toast.error(`Failed to download template: ${err.message || 'Unknown error'}`);
    }
  };
  
  if (isLoading) {
    return <FuseLoading />;
  }
  
  if (isError) {
    return (
      <Box className="p-24 text-center">
        <Typography color="error">
          خطا در بارگذاری قالب: {error?.message || 'خطایی نامشخص'}
        </Typography>
        <Button 
          className="mt-16" 
          variant="outlined" 
          onClick={() => navigate('/apps/excel-templates/list')}
        >
          بازگشت به قالب ها
        </Button>
      </Box>
    );
  }
  
  if (!template) {
    return (
      <Box className="p-24 text-center">
        <Typography>قالبی یافت نشد</Typography>
        <Button 
          className="mt-16" 
          variant="outlined" 
          onClick={() => navigate('/apps/excel-templates/list')}
        >
          بازگشت به قالب ها
        </Button>
      </Box>
    );
  }
  
  return (
    <div className="w-full">
      <Box className="flex items-center mb-24">
        <IconButton onClick={() => navigate('/apps/excel-templates/list')} className="mr-8">
          <ArrowRightIcon />
        </IconButton>
        <Typography variant="h6">جزئیات قالب</Typography>
      </Box>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="p-24">
          <Box className="flex justify-between items-center mb-16">
            {isEditing ? (
              <TextField
                label="نام قالب"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                fullWidth
                variant="outlined"
                className="mb-16"
              />
            ) : (
              <Typography variant="h5">{template.name}</Typography>
            )}
            
            <Box>
              {isEditing ? (
                <div className="flex items-center ms-16">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={isUpdating}
                    startIcon={isUpdating ? <CircularProgress size={16} /> : <SaveIcon />}
                  >
                    ذخیره
                  </Button>
                  <Button 
                    onClick={handleCancelEdit} 
                    disabled={isUpdating}
                    className="mr-8"
                  >
                    لغو
                  </Button>
                 
                </div>
              ) : (
                <IconButton onClick={handleEdit} color="primary">
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          
          <Divider className="mb-24" />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="font-bold mb-8">
                اطلاعات فایل
              </Typography>
              <Typography variant="body1" className="mb-8">
                <b>نام فایل اصلی:</b> {template.originalFilename}
              </Typography>
              <Typography variant="body1" className="mb-8">
                <b>نوع محتوا:</b> {template.contentType}
              </Typography>
              <Typography variant="body1" className="mb-8">
                <b>ایجاد شده:</b> {new Date(template.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body1" className="mb-8">
                <b>آخرین به روز رسانی:</b> {new Date(template.updatedAt).toLocaleString()}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="font-bold mb-8">
                توضیحات
              </Typography>
              
              {isEditing ? (
                <TextField
                  label="توضیحات"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              ) : (
                <Typography variant="body1">
                  {template.description || 'توضیحاتی ارائه نشده است'}
                </Typography>
              )}
            </Grid>
          </Grid>
          
          <Box className="flex justify-between mt-32">
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
            >
              حذف قالب
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownload}
              disabled={isDownloading}
              startIcon={isDownloading ? <CircularProgress size={16} /> : <DownloadIcon />}
            >
              دانلود قالب
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </div>
  );
}

export default TemplateDetailsTab;