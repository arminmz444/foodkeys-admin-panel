import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  Divider, 
  Tabs, 
  Tab, 
  IconButton,
  Tooltip,
  Paper,
  Alert,
  Snackbar,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { useGetArchiveByIdQuery, useDeleteArchiveMutation, useRollbackToArchiveMutation } from './store/archiveApi';
import ArchiveMetadata from './ArchiveMetadata';
import ArchiveContent from './ArchiveContent';
import ArchivePreview from './ArchivePreview';
import ConfirmDialog from './ConfirmDialog';

function ArchiveDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { archiveId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const { data: archive, isLoading, error } = useGetArchiveByIdQuery(archiveId);
  const [deleteArchive, { isLoading: isDeleting }] = useDeleteArchiveMutation();
  const [rollbackToArchive, { isLoading: isRollingBack }] = useRollbackToArchiveMutation();
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle rollback
  const handlePrepareRollback = () => {
    setConfirmAction({
      type: 'rollback',
      archiveId: archiveId
    });
    setConfirmDialogOpen(true);
  };
  
  // Handle delete
  const handlePrepareDelete = () => {
    setConfirmAction({
      type: 'delete',
      archiveId: archiveId,
      name: archive?.name
    });
    setConfirmDialogOpen(true);
  };
  
  // Execute rollback
  const handleRollback = async () => {
    if (!confirmAction) return;
    
    try {
      await rollbackToArchive({
        archiveId: confirmAction.archiveId,
        reason: 'بازگشت دستی توسط ادمین'
      }).unwrap();
      
      handleShowSnackbar(`بازگشت به آرشیو با موفقیت انجام شد`, 'success');
    } catch (error) {
      handleShowSnackbar(`خطا در بازگشت به آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };
  
  // Execute delete
  const handleDelete = async () => {
    if (!confirmAction) return;
    
    try {
      await deleteArchive(confirmAction.archiveId).unwrap();
      handleShowSnackbar(`آرشیو با موفقیت حذف شد`, 'success');
      
      // Navigate back to archive list
      navigate('/apps/archive');
    } catch (error) {
      handleShowSnackbar(`خطا در حذف آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };
  
  // Download archive content
  const handleDownload = () => {
    if (!archive) return;
    
    try {
      // Convert content to JSON string with proper formatting
      const content = typeof archive.content === 'object' 
        ? JSON.stringify(archive.content, null, 2)
        : archive.base64Data 
          ? atob(archive.base64Data) 
          : JSON.stringify({ error: 'No content available' });
      
      // Create blob and download link
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = archive.fileName || `archive-${archiveId}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      handleShowSnackbar('دانلود آرشیو با موفقیت انجام شد', 'success');
    } catch (error) {
      handleShowSnackbar(`خطا در دانلود آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    }
  };
  
  // Copy archive ID to clipboard
  const handleCopyId = () => {
    if (!archiveId) return;
    
    try {
      navigator.clipboard.writeText(archiveId);
      handleShowSnackbar('شناسه آرشیو کپی شد', 'success');
    } catch (error) {
      handleShowSnackbar(`خطا در کپی شناسه آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    }
  };
  
  // Show snackbar
  const handleShowSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp', { locale: faIR });
    } catch (e) {
      return dateString || '-';
    }
  };
  
  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-24 px-24 md:px-32">
      <div className="flex flex-col sm:flex-row items-center">
        <Button
          variant="text"
          color="inherit"
          className="mb-16 sm:mb-0 sm:mr-8"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
        >
          بازگشت
        </Button>
        <div className="flex flex-col items-center sm:items-start">
          <Typography className="text-16 sm:text-20 font-bold truncate">
            {archive?.name || 'جزئیات آرشیو'}
          </Typography>
          <Box className="flex items-center mt-4">
            <Typography className="text-12 truncate" color="textSecondary">
              شناسه: {archiveId}
            </Typography>
            <Tooltip title="کپی شناسه">
              <IconButton size="small" onClick={handleCopyId}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Tooltip title="دانلود آرشیو">
          <IconButton onClick={handleDownload} disabled={isLoading || !archive}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="بازگشت به این آرشیو">
          <IconButton onClick={handlePrepareRollback} disabled={isLoading || !archive}>
            <RestoreIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="حذف آرشیو">
          <IconButton 
            onClick={handlePrepareDelete} 
            disabled={isLoading || !archive}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
  
  const renderContent = () => {
    // Loading state
    if (isLoading || isDeleting || isRollingBack) {
      return (
        <Box className="w-full p-24 flex justify-center">
          <CircularProgress />
        </Box>
      );
    }
    
    // Error state
    if (error) {
      return (
        <Box className="w-full p-24">
          <Alert severity="error">
            خطا در بارگذاری اطلاعات آرشیو: {error.message || 'خطای ناشناخته'}
          </Alert>
        </Box>
      );
    }
    
    // Archive not found
    if (!archive) {
      return (
        <Box className="w-full p-24">
          <Alert severity="warning">
            آرشیو مورد نظر یافت نشد.
          </Alert>
          <Button
            className="mt-16"
            variant="contained"
            onClick={() => navigate('/apps/archive')}
          >
            بازگشت به لیست آرشیوها
          </Button>
        </Box>
      );
    }
    
    return (
      <div className="w-full p-24">
        {/* Archive info card */}
        <Card className="mb-24">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box className="flex flex-col gap-8">
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" color="textSecondary">نام آرشیو:</Typography>
                    <Typography variant="body1">{archive.name || '-'}</Typography>
                  </Box>
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" color="textSecondary">نوع موجودیت:</Typography>
                    <Chip label={archive.entityType || '-'} color="default" />
                  </Box>
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" color="textSecondary">شناسه موجودیت:</Typography>
                    <Typography variant="body1">{archive.entityId || '-'}</Typography>
                  </Box>
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" color="textSecondary">ایجاد کننده:</Typography>
                    <Typography variant="body1">{archive.createdBy || '-'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className="flex flex-col gap-8">
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" color="textSecondary">نوع آرشیو:</Typography>
                    <Chip label={archive.archiveType || '-'} color="primary" />
                  </Box>
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" color="textSecondary">تاریخ ایجاد:</Typography>
                    <Typography variant="body1">{formatDate(archive.createdAt)}</Typography>
                  </Box>
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" color="textSecondary">نوع محتوا:</Typography>
                    <Typography variant="body1">{archive.contentType || '-'}</Typography>
                  </Box>
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" color="textSecondary">حجم:</Typography>
                    <Typography variant="body1">
                      {archive.sizeInBytes ? `${Math.round(archive.sizeInBytes / 1024)} کیلوبایت` : '-'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        {/* Tabs */}
        <Paper className="mb-24">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="پیش‌نمایش" />
            <Tab label="داده‌ها" />
            <Tab label="متادیتا" />
          </Tabs>
          <Divider />
          
          <Box className="p-24">
            {activeTab === 0 && <ArchivePreview archive={archive} />}
            {activeTab === 1 && <ArchiveContent archive={archive} />}
            {activeTab === 2 && <ArchiveMetadata archive={archive} />}
          </Box>
        </Paper>
      </div>
    );
  };
  
  return (
    <>
      <FusePageCarded
        header={renderHeader()}
        content={renderContent()}
        scroll={isMobile ? 'normal' : 'content'}
      />
      
      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title={confirmAction?.type === 'delete' ? 'حذف آرشیو' : 'بازگشت به آرشیو'}
        content={
          confirmAction?.type === 'delete'
            ? `آیا از حذف آرشیو "${confirmAction?.name}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`
            : `آیا از بازگشت به آرشیو اطمینان دارید؟ این عمل ممکن است اطلاعات فعلی موجودیت را تغییر دهد.`
        }
        confirmText={confirmAction?.type === 'delete' ? 'حذف' : 'بازگشت'}
        cancelText="انصراف"
        confirmColor={confirmAction?.type === 'delete' ? 'error' : 'primary'}
        onConfirm={confirmAction?.type === 'delete' ? handleDelete : handleRollback}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setConfirmAction(null);
        }}
      />
      
      {/* Snackbar */}
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
    </>
  );
}

export default ArchiveDetailsPage;