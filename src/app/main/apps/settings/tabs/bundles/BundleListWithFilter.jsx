import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography, Alert, Box, Paper, useTheme, Pagination } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { enqueueSnackbar } from 'notistack';
import BundleFilterForm from './BundleFilterForm';
import BundleCard from './BundleCard';
import AddBundle from './AddBundle';
import { 
  useGetBundlesOfSubCategoryQuery,
  useDeleteBundleMutation,
  useActivateOrDeactivateBundleMutation,
  useUpdateBundleMutation
} from './store/bundleApi';

function BundleListWithFilter({ subCategoryId }) {
  const theme = useTheme();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('md'));
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [filterParams, setFilterParams] = useState({});
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10
  });

  // RTK Query hooks
  const { 
    data: bundlesData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetBundlesOfSubCategoryQuery({ 
    subCategoryId, 
    pageNumber: pagination.pageNumber, 
    pageSize: pagination.pageSize,
    ...filterParams
  });

  const [deleteBundle, { isLoading: isDeleting }] = useDeleteBundleMutation();
  const [activateOrDeactivateBundle, { isLoading: isChangingStatus }] = useActivateOrDeactivateBundleMutation();
  const [updateBundle, { isLoading: isUpdating }] = useUpdateBundleMutation();

  // Extract data
  const bundles = bundlesData?.data || [];
  const totalPages = bundlesData?.totalPages || 0;
  const totalElements = bundlesData?.totalElements || 0;

  const handlePageChange = (event, newPage) => {
    setPagination({
      ...pagination,
      pageNumber: newPage
    });
  };

  const handleFilter = (filterData) => {
    // Reset page number when applying new filters
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
    setFilterParams(filterData);
  };

  const handleBundleAdded = () => {
    // Refresh the list after adding a new bundle
    refetch();
    
    // Show success message
    enqueueSnackbar('پلن با موفقیت اضافه شد', {
      variant: 'success',
    });
  };

  const handleEditBundle = (bundle) => {
    setSelectedBundle(bundle);
  };

  const handleBundleEdited = (updatedBundle) => {
    // Clear selected bundle
    setSelectedBundle(null);
    
    // Show success message
    enqueueSnackbar('پلن با موفقیت ویرایش شد', {
      variant: 'success',
      style: { fontSize: 'medium' }
    });
  };

  const handleDeleteBundle = async (bundleId) => {
    try {
      await deleteBundle(bundleId).unwrap();
      
      // Show success message
      enqueueSnackbar('پلن با موفقیت حذف شد', {
        variant: 'success',
        style: { fontSize: 'medium' }
      });
    } catch (err) {
      console.error('Error deleting bundle:', err);
      enqueueSnackbar('خطا در حذف پلن', { variant: 'error' });
    }
  };

  const handleStatusChange = async (bundleId, newStatus) => {
    try {
      await activateOrDeactivateBundle({
        id: bundleId,
        status: newStatus
      }).unwrap();
      
      // Show success message
      enqueueSnackbar(`پلن با موفقیت ${newStatus === 'ACTIVE' ? 'فعال' : 'غیرفعال'} شد`, {
        variant: 'success',
      });
    } catch (err) {
      console.error('Error changing bundle status:', err);
      enqueueSnackbar('خطا در تغییر وضعیت پلن', { variant: 'error' });
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between mb-24">
        <Typography variant="h5" className="mb-16 md:mb-0 font-bold">
          لیست پلن‌ها {totalElements > 0 && `(${totalElements})`}
        </Typography>
        <AddBundle 
          onBundleAdded={handleBundleAdded} 
          subCategoryId={subCategoryId}
        />
      </div>

      <BundleFilterForm onFilter={handleFilter} />

      {isError && (
        <Alert severity="error" className="my-16">
          {error?.data?.message || 'خطا در دریافت لیست پلن‌ها'}
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-64">
          <CircularProgress />
        </div>
      ) : bundles.length === 0 ? (
        <Paper className="p-24 text-center my-32">
          <FuseSvgIcon size={40} color="disabled">heroicons-outline:collection</FuseSvgIcon>
          <Typography className="mt-16" color="text.secondary">
            هیچ پلنی یافت نشد.
          </Typography>
        </Paper>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mt-24">
            {bundles.map((bundle) => (
              <div key={bundle.id} className="relative">
                <BundleCard
                  title={bundle.title}
                  amount={bundle.price}
                  isActive={bundle.status === 'ACTIVE'}
                  duration={`${bundle.timeDuration} ماه`}
                  description={bundle.description}
                  features={bundle.features?.split('.')}
                  updatedAt={bundle.updatedAtStr}
                  onEdit={() => handleEditBundle(bundle)}
                  onDelete={() => handleDeleteBundle(bundle.id)}
                  onStatusChange={() => handleStatusChange(
                    bundle.id, 
                    bundle.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                  )}
                />
                
                {selectedBundle?.id === bundle.id && (
                  <Box className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-5 z-10 rounded-2xl">
                    <AddBundle
                      editData={selectedBundle}
                      onBundleEdited={handleBundleEdited}
                    />
                  </Box>
                )}
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-40">
              <Pagination 
                count={totalPages}
                page={pagination.pageNumber}
                onChange={handlePageChange}
                color="secondary"
                shape="rounded"
                showFirstButton
                showLastButton
                dir={theme.direction}
                size={isMobile ? "small" : "medium"}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BundleListWithFilter;