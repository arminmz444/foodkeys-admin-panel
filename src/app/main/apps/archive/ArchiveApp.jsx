import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { 
  resetCompareMode, 
  resetFilters, 
  resetSearchText, 
  selectCompareMode, 
  selectSearchText 
} from './store/archiveAppSlice';
import ArchiveHeader from './ArchiveHeader';
import ArchivesList from './ArchivesList';
import ArchiveCompareDialog from './ArchiveCompareDialog';
import { useGetArchiveTypesQuery } from './store/archiveApi';
import { Alert, Snackbar } from '@mui/material';

function ArchiveApp() {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { entityType, entityId } = useParams();
  const searchText = useSelector(selectSearchText);
  const compareMode = useSelector(selectCompareMode);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const { data: archiveTypes } = useGetArchiveTypesQuery();

  useEffect(() => {
    return () => {
      dispatch(resetSearchText());
      dispatch(resetFilters());
      dispatch(resetCompareMode());
    };
  }, [dispatch]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleShowSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <>
      <FusePageCarded
        header={
          <ArchiveHeader 
            archiveTypes={archiveTypes?.data || []} 
            onShowSnackbar={handleShowSnackbar}
          />
        }
        content={
          <ArchivesList 
            entityType={entityType}
            entityId={entityId}
            searchText={searchText}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onShowSnackbar={handleShowSnackbar}
          />
        }
        scroll={isMobile ? 'normal' : 'content'}
      />

      {compareMode.active && compareMode.firstArchiveId && compareMode.secondArchiveId && (
        <ArchiveCompareDialog 
          firstArchiveId={compareMode.firstArchiveId}
          secondArchiveId={compareMode.secondArchiveId}
          onClose={() => dispatch(resetCompareMode())}
          onShowSnackbar={handleShowSnackbar}
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
    </>
  );
}

export default ArchiveApp;