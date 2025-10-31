import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  CircularProgress, 
  Button, 
  Alert, 
  Snackbar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  RestoreFromTrash as RestoreIcon,
  History as HistoryIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { 
  useGetArchivesByEntityQuery,
  useRollbackToArchiveMutation,
  useGetArchiveByIdQuery
} from 'src/app/main/apps/archive/store/archiveApi';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'src/app/shared-components/ErrorFallback';
import ArchiveDetailsDialog from 'src/app/main/apps/archive/ArchiveDetailsDialog';

function VersionHistoryTab() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedArchiveId, setSelectedArchiveId] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Queries and mutations
  const { data: archives, isLoading, refetch } = useGetArchivesByEntityQuery({
    entityType: 'Company',
    entityId: companyId,
    page: 0,
    size: 100
  });
  const [rollbackToArchive, { isLoading: isRestoring }] = useRollbackToArchiveMutation();
  
  const sortedArchives = archives?.data && [...archives.data].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp', { locale: faIR });
    } catch (e) {
      return dateString || '-';
    }
  };
  
  // Get archive type label
  const getArchiveTypeLabel = (type) => {
    switch (type) {
      case 'MANUAL':
        return 'آرشیو دستی';
      case 'AUTOMATIC_BACKUP':
        return 'پشتیبان خودکار';
      case 'AUTOMATIC_ROLLBACK':
        return 'بازگشت خودکار';
      case 'BEFORE_UPDATE':
        return 'قبل از بروزرسانی';
      case 'AFTER_UPDATE':
        return 'بعد از بروزرسانی';
      default:
        return type;
    }
  };
  
  // Get archive type color
  const getArchiveTypeColor = (type) => {
    switch (type) {
      case 'MANUAL':
        return 'primary';
      case 'AUTOMATIC_BACKUP':
        return 'info';
      case 'AUTOMATIC_ROLLBACK':
        return 'secondary';
      case 'BEFORE_UPDATE':
        return 'warning';
      case 'AFTER_UPDATE':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // View archive details
  const handleViewArchive = (archiveId) => {
    setSelectedArchiveId(archiveId);
    setSelectedVersion(sortedArchives.find(a => a.id === archiveId));
    setDetailsDialogOpen(true);
  };
  
  // Open restore dialog
  const handleOpenRestoreDialog = (archiveId) => {
    setSelectedArchiveId(archiveId);
    setSelectedVersion(sortedArchives.find(a => a.id === archiveId));
    setRestoreDialogOpen(true);
  };
  
  // Restore version
  const handleRestoreVersion = async () => {
    try {
      await rollbackToArchive({
        archiveId: selectedArchiveId,
        reason: 'بازگشت به نسخه قبلی'
      }).unwrap();
      
      showSnackbar('بازگشت به نسخه قبلی با موفقیت انجام شد', 'success');
      setRestoreDialogOpen(false);
      refetch();
    } catch (error) {
      showSnackbar(`خطا در بازگشت به نسخه قبلی: ${error.message || 'خطای ناشناخته'}`, 'error');
    }
  };
  
  // Show snackbar
  const showSnackbar = (message, severity = 'info') => {
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
  
  // Render loading state
  if (isLoading) {
    return (
      <Box className="flex justify-center items-center p-32">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="w-full">
        <Paper className="mb-24 p-16">
          <Box className="flex items-center mb-16">
            <HistoryIcon className="mr-8" color="primary" />
            <Typography variant="h6">تاریخچه نسخه‌های شرکت</Typography>
          </Box>
          
          <Divider className="mb-16" />
          
          {!sortedArchives || sortedArchives.length === 0 ? (
            <Alert severity="info">
              هیچ تاریخچه‌ای برای این شرکت ثبت نشده است
            </Alert>
          ) : (
            <List>
              {sortedArchives.map((archive, index) => (
                <React.Fragment key={archive.id}>
                  <ListItem className={index === 0 ? 'bg-green-50' : ''}>
                    <ListItemIcon>
                      <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Box className="flex items-center gap-8">
                          <Typography variant="subtitle1">{archive.name}</Typography>
                          <Chip 
                            label={getArchiveTypeLabel(archive.metadata?.archiveType)} 
                            size="small" 
                            color={getArchiveTypeColor(archive.metadata?.archiveType)}
                          />
                          {index === 0 && (
                            <Chip label="نسخه فعلی" size="small" color="success" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box className="mt-8">
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(archive.createdAt)}
                          </Typography>
                          <Typography variant="body2">
                            {archive.description || 'بدون توضیحات'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ایجاد کننده: {archive.createdBy || '-'}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="مشاهده">
                        <IconButton edge="end" onClick={() => handleViewArchive(archive.id)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {index > 0 && (
                        <Tooltip title="بازگشت به این نسخه">
                          <IconButton edge="end" onClick={() => handleOpenRestoreDialog(archive.id)}>
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < sortedArchives.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
        
        {/* Archive Details Dialog */}
        {selectedVersion && detailsDialogOpen && (
          <ArchiveDetailsDialog 
            open={detailsDialogOpen}
            onClose={() => setDetailsDialogOpen(false)}
            archive={selectedVersion}
            onRollback={() => {
              setDetailsDialogOpen(false);
              handleOpenRestoreDialog(selectedVersion.id);
            }}
          />
        )}
        
        {/* Restore Dialog */}
        <Dialog 
          open={restoreDialogOpen} 
          onClose={() => setRestoreDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>بازگشت به نسخه قبلی</DialogTitle>
          <DialogContent>
            <Alert severity="warning" className="mb-16">
              با این کار، اطلاعات فعلی شرکت با اطلاعات نسخه انتخاب شده جایگزین خواهد شد. آیا اطمینان دارید؟
            </Alert>
            {selectedVersion && (
              <Box className="mt-16">
                <Typography variant="subtitle2">نسخه انتخاب شده:</Typography>
                <Typography variant="body1">{selectedVersion.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  تاریخ ایجاد: {formatDate(selectedVersion.createdAt)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRestoreDialogOpen(false)} color="inherit">
              انصراف
            </Button>
            <Button 
              onClick={handleRestoreVersion} 
              color="error" 
              variant="contained"
              disabled={isRestoring}
            >
              {isRestoring ? <CircularProgress size={24} /> : 'بازگشت به نسخه قبلی'}
            </Button>
          </DialogActions>
        </Dialog>
        
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
      </div>
    </ErrorBoundary>
  );
}

export default VersionHistoryTab;