import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import ErrorFallback from '../../../shared-components/ErrorFallback';
import { 
  resetSearchText, 
  selectSearchText, 
  setSearchText 
} from './store/archiveAppSlice';
import ArchiveTasksList from './ArchiveTasksList';
import { Alert, Snackbar, Box, TextField, InputAdornment, IconButton, Button, Typography, Paper } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import CreateArchiveTaskDialog from './CreateArchiveTaskDialog';
import { useParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import ArchiveTaskList from './ArchiveTasksList';
import ArchiveTaskHeader from './ArchiveTaskHeader';

function ArchiveTasksApp() {
  const dispatch = useDispatch();
  const { entityType, entityId } = useParams();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const searchText = useSelector(selectSearchText);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  useEffect(() => {
    return () => {
      dispatch(resetSearchText());
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

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  return (
    // <>
    //   <FusePageCarded
    //     header={
    //       <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
    //         <Typography
    //           component={motion.span}
    //           initial={{ x: -20 }}
    //           animate={{ x: 0, transition: { delay: 0.2 } }}
    //           delay={300}
    //           className="text-24 md:text-32 font-extrabold tracking-tight"
    //         >
    //           وظایف آرشیو
    //         </Typography>

    //         <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-16">
    //           <Paper className="flex items-center w-full sm:max-w-256 px-8 rounded-full border-1">
    //             <TextField
    //               placeholder="جستجو در وظایف آرشیو"
    //               className="flex flex-1"
    //               InputProps={{
    //                 startAdornment: (
    //                   <InputAdornment position="start">
    //                     <SearchIcon />
    //                   </InputAdornment>
    //                 ),
    //                 endAdornment: (
    //                   <InputAdornment position="end">
    //                     <IconButton
    //                       onClick={() => dispatch(resetSearchText())}
    //                       size="small"
    //                     >
    //                       <ClearIcon />
    //                     </IconButton>
    //                   </InputAdornment>
    //                 ),
    //                 disableUnderline: true
    //               }}
    //               variant="standard"
    //               value={searchText}
    //               onChange={(ev) => dispatch(setSearchText(ev))}
    //             />
    //           </Paper>
              
    //           <Button
    //             variant="contained"
    //             color="primary"
    //             startIcon={<AddIcon />}
    //             onClick={handleOpenCreateDialog}
    //           >
    //             ایجاد وظیفه آرشیو جدید
    //           </Button>
    //         </div>
    //       </div>
    //     }
    //     content={
    //       <ArchiveTasksList
    //         searchText={searchText}
    //         page={page}
    //         rowsPerPage={rowsPerPage}
    //         onPageChange={handlePageChange}
    //         onRowsPerPageChange={handleRowsPerPageChange}
    //         onShowSnackbar={handleShowSnackbar}
    //       />
    //     }
    //     scroll={isMobile ? 'normal' : 'content'}
    //   />

    //   <CreateArchiveTaskDialog
    //     open={createDialogOpen}
    //     onClose={handleCloseCreateDialog}
    //     onShowSnackbar={handleShowSnackbar}
    //   />

    //   <Snackbar
    //     open={snackbar.open}
    //     autoHideDuration={6000}
    //     onClose={handleCloseSnackbar}
    //     anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    //   >
    //     <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
    //       {snackbar.message}
    //     </Alert>
    //   </Snackbar>
    // </>
    <>
    <FusePageCarded
      header={
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ArchiveTaskHeader
            entityType={entityType}
            entityId={entityId}
            onCreateTaskClick={handleOpenCreateDialog}
          />
        </ErrorBoundary>
      }
      content={
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ArchiveTaskList 
            entityType={entityType}
            entityId={entityId}
            searchText={searchText}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onShowSnackbar={handleShowSnackbar}
          />
        </ErrorBoundary>
      }
      scroll={isMobile ? 'normal' : 'content'}
    />

    <CreateArchiveTaskDialog
      open={createDialogOpen}
      onClose={handleCloseCreateDialog}
      entityType={entityType}
      entityId={entityId}
      onShowSnackbar={handleShowSnackbar}
    />

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

export default ArchiveTasksApp;