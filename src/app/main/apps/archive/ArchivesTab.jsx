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
  IconButton,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  History as HistoryIcon,
  Compare as CompareIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ArchiveCard from './ArchiveCard';
import { 
  useGetCompanyArchivesQuery, 
  useCreateArchiveTaskMutation, 
  useRollbackToArchiveMutation,
  useGetArchiveTypesQuery,
  useDeleteArchiveMutation,
  useGetFoodIndustryCompanyDetailsQuery
} from '../FoodIndustryBankApi';
import ArchiveCompareDialog from './ArchiveCompareDialog';
import ArchiveDetailsDialog from './ArchiveDetailsDialog';
import CreateArchiveDialog from './CreateArchiveDialog';
import RollbackDialog from './RollbackDialog';
import ConfirmDialog from './ConfirmDialog';
import { 
  setSearchText,
  resetSearchText,
  setViewMode,
  toggleCompareMode,
  selectArchiveForCompare,
  resetCompareMode,
  selectSearchText,
  selectViewMode,
  selectCompareMode,
  selectSelectedArchiveTypes,
  setSelectedArchiveTypes
} from './store/archiveAppSlice';

function ArchivesTab() {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  
  // Redux state
  const searchText = useSelector(selectSearchText);
  const viewMode = useSelector(selectViewMode);
  const compareMode = useSelector(selectCompareMode);
  const selectedArchiveTypes = useSelector(selectSelectedArchiveTypes);
  
  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [dialogs, setDialogs] = useState({
    compare: false,
    details: false,
    create: false,
    rollback: false,
    delete: false
  });
  const [selectedArchiveId, setSelectedArchiveId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Queries and mutations
  const { data: companyArchives, isLoading: isLoadingArchives, refetch } = useGetCompanyArchivesQuery(companyId);
  const { data: archiveTypes, isLoading: isLoadingTypes } = useGetArchiveTypesQuery();
  const { data: companyDetails } = useGetFoodIndustryCompanyDetailsQuery(companyId);
  const [createArchiveTask] = useCreateArchiveTaskMutation();
  const [rollbackToArchive] = useRollbackToArchiveMutation();
  const [deleteArchive] = useDeleteArchiveMutation();
  
  // Set archive types in tabs when data loads
  useEffect(() => {
    if (archiveTypes && activeTab === 0) {
      dispatch(setSelectedArchiveTypes([]));
    } else if (archiveTypes && activeTab > 0 && archiveTypes[activeTab - 1]) {
      dispatch(setSelectedArchiveTypes([archiveTypes[activeTab - 1].value]));
    }
  }, [dispatch, activeTab, archiveTypes]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetSearchText());
      dispatch(resetCompareMode());
    };
  }, [dispatch]);
  
  // Filter archives by search and type
  const getFilteredArchives = () => {
    if (!companyArchives) return [];
    
    let filtered = [...companyArchives];
    
    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(archive => 
        archive.name?.toLowerCase().includes(searchLower) ||
        archive.description?.toLowerCase().includes(searchLower) ||
        archive.metadata?.archiveType?.toLowerCase().includes(searchLower) ||
        archive.createdBy?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by archive types
    if (selectedArchiveTypes.length > 0) {
      filtered = filtered.filter(archive => 
        selectedArchiveTypes.includes(archive.metadata?.archiveType)
      );
    }
    
    return filtered;
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    dispatch(resetCompareMode());
  };
  
  // Handle archive selection
  const handleArchiveSelection = (archiveId) => {
    if (compareMode.active) {
      dispatch(selectArchiveForCompare(archiveId));
    } else {
      handleOpenArchiveDetails(archiveId);
    }
  };
  
  // Dialog openers
  const handleOpenCompareDialog = () => {
    if (compareMode.selectedArchives.length !== 2) {
      showSnackbar('لطفاً دو آرشیو برای مقایسه انتخاب کنید', 'warning');
      return;
    }
    setDialogs(prev => ({ ...prev, compare: true }));
  };
  
  const handleOpenArchiveDetails = (archiveId) => {
    setSelectedArchiveId(archiveId);
    setDialogs(prev => ({ ...prev, details: true }));
  };
  
  const handleOpenCreateDialog = () => {
    setDialogs(prev => ({ ...prev, create: true }));
  };
  
  const handleOpenRollbackDialog = (archiveId) => {
    setSelectedArchiveId(archiveId);
    setDialogs(prev => ({ ...prev, rollback: true }));
  };
  
  const handleOpenDeleteDialog = (archiveId) => {
    setSelectedArchiveId(archiveId);
    setDialogs(prev => ({ ...prev, delete: true }));
  };
  
  // Dialog closers
  const handleCloseDialogs = () => {
    setDialogs({
      compare: false,
      details: false,
      create: false,
      rollback: false,
      delete: false
    });
  };
  
  // Delete archive
  const handleDeleteArchive = async () => {
    try {
      await deleteArchive(selectedArchiveId).unwrap();
      showSnackbar('آرشیو با موفقیت حذف شد', 'success');
      refetch();
    } catch (error) {
      showSnackbar(`خطا در حذف آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    } finally {
      handleCloseDialogs();
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
  if (isLoadingArchives || isLoadingTypes) {
    return (
      <Box className="flex justify-center items-center p-32">
        <CircularProgress />
      </Box>
    );
  }
  
  const filteredArchives = getFilteredArchives();
  
  return (
    <div className="w-full">
      {/* Top toolbar */}
      <Paper className="mb-24 p-16">
        <Box className="flex flex-col md:flex-row justify-between gap-16 mb-16">
          <Box className="flex items-center">
            <Typography variant="h6" className="mr-8">مدیریت آرشیو شرکت</Typography>
            <Typography variant="body2" color="textSecondary">
              {companyDetails?.companyName || `شرکت #${companyId}`}
            </Typography>
          </Box>
          
          <Box className="flex flex-wrap gap-8">
            <TextField
              placeholder="جستجو در آرشیوها"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => dispatch(setSearchText(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton 
                      size="small" 
                      onClick={() => dispatch(resetSearchText())}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Tooltip title={viewMode === 'grid' ? 'نمایش لیستی' : 'نمایش شبکه‌ای'}>
              <IconButton 
                onClick={() => dispatch(setViewMode(viewMode === 'grid' ? 'list' : 'grid'))}
              >
                {viewMode === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
              </IconButton>
            </Tooltip>
            
            <Button
              variant={compareMode.active ? "contained" : "outlined"}
              color="primary"
              startIcon={<CompareIcon />}
              onClick={() => dispatch(toggleCompareMode())}
            >
              {compareMode.active ? 'لغو مقایسه' : 'مقایسه آرشیوها'}
            </Button>
            
            {compareMode.active && compareMode.selectedArchives.length === 2 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenCompareDialog}
              >
                مقایسه انتخاب شده‌ها ({compareMode.selectedArchives.length})
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
      
      {/* Archives content */}
      {filteredArchives.length === 0 ? (
        <Alert severity="info" className="mb-24">
          هیچ آرشیوی برای نمایش وجود ندارد
        </Alert>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={2}>
          {filteredArchives.map(archive => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={archive.id}>
              <ArchiveCard 
                archive={archive} 
                selected={compareMode.selectedArchives.includes(archive.id)}
                compareMode={compareMode.active}
                onSelect={() => handleArchiveSelection(archive.id)}
                onRollback={() => handleOpenRollbackDialog(archive.id)}
                onDelete={() => handleOpenDeleteDialog(archive.id)}
                onView={() => handleOpenArchiveDetails(archive.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper>
          <Box className="overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {compareMode.active && <th className="p-16 text-right">انتخاب</th>}
                  <th className="p-16 text-right">نام آرشیو</th>
                  <th className="p-16 text-right">نوع آرشیو</th>
                  <th className="p-16 text-right">ایجاد کننده</th>
                  <th className="p-16 text-right">تاریخ ایجاد</th>
                  <th className="p-16 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredArchives.map(archive => (
                  <tr key={archive.id} className="border-t hover:bg-gray-50">
                    {compareMode.active && (
                      <td className="p-16">
                        <Checkbox
                          checked={compareMode.selectedArchives.includes(archive.id)}
                          onChange={() => dispatch(selectArchiveForCompare(archive.id))}
                          color="primary"
                        />
                      </td>
                    )}
                    <td className="p-16">
                      <Box className="flex items-center">
                        <Typography 
                          variant="body2" 
                          className="cursor-pointer hover:underline"
                          onClick={() => handleOpenArchiveDetails(archive.id)}
                        >
                          {archive.name || 'بدون نام'}
                        </Typography>
                      </Box>
                    </td>
                    <td className="p-16">
                      <Chip 
                        label={archive.metadata?.archiveType || '-'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </td>
                    <td className="p-16">{archive.createdBy || '-'}</td>
                    <td className="p-16">{formatDate(archive.createdAt)}</td>
                    <td className="p-16">
                      <Box className="flex">
                        <Tooltip title="مشاهده">
                          <IconButton size="small" onClick={() => handleOpenArchiveDetails(archive.id)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="بازگشت">
                          <IconButton size="small" onClick={() => handleOpenRollbackDialog(archive.id)}>
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="حذف">
                          <IconButton size="small" onClick={() => handleOpenDeleteDialog(archive.id)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}
      
      {/* Dialogs */}
      {dialogs.compare && (
        <ArchiveCompareDialog 
          firstArchiveId={compareMode.selectedArchives[0]}
          secondArchiveId={compareMode.selectedArchives[1]}
          onClose={() => {
            handleCloseDialogs();
            dispatch(resetCompareMode());
          }}
          onShowSnackbar={showSnackbar}
        />
      )}
      
      {dialogs.details && (
        <ArchiveDetailsDialog 
          archiveId={selectedArchiveId}
          open={dialogs.details}
          onClose={handleCloseDialogs}
          onRollback={handleOpenRollbackDialog}
          onShowSnackbar={showSnackbar}
        />
      )}
      
      {dialogs.create && (
        <CreateArchiveDialog 
          open={dialogs.create}
          onClose={handleCloseDialogs}
          entityType="Company"
          entityId={companyId}
          entityName={companyDetails?.companyName}
          onSuccess={(message) => {
            showSnackbar(message, 'success');
            refetch();
          }}
          onError={(message) => showSnackbar(message, 'error')}
        />
      )}
      
      {dialogs.rollback && (
        <RollbackDialog 
          open={dialogs.rollback}
          onClose={handleCloseDialogs}
          archiveId={selectedArchiveId}
          archiveName={companyArchives?.find(a => a.id === selectedArchiveId)?.name}
          onSuccess={(message) => {
            showSnackbar(message, 'success');
            refetch();
          }}
          onError={(message) => showSnackbar(message, 'error')}
        />
      )}
      
      {dialogs.delete && (
        <ConfirmDialog 
          open={dialogs.delete}
          title="حذف آرشیو"
          content="آیا از حذف این آرشیو اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
          confirmText="حذف"
          cancelText="انصراف"
          confirmColor="error"
          onConfirm={handleDeleteArchive}
          onCancel={handleCloseDialogs}
        />
      )}
      
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
  );
}

export default ArchivesTab;