// src/app/excel-templates/components/CustomTemplateHeader.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Button, 
  Typography, 
  Box, 
  IconButton, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
import { 
  useDeleteExcelTemplateMutation,
  useLazyDownloadExcelTemplateQuery
} from '../store/ExcelTemplateApi';

function CustomTemplateHeader({ template }) {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteExcelTemplateMutation();
  const [downloadTemplate, { isLoading: isDownloading }] = useLazyDownloadExcelTemplateQuery();

  const handleBack = () => {
    navigate('/apps/excel-templates/list');
  };

  const handleEdit = () => {
    navigate(`/apps/excel-templates/details/${templateId}`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTemplate(templateId).unwrap();
      // toast.success('Template deleted successfully');
      navigate('/apps/excel-templates/list');
    } catch (err) {
      // toast.error(`Failed to delete template: ${err.message || 'Unknown error'}`);
    }
    setDeleteDialogOpen(false);
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadTemplate(templateId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = template.originalFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      // toast.success('Template downloaded successfully');
    } catch (error) {
      // toast.error('Failed to download template');
    }
  };

  if (!template) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
      <div className="flex flex-row items-center w-full">
        <IconButton 
          onClick={handleBack}
          size="large"
          edge="start"
          color="inherit"
          aria-label="back"
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <div className="flex flex-col">
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography
              variant="h4"
              className="text-20 md:text-32 font-extrabold tracking-tight"
            >
              {template.name}
            </Typography>
          </motion.div>
          <Typography variant="subtitle1" color="text.secondary">
            {template.originalFilename}
          </Typography>
        </div>
      </div>
      
      <div className="flex flex-row items-center justify-end space-x-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
        >
          <Tooltip title="Download Template">
            <IconButton 
              onClick={handleDownload} 
              color="primary" 
              disabled={isDownloading}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }}
        >
          <Tooltip title="Edit Template">
            <IconButton onClick={handleEdit} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
        >
          <Tooltip title="Delete Template">
            <IconButton 
              onClick={handleDelete} 
              color="error" 
              disabled={isDeleting}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </motion.div>
      </div>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Template
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the template "{template.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            autoFocus
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CustomTemplateHeader;