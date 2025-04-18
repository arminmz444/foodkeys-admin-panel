import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  Tabs, 
  Tab, 
  Divider, 
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Grid
} from '@mui/material';
import { 
  Close as CloseIcon, 
  GetApp as DownloadIcon, 
  RestoreFromTrash as RestoreIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

function ArchiveDetailsDialog({ 
  open, 
  onClose, 
  archive,
  onRollback,
  onDelete
}) {
  const [activeTab, setActiveTab] = useState(0);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'PPpp', { locale: faIR });
    } catch (e) {
      return dateString;
    }
  };
  
  // Download archive content
  const handleDownload = () => {
    if (!archive) return;
    
    try {
      let content;
      if (archive.base64Data) {
        content = atob(archive.base64Data);
      } else if (typeof archive.content === 'object') {
        content = JSON.stringify(archive.content, null, 2);
      } else if (archive.content) {
        content = archive.content;
      } else {
        content = JSON.stringify(archive, null, 2);
      }
      
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = archive.fileName || `archive-${archive.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading archive:', error);
    }
  };
  
  if (!archive) {
    return null;
  }
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box className="flex justify-between items-center">
          <Typography variant="h6">
            {archive?.name || 'جزئیات آرشیو'}
          </Typography>
          <Box className="flex items-center gap-2">
            <Tooltip title="دانلود آرشیو">
              <IconButton onClick={handleDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="بازگشت به این آرشیو">
              <IconButton onClick={onRollback}>
                <RestoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="حذف آرشیو">
              <IconButton onClick={onDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {/* Archive info */}
        <Paper className="p-16 mb-24">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box className="flex flex-col gap-8">
                <Box className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">نام آرشیو:</Typography>
                  <Typography variant="body1">{archive.name || '-'}</Typography>
                </Box>
                <Box className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">نوع موجودیت:</Typography>
                  <Chip label={archive.entityType || archive.metadata?.entityType || '-'} color="default" size="small" />
                </Box>
                <Box className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">شناسه موجودیت:</Typography>
                  <Typography variant="body1">{archive.entityId || archive.metadata?.entityId || '-'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="flex flex-col gap-8">
                <Box className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">نوع آرشیو:</Typography>
                  <Chip label={archive.archiveType || archive.metadata?.archiveType || '-'} color="primary" size="small" />
                </Box>
                <Box className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">تاریخ ایجاد:</Typography>
                  <Typography variant="body1">{formatDate(archive.createdAt)}</Typography>
                </Box>
                <Box className="flex justify-between items-center">
                  <Typography variant="body2" color="textSecondary">ایجاد کننده:</Typography>
                  <Typography variant="body1">{archive.createdBy || '-'}</Typography>
                </Box>
              </Box>
            </Grid>
            
            {archive.description && (
              <Grid item xs={12}>
                <Box className="mt-8">
                  <Typography variant="body2" color="textSecondary" className="mb-4">توضیحات:</Typography>
                  <Typography variant="body2">{archive.description}</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
        
        {/* Content tabs */}
        <Paper>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="محتوا" />
            <Tab label="متادیتا" />
          </Tabs>
          <Divider />
          
          <Box className="p-16">
            {activeTab === 0 && (
              <Box>
                <Typography variant="subtitle1" className="mb-8">محتوای آرشیو:</Typography>
                <Paper variant="outlined" className="p-16">
                  <pre className="overflow-auto max-h-96">
                    {archive.base64Data 
                      ? atob(archive.base64Data).substring(0, 5000) + (atob(archive.base64Data).length > 5000 ? '...' : '')
                      : archive.content 
                        ? typeof archive.content === 'object' 
                          ? JSON.stringify(archive.content, null, 2)
                          : String(archive.content).substring(0, 5000) + (String(archive.content).length > 5000 ? '...' : '')
                        : 'بدون محتوا'}
                  </pre>
                </Paper>
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box>
                <Typography variant="subtitle1" className="mb-8">اطلاعات متادیتا:</Typography>
                {archive.metadata && Object.keys(archive.metadata).length > 0 ? (
                  <Paper variant="outlined">
                    <Box className="p-0">
                      {Object.entries(archive.metadata).map(([key, value]) => (
                        <Box 
                          key={key}
                          className="flex justify-between p-8 border-b"
                        >
                          <Typography variant="body2" className="font-medium">{key}:</Typography>
                          <Typography variant="body2">{value}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                ) : (
                  <Typography variant="body2" color="textSecondary" className="text-center py-16">
                    هیچ متادیتایی وجود ندارد
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ArchiveDetailsDialog;