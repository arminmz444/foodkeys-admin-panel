import { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Box, 
  CircularProgress, 
  Grid, 
  Button, 
  Alert, 
  Snackbar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  History as HistoryIcon,
  Compare as CompareIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import ArchiveCard from 'src/app/main/apps/archive/ArchiveCard';
import { 
  useGetArchivesByEntityQuery, 
  useCreateArchiveTaskMutation,
  useProcessArchiveTaskMutation,
  useRollbackToArchiveMutation,
  useDeleteArchiveMutation,
  useCompareArchivesQuery,
  useGetArchiveTypesQuery
} from 'src/app/main/apps/archive/store/archiveApi';
import ArchiveCompareDialog from 'src/app/main/apps/archive/ArchiveCompareDialog';
import RollbackDialog from 'src/app/main/apps/archive/RollbackDialog';
import ArchiveDetailsDialog from 'src/app/main/apps/archive/ArchiveDetailsDialog';
import ConfirmDialog from 'src/app/main/apps/archive/ConfirmDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'src/app/shared-components/ErrorFallback';

function ArchivesTab() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedArchives, setSelectedArchives] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [rollbackDialogOpen, setRollbackDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArchiveId, setSelectedArchiveId] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [archiveTaskData, setArchiveTaskData] = useState({
    name: '',
    description: '',
    entityName: 'Company',
    entityId: companyId,
    archiveType: 'MANUAL'
  });
  
  const { data: companyArchives, isLoading: isLoadingArchives, refetch } = useGetArchivesByEntityQuery({
    entityType: 'Company',
    entityId: companyId,
    page: 0,
    size: 100
  });
  const { data: archiveTypes, isLoading: isLoadingTypes } = useGetArchiveTypesQuery();
  const [createArchiveTask, { isLoading: isCreating }] = useCreateArchiveTaskMutation();
  const [processArchiveTask, { isLoading: isProcessing }] = useProcessArchiveTaskMutation();
  const [rollbackToArchive, { isLoading: isRollingBack }] = useRollbackToArchiveMutation();
  const [deleteArchive, { isLoading: isDeleting }] = useDeleteArchiveMutation();
  
  useEffect(() => {
    setSelectedArchives([]);
    setCompareMode(false);
  }, [companyArchives]);
  
  const getFilteredArchives = () => {
    if (!companyArchives || !companyArchives.data) return [];
    
    if (activeTab === 0) return companyArchives.data; 
    
    const archiveTypeName = archiveTypes?.[activeTab - 1]?.value;
    return companyArchives.data.filter(archive => 
      archive.metadata?.archiveType === archiveTypeName);
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedArchives([]);
  };
  
  const handleArchiveSelection = (archiveId) => {
    if (!compareMode) {
      handleViewArchive(archiveId);
      return;
    }
    
    setSelectedArchives(prev => {
      if (prev.includes(archiveId)) {
        return prev.filter(id => id !== archiveId);
      }
      
      if (prev.length >= 2) {
        return [prev[1], archiveId];
      }
      
      return [...prev, archiveId];
    });
  };
  
  const handleViewArchive = (archiveId) => {
    setSelectedArchiveId(archiveId);
    setSelectedArchive(companyArchives.data.find(a => a.id === archiveId));
    setDetailsDialogOpen(true);
  };
  
  const handleToggleCompareMode = () => {
    setCompareMode(prev => !prev);
    setSelectedArchives([]);
  };
  
  const handleOpenCompareDialog = () => {
    if (selectedArchives.length !== 2) {
      showSnackbar('لطفاً دو آرشیو برای مقایسه انتخاب کنید', 'warning');
      return;
    }
    
    setCompareDialogOpen(true);
  };
  
  // Open create dialog
  const handleOpenCreateDialog = () => {
    setArchiveTaskData({
      name: `آرشیو شرکت ${companyId}`,
      description: 'آرشیو دستی ایجاد شده توسط کاربر',
      entityName: 'Company',
      entityId: companyId,
      archiveType: 'MANUAL'
    });
    setCreateDialogOpen(true);
  };
  
  // Open rollback dialog
  const handleOpenRollbackDialog = (archiveId) => {
    setSelectedArchiveId(archiveId);
    setSelectedArchive(companyArchives.data.find(a => a.id === archiveId));
    setRollbackDialogOpen(true);
  };
  
  // Open delete dialog
  const handleOpenDeleteDialog = (archiveId) => {
    setSelectedArchiveId(archiveId);
    setSelectedArchive(companyArchives.data.find(a => a.id === archiveId));
    setDeleteDialogOpen(true);
  };
  
  // Create archive task
  const handleCreateArchiveTask = async () => {
    try {
      // Create the archive task
      const createResponse = await createArchiveTask(archiveTaskData).unwrap();
      const taskId = createResponse?.id || createResponse?.data?.id;
      
      if (!taskId) {
        showSnackbar('خطا: شناسه وظیفه آرشیو دریافت نشد', 'error');
        return;
      }
      
      // Process the archive task
      try {
        await processArchiveTask(taskId).unwrap();
        showSnackbar('آرشیو شرکت با موفقیت ایجاد شد', 'success');
        setCreateDialogOpen(false);
        refetch();
      } catch (processError) {
        showSnackbar(`خطا در پردازش آرشیو: ${processError.message || 'خطای ناشناخته'}`, 'error');
      }
    } catch (error) {
      showSnackbar(`خطا در ایجاد آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    }
  };
  
  // Handle delete archive
  const handleDeleteArchive = async () => {
    try {
      await deleteArchive(selectedArchiveId).unwrap();
      showSnackbar('آرشیو با موفقیت حذف شد', 'success');
      setDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      showSnackbar(`خطا در حذف آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    }
  };
  
  // Navigate to archive task list
  const handleNavigateToTasks = () => {
    navigate(`/apps/archive-tasks/entity/Company/${companyId}`);
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
  if (isLoadingArchives || isLoadingTypes) {
    return (
      <Box className="flex justify-center items-center p-32">
        <CircularProgress />
      </Box>
    );
  }
  
  const filteredArchives = getFilteredArchives();
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="w-full">
        {/* Top toolbar */}
        <Paper className="mb-24 p-16">
          <Box className="flex justify-between items-center mb-16">
            <Typography variant="h6">مدیریت آرشیو شرکت</Typography>
            <Box className="flex gap-8">
              <Button
                variant={compareMode ? "contained" : "outlined"}
                color="primary"
                startIcon={<CompareIcon />}
                onClick={handleToggleCompareMode}
              >
                {compareMode ? 'لغو مقایسه' : 'مقایسه آرشیوها'}
              </Button>
              {compareMode && selectedArchives.length === 2 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleOpenCompareDialog}
                >
                  مقایسه انتخاب شده‌ها
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateDialog}
              >
                ایجاد آرشیو جدید
              </Button>
              {/*<Button*/}
              {/*  variant="outlined"*/}
              {/*  color="primary"*/}
              {/*  onClick={handleNavigateToTasks}*/}
              {/*>*/}
              {/*  وظایف آرشیو*/}
              {/*</Button>*/}
            </Box>
          </Box>
          
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="همه آرشیوها" />
            {archiveTypes?.map((type, index) => (
              <Tab key={type.value} label={type.label} />
            ))}
          </Tabs>
        </Paper>
        
        {/* Archives grid */}
        {filteredArchives.length === 0 ? (
          <Alert severity="info" className="mb-24">
            هیچ آرشیوی برای نمایش وجود ندارد
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {filteredArchives.map(archive => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={archive.id}>
                <ArchiveCard 
                  archive={archive} 
                  selected={selectedArchives.includes(archive.id)}
                  compareMode={compareMode}
                  compareFirst={compareMode && selectedArchives[0] === archive.id}
                  compareSecond={compareMode && selectedArchives[1] === archive.id}
                  onSelect={() => handleArchiveSelection(archive.id)}
                  onView={() => handleViewArchive(archive.id)}
                  onRollback={() => handleOpenRollbackDialog(archive.id)}
                  onDelete={() => handleOpenDeleteDialog(archive.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Compare Dialog */}
        {compareDialogOpen && selectedArchives.length === 2 && (
          <ArchiveCompareDialog 
            firstArchiveId={selectedArchives[0]}
            secondArchiveId={selectedArchives[1]}
            onClose={() => setCompareDialogOpen(false)}
            onShowSnackbar={showSnackbar}
          />
        )}
        
        {/* Archive Details Dialog */}
        {selectedArchive && detailsDialogOpen && (
          <ArchiveDetailsDialog 
            open={detailsDialogOpen}
            onClose={() => setDetailsDialogOpen(false)}
            archive={selectedArchive}
            onRollback={() => {
              setDetailsDialogOpen(false);
              handleOpenRollbackDialog(selectedArchive.id);
            }}
            onDelete={() => {
              setDetailsDialogOpen(false);
              handleOpenDeleteDialog(selectedArchive.id);
            }}
          />
        )}
        
        {/* Create Archive Dialog */}
        <Dialog 
          open={createDialogOpen} 
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>ایجاد آرشیو جدید</DialogTitle>
          <DialogContent>
            <Box className="flex flex-col gap-16 my-16">
              <TextField
                label="نام آرشیو"
                fullWidth
                value={archiveTaskData.name}
                onChange={(e) => setArchiveTaskData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <TextField
                label="توضیحات"
                fullWidth
                multiline
                rows={3}
                value={archiveTaskData.description}
                onChange={(e) => setArchiveTaskData(prev => ({ ...prev, description: e.target.value }))}
              />
              <FormControl fullWidth required>
                <InputLabel>نوع آرشیو</InputLabel>
                <Select
                  value={archiveTaskData.archiveType}
                  label="نوع آرشیو"
                  onChange={(e) => setArchiveTaskData(prev => ({ ...prev, archiveType: e.target.value }))}
                >
                  {archiveTypes?.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)} color="inherit">
              انصراف
            </Button>
            <Button 
              onClick={handleCreateArchiveTask} 
              color="primary" 
              variant="contained"
              disabled={isCreating || isProcessing || !archiveTaskData.name}
            >
              {(isCreating || isProcessing) ? <CircularProgress size={24} /> : 'ایجاد آرشیو'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Rollback Dialog */}
        {selectedArchive && (
          <RollbackDialog 
            open={rollbackDialogOpen}
            onClose={() => setRollbackDialogOpen(false)}
            archiveId={selectedArchiveId}
            archiveName={selectedArchive?.name}
            onSuccess={(message) => {
              showSnackbar(message, 'success');
              setRollbackDialogOpen(false);
              refetch();
            }}
            onError={(message) => {
              showSnackbar(message, 'error');
              setRollbackDialogOpen(false);
            }}
          />
        )}
        
        {/* Delete Confirm Dialog */}
        <ConfirmDialog 
          open={deleteDialogOpen}
          title="حذف آرشیو"
          content={`آیا از حذف آرشیو "${selectedArchive?.name}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`}
          confirmText="حذف"
          cancelText="انصراف"
          confirmColor="error"
          onConfirm={handleDeleteArchive}
          onCancel={() => setDeleteDialogOpen(false)}
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
      </div>
    </ErrorBoundary>
  );
}

export default ArchivesTab;