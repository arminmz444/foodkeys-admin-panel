import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  Divider, 
  Paper, 
  Alert, 
  Snackbar, 
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  PlayArrow as ProcessIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { 
  useGetArchiveTaskByIdQuery, 
  useProcessArchiveTaskMutation, 
  useCancelArchiveTaskMutation, 
  useDeleteArchiveTaskMutation 
} from './store/archiveApi';
import ConfirmDialog from './ConfirmDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../../shared-components/ErrorFallback';

function ArchiveTaskDetailsPage() {
  const navigate = useNavigate();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { taskId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Fetch task data
  const { data: task, isLoading, error, refetch } = useGetArchiveTaskByIdQuery(taskId);
  
  // Mutations
  const [processTask, { isLoading: isProcessing }] = useProcessArchiveTaskMutation();
  const [cancelTask, { isLoading: isCanceling }] = useCancelArchiveTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteArchiveTaskMutation();
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Prepare process task
  const handlePrepareProcess = () => {
    setConfirmAction({
      type: 'process',
      title: 'پردازش وظیفه آرشیو',
      message: 'آیا از پردازش این وظیفه آرشیو اطمینان دارید؟',
      confirmText: 'پردازش',
      confirmColor: 'primary'
    });
    setConfirmDialogOpen(true);
  };
  
  // Prepare cancel task
  const handlePrepareCancel = () => {
    setConfirmAction({
      type: 'cancel',
      title: 'لغو وظیفه آرشیو',
      message: 'آیا از لغو این وظیفه آرشیو اطمینان دارید؟',
      confirmText: 'لغو',
      confirmColor: 'warning'
    });
    setConfirmDialogOpen(true);
  };
  
  // Prepare delete task
  const handlePrepareDelete = () => {
    setConfirmAction({
      type: 'delete',
      title: 'حذف وظیفه آرشیو',
      message: 'آیا از حذف این وظیفه آرشیو اطمینان دارید؟ این عملیات غیر قابل بازگشت است.',
      confirmText: 'حذف',
      confirmColor: 'error'
    });
    setConfirmDialogOpen(true);
  };
  
  // Process task
  const handleProcessTask = async () => {
    try {
      await processTask(taskId).unwrap();
      handleShowSnackbar('وظیفه آرشیو با موفقیت به صف پردازش اضافه شد', 'success');
      refetch();
    } catch (error) {
      handleShowSnackbar(`خطا در پردازش وظیفه آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    }
    setConfirmDialogOpen(false);
  };
  
  // Cancel task
  const handleCancelTask = async () => {
    try {
      await cancelTask(taskId).unwrap();
      handleShowSnackbar('وظیفه آرشیو با موفقیت لغو شد', 'success');
      refetch();
    } catch (error) {
      handleShowSnackbar(`خطا در لغو وظیفه آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    }
    setConfirmDialogOpen(false);
  };
  
  // Delete task
  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskId).unwrap();
      handleShowSnackbar('وظیفه آرشیو با موفقیت حذف شد', 'success');
      // Navigate back to the list after deletion
      navigate('/apps/archive-tasks');
    } catch (error) {
      handleShowSnackbar(`خطا در حذف وظیفه آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    }
    setConfirmDialogOpen(false);
  };
  
  // Handle confirm action
  const handleConfirmAction = () => {
    if (!confirmAction) return;
    
    switch (confirmAction.type) {
      case 'process':
        handleProcessTask();
        break;
      case 'cancel':
        handleCancelTask();
        break;
      case 'delete':
        handleDeleteTask();
        break;
      default:
        setConfirmDialogOpen(false);
    }
  };
  
  // Navigate to result archive
  const handleViewResultArchive = () => {
    if (task?.resultArchiveId) {
      navigate(`/apps/archive/${task.resultArchiveId}`);
    } else {
      handleShowSnackbar('این وظیفه هنوز آرشیوی تولید نکرده است', 'warning');
    }
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
  
  // Show snackbar
  const handleShowSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Get status chip color and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING':
        return { color: 'default', text: 'در انتظار پردازش' };
      case 'PROCESSING':
        return { color: 'info', text: 'در حال پردازش' };
      case 'COMPLETED':
        return { color: 'success', text: 'تکمیل شده' };
      case 'FAILED':
        return { color: 'error', text: 'خطا' };
      case 'CANCELED':
        return { color: 'warning', text: 'لغو شده' };
      default:
        return { color: 'default', text: status };
    }
  };
  
  // Header component
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
            {task?.name || 'جزئیات وظیفه آرشیو'}
          </Typography>
          <Typography className="text-12 truncate" color="textSecondary">
            شناسه: {taskId}
          </Typography>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {task?.status === 'PENDING' && (
          <Tooltip title="پردازش وظیفه">
            <IconButton 
              onClick={handlePrepareProcess} 
              disabled={isLoading || isProcessing}
              color="primary"
            >
              <ProcessIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {(task?.status === 'PENDING' || task?.status === 'PROCESSING') && (
          <Tooltip title="لغو وظیفه">
            <IconButton 
              onClick={handlePrepareCancel} 
              disabled={isLoading || isCanceling}
              color="warning"
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {task?.resultArchiveId && (
          <Tooltip title="مشاهده آرشیو">
            <IconButton onClick={handleViewResultArchive}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title="حذف وظیفه">
          <IconButton 
            onClick={handlePrepareDelete} 
            disabled={isLoading || isDeleting}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
  
  // Content component
  const renderContent = () => {
    // Loading state
    if (isLoading || isProcessing || isCanceling || isDeleting) {
      return (
        <Box className="flex justify-center items-center p-32">
          <CircularProgress />
        </Box>
      );
    }
    
    // Error state
    if (error) {
      return (
        <Box className="p-24">
          <Alert severity="error" className="mb-16">
            خطا در بارگذاری اطلاعات وظیفه آرشیو: {error.message || 'خطای ناشناخته'}
          </Alert>
          <Button variant="contained" color="primary" onClick={refetch}>
            تلاش مجدد
          </Button>
        </Box>
      );
    }
    
    // Task not found
    if (!task) {
      return (
        <Box className="p-24">
          <Alert severity="warning">
            وظیفه آرشیو مورد نظر یافت نشد
          </Alert>
          <Button 
            variant="contained" 
            color="primary" 
            className="mt-16"
            onClick={() => navigate('/apps/archive-tasks')}
          >
            بازگشت به لیست وظایف
          </Button>
        </Box>
      );
    }
    
    // Task details
    const statusInfo = getStatusInfo(task.status);
    
    return (
      <Box className="p-24">
        {/* Task info card */}
        <Paper className="p-16 mb-32">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className="flex flex-col space-y-16">
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">نام وظیفه:</Typography>
                  <Typography variant="body2">{task.name}</Typography>
                </Box>
                
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">نوع موجودیت:</Typography>
                  <Typography variant="body2">{task.entityName}</Typography>
                </Box>
                
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">شناسه موجودیت:</Typography>
                  <Typography variant="body2">{task.entityId}</Typography>
                </Box>
                
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">وضعیت:</Typography>
                  <Chip 
                    label={statusInfo.text} 
                    color={statusInfo.color} 
                    size="small"
                  />
                </Box>
                
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">ایجاد کننده:</Typography>
                  <Typography variant="body2">{task.createdBy || '-'}</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className="flex flex-col space-y-16">
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">نوع آرشیو:</Typography>
                  <Typography variant="body2">{task.archiveType}</Typography>
                </Box>
                
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">تاریخ ایجاد:</Typography>
                  <Typography variant="body2">{formatDate(task.createdAt)}</Typography>
                </Box>
                
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">آخرین بروزرسانی:</Typography>
                  <Typography variant="body2">{formatDate(task.updatedAt)}</Typography>
                </Box>
                
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">تاریخ تکمیل:</Typography>
                  <Typography variant="body2">{formatDate(task.completedAt)}</Typography>
                </Box>
                
                <Box className="flex justify-between items-center">
                  <Typography variant="subtitle2">شناسه آرشیو نتیجه:</Typography>
                  {task.resultArchiveId ? (
                    <Button 
                      variant="text" 
                      color="primary" 
                      size="small"
                      onClick={handleViewResultArchive}
                    >
                      {task.resultArchiveId.substring(0, 8)}...
                    </Button>
                  ) : (
                    <Typography variant="body2">-</Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            
            {task.description && (
              <Grid item xs={12}>
                <Box className="mt-8">
                  <Typography variant="subtitle2">توضیحات:</Typography>
                  <Typography variant="body2" className="mt-8 whitespace-pre-wrap">
                    {task.description}
                  </Typography>
                </Box>
              </Grid>
            )}
            
            {task.errorMessage && (
              <Grid item xs={12}>
                <Alert severity="error" className="mt-16">
                  <Typography variant="subtitle2">پیام خطا:</Typography>
                  <Typography variant="body2">{task.errorMessage}</Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </Paper>
        
        {/* Task details tabs */}
        <Paper>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="پیکربندی" />
            <Tab label="متادیتا" />
            {task.status === 'COMPLETED' && (
              <Tab label="نتیجه" />
            )}
          </Tabs>
          
          <Divider />
          
          <Box className="p-16">
            {/* Configuration tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" className="mb-16">پیکربندی وظیفه</Typography>
                {task.configuration ? (
                  <Paper variant="outlined" className="p-16 overflow-auto">
                    <pre className="text-sm">
                      {JSON.stringify(
                        JSON.parse(task.configuration || "{}"), 
                        null, 
                        2
                      )}
                    </pre>
                  </Paper>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    پیکربندی برای این وظیفه تنظیم نشده است
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Metadata tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" className="mb-16">متادیتای وظیفه</Typography>
                {task.metadata && Object.keys(task.metadata).length > 0 ? (
                  <Paper variant="outlined">
                    <Box className="overflow-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="p-8 text-right bg-gray-100">کلید</th>
                            <th className="p-8 text-right bg-gray-100">مقدار</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(task.metadata).map(([key, value]) => (
                            <tr key={key} className="border-t">
                              <td className="p-8 font-medium">{key}</td>
                              <td className="p-8">{String(value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Paper>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    متادیتایی برای این وظیفه تعریف نشده است
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Result tab */}
            {activeTab === 2 && task.status === 'COMPLETED' && (
              <Box>
                <Typography variant="h6" className="mb-16">نتیجه وظیفه</Typography>
                {task.resultArchiveId ? (
                  <Box>
                    <Alert severity="success" className="mb-16">
                      این وظیفه با موفقیت انجام شده و یک آرشیو ایجاد کرده است
                    </Alert>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleViewResultArchive}
                    >
                      مشاهده آرشیو ایجاد شده
                    </Button>
                  </Box>
                ) : (
                  <Alert severity="warning">
                    آرشیوی برای این وظیفه ایجاد نشده است
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    );
  };
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FusePageCarded
        header={renderHeader()}
        content={renderContent()}
        scroll={isMobile ? 'normal' : 'content'}
      />
      
      {/* Confirm dialog */}
      {confirmAction && (
        <ConfirmDialog
          open={confirmDialogOpen}
          title={confirmAction.title}
          content={confirmAction.message}
          confirmText={confirmAction.confirmText}
          cancelText="انصراف"
          confirmColor={confirmAction.confirmColor}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmDialogOpen(false)}
        />
      )}
      
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
    </ErrorBoundary>
  );
}

export default ArchiveTaskDetailsPage;