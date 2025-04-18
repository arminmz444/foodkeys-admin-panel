import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Paper, 
  Pagination, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Grid,
  Checkbox,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  MoreVert as MoreIcon, 
  Visibility as ViewIcon, 
  RestoreFromTrash as RollbackIcon, 
  Delete as DeleteIcon,
  Compare as CompareIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { 
  useGetArchivesQuery, 
  useGetArchivesByEntityQuery,
  useDeleteArchiveMutation,
  useRollbackToArchiveMutation
} from './store/archiveApi';
import { selectViewMode, selectFilters, setFirstArchiveForCompare, setSecondArchiveForCompare, selectCompareMode } from './store/archiveAppSlice';
import ArchiveCard from './ArchiveCard';
import ArchiveNotFound from './ArchiveNotFound';
import ConfirmDialog from './ConfirmDialog';
import RollbackDialog from './RollbackDialog';
import ArchiveDetailsDialog from './ArchiveDetailsDialog';

function ArchiveList({ 
  entityType, 
  entityId, 
  searchText, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange,
  onShowSnackbar 
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const viewMode = useSelector(selectViewMode);
  const filters = useSelector(selectFilters);
  const compareMode = useSelector(selectCompareMode);
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rollbackDialogOpen, setRollbackDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedArchives, setSelectedArchives] = useState([]);
  
  // Fetch archives - either all or by entity
  const archivesQuery = entityType && entityId
    ? useGetArchivesByEntityQuery({
        entityType,
        entityId,
        page,
        size: rowsPerPage,
        searchText: searchText || undefined,
        ...getApiFilterParams(filters)
      })
    : useGetArchivesQuery({
        page,
        size: rowsPerPage,
        searchText: searchText || undefined,
        ...getApiFilterParams(filters)
      });
  
  const { data: archivesData, isLoading, isFetching, error, refetch } = archivesQuery;
  
  // Mutations
  const [deleteArchive, { isLoading: isDeleting }] = useDeleteArchiveMutation();
  const [rollbackToArchive, { isLoading: isRollingBack }] = useRollbackToArchiveMutation();
  
  // Reset selected archives when data changes
  useEffect(() => {
    setSelectedArchives([]);
  }, [archivesData]);
  
  // Handle menu open
  const handleMenuOpen = (event, archive) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedArchive(archive);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle archive selection (for comparison or bulk actions)
  const handleArchiveSelection = (archiveId) => {
    setSelectedArchives((prev) => {
      if (prev.includes(archiveId)) {
        return prev.filter(id => id !== archiveId);
      } else {
        return [...prev, archiveId];
      }
    });
    
    // Handle compare mode selection
    if (compareMode.active) {
      if (!compareMode.firstArchiveId) {
        dispatch(setFirstArchiveForCompare(archiveId));
      } else if (!compareMode.secondArchiveId && compareMode.firstArchiveId !== archiveId) {
        dispatch(setSecondArchiveForCompare(archiveId));
      } else if (compareMode.firstArchiveId === archiveId) {
        dispatch(setFirstArchiveForCompare(null));
      } else if (compareMode.secondArchiveId === archiveId) {
        dispatch(setSecondArchiveForCompare(null));
      }
    }
  };
  
  // Handle view action
  const handleViewArchive = (archiveId) => {
    setSelectedArchive(archivesData.data.find(archive => archive.id === archiveId));
    setDetailsDialogOpen(true);
    handleMenuClose();
  };
  
  // Prepare for rollback
  const handlePrepareRollback = (archive) => {
    setSelectedArchive(archive);
    setRollbackDialogOpen(true);
    handleMenuClose();
  };
  
  const handlePrepareDelete = (archive) => {
    setConfirmAction({
      type: 'delete',
      archiveId: archive.id,
      name: archive.name
    });
    setConfirmDialogOpen(true);
    handleMenuClose();
  };
  
  const handleDelete = async () => {
    if (!confirmAction) return;
    
    try {
      await deleteArchive(confirmAction.archiveId).unwrap();
      onShowSnackbar(`آرشیو با موفقیت حذف شد`, 'success');
      refetch();
    } catch (error) {
      onShowSnackbar(`خطا در حذف آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };
  
  // Convert filters to API params
  function getApiFilterParams(filters) {
    const params = {};
    
    if (filters.entityType) {
      params.entityType = filters.entityType;
    }
    
    if (filters.archiveType) {
      params.archiveType = filters.archiveType;
    }
    
    if (filters.timeRange) {
      // Convert timeRange to start/end dates
      const now = new Date();
      let startDate = null;
      
      switch (filters.timeRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          params.startDate = startDate.toISOString();
          break;
        case 'yesterday':
          startDate = new Date(now.setDate(now.getDate() - 1));
          startDate.setHours(0, 0, 0, 0);
          params.startDate = startDate.toISOString();
          params.endDate = new Date(startDate.setHours(23, 59, 59, 999)).toISOString();
          break;
        case 'last7days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          startDate.setHours(0, 0, 0, 0);
          params.startDate = startDate.toISOString();
          break;
        case 'last30days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          startDate.setHours(0, 0, 0, 0);
          params.startDate = startDate.toISOString();
          break;
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          params.startDate = startDate.toISOString();
          break;
        case 'lastMonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          params.startDate = startDate.toISOString();
          params.endDate = endDate.toISOString();
          break;
        default:
          break;
      }
    }
    
    return params;
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp', { locale: faIR });
    } catch (e) {
      return dateString || '-';
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Box className="w-full flex justify-center items-center p-32">
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Box className="w-full p-32">
        <Typography color="error" className="text-center">
          خطا در بارگذاری آرشیوها: {error.message || 'خطای ناشناخته'}
        </Typography>
      </Box>
    );
  }
  
  // Render empty state
  if (!archivesData?.data || archivesData.data.length === 0) {
    return <ArchiveNotFound onRefresh={refetch} />;
  }
  
  return (
    <div className="w-full flex flex-col p-16 md:p-24">
      {/* Loading overlay */}
      {(isFetching || isDeleting || isRollingBack) && (
        <Box className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-20 z-10">
          <CircularProgress />
        </Box>
      )}
      
      {/* Grid view */}
      {viewMode === 'grid' && (
        <>
          <Grid container spacing={2}>
            {archivesData.data.map((archive) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={archive.id}>
                <ArchiveCard 
                  archive={archive}
                  selected={selectedArchives.includes(archive.id)}
                  compareMode={compareMode}
                  compareFirst={compareMode.firstArchiveId === archive.id}
                  compareSecond={compareMode.secondArchiveId === archive.id}
                  onSelect={() => handleArchiveSelection(archive.id)}
                  onMenuClick={(e) => handleMenuOpen(e, archive)}
                  onView={() => handleViewArchive(archive.id)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {/* List view */}
      {viewMode === 'list' && (
        <TableContainer component={Paper} className="mb-24">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedArchives.length > 0 && selectedArchives.length === archivesData.data.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedArchives(archivesData.data.map(a => a.id));
                      } else {
                        setSelectedArchives([]);
                      }
                    }}
                    indeterminate={selectedArchives.length > 0 && selectedArchives.length < archivesData.data.length}
                  />
                </TableCell>
                <TableCell>نام</TableCell>
                <TableCell>نوع موجودیت</TableCell>
                <TableCell>نوع آرشیو</TableCell>
                <TableCell>ایجاد کننده</TableCell>
                <TableCell>تاریخ ایجاد</TableCell>
                <TableCell align="right">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {archivesData.data.map((archive) => (
                <TableRow 
                  key={archive.id}
                  hover
                  selected={selectedArchives.includes(archive.id) || 
                    compareMode.firstArchiveId === archive.id || 
                    compareMode.secondArchiveId === archive.id}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedArchives.includes(archive.id) || 
                        compareMode.firstArchiveId === archive.id || 
                        compareMode.secondArchiveId === archive.id}
                      onChange={() => handleArchiveSelection(archive.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" className="cursor-pointer hover:underline" onClick={() => handleViewArchive(archive.id)}>
                      {archive.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{archive.entityType || archive.metadata?.entityType || '-'}</TableCell>
                  <TableCell>{archive.archiveType || archive.metadata?.archiveType || '-'}</TableCell>
                  <TableCell>{archive.createdBy || '-'}</TableCell>
                  <TableCell>{formatDate(archive.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Box className="flex justify-end">
                      <Tooltip title="مشاهده">
                        <IconButton size="small" onClick={() => handleViewArchive(archive.id)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="بیشتر">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, archive)}>
                          <MoreIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Pagination */}
      {archivesData?.pagination?.totalPages > 1 && (
        <Box className="flex justify-center mt-16">
          <Pagination
            count={archivesData.pagination.totalPages}
            page={page + 1}
            onChange={(e, value) => onPageChange(e, value - 1)}
          />
        </Box>
      )}
      
      {/* Context menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedArchive && handleViewArchive(selectedArchive.id)}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="مشاهده" />
        </MenuItem>
        {compareMode.active ? (
          <MenuItem onClick={() => {
            if (selectedArchive) {
              handleArchiveSelection(selectedArchive.id);
              handleMenuClose();
            }
          }}>
            <ListItemIcon>
              <CompareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="انتخاب برای مقایسه" />
          </MenuItem>
        ) : (
          <>
            <MenuItem onClick={() => selectedArchive && handlePrepareRollback(selectedArchive)}>
              <ListItemIcon>
                <RollbackIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="بازگشت به این آرشیو" />
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={() => selectedArchive && handlePrepareDelete(selectedArchive)}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="حذف" />
            </MenuItem>
          </>
        )}
      </Menu>
      
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
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setConfirmAction(null);
        }}
      />
      
      {/* Rollback Dialog */}
      {selectedArchive && (
        <RollbackDialog
          open={rollbackDialogOpen}
          onClose={() => setRollbackDialogOpen(false)}
          archiveId={selectedArchive.id}
          archiveName={selectedArchive.name}
          onSuccess={(message) => {
            onShowSnackbar(message, 'success');
            setRollbackDialogOpen(false);
            refetch();
          }}
          onError={(message) => {
            onShowSnackbar(message, 'error');
            setRollbackDialogOpen(false);
          }}
        />
      )}
      
      {/* Details Dialog */}
      {selectedArchive && (
        <ArchiveDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          archive={selectedArchive}
          onRollback={() => {
            setDetailsDialogOpen(false);
            handlePrepareRollback(selectedArchive);
          }}
          onDelete={() => {
            setDetailsDialogOpen(false);
            handlePrepareDelete(selectedArchive);
          }}
        />
      )}
    </div>
  );
}

export default ArchiveList;