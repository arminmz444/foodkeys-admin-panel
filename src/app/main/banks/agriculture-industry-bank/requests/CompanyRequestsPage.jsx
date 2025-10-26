// src/pages/CompanyRequests.jsx
import React, { useState, useEffect } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { 
  Typography, 
  IconButton, 
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import { Filter, RefreshCw, Search, FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';
import FilterDrawer from './components/FilterDrawer';
import RequestCard from './components/RequestCard';
import EmptyState from './components/EmptyState';
import { useGetCompanyRequestsQuery } from '../AgricultureIndustryApi';
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch as useDispatch } from "app/store/hooks";
export default function CompanyRequests() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ 
    status: null, 
    type: null, 
    search: '',
    categoryId: 2 
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 12
  });

  const { 
    data, 
    isLoading, 
    error, 
    refetch, 
    isFetching 
  } = useGetCompanyRequestsQuery({
    ...pagination,
    ...filters,
    sort: JSON.stringify({ createdAt: 'desc' }) // Default sorting by creation date
  });

  // Reset pagination when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageNumber: 0 }));
  }, [filters]);

  // Handle search input
  const [searchInput, setSearchInput] = useState('');
  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput }));
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, search: '' }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    if (newValue === 0) { 
      setFilters(prev => ({ ...prev, status: null }));
    } else if (newValue === 1) { 
      setFilters(prev => ({ ...prev, status: 1 })); 
    } else if (newValue === 2) { 
      setFilters(prev => ({ ...prev, status: 2 })); 
    } else if (newValue === 3) { 
      setFilters(prev => ({ ...prev, status: 3 })); 
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(showMessage({
        message: 'خطا در بارگذاری اطلاعات. لطفا دوباره تلاش کنید.',
        variant: 'error'
      }));
    }
  }, [error, dispatch]);

  const handleLoadMore = () => {
    if (data?.totalPages > pagination.pageNumber + 1) {
      setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
    }
  };

  const requests = data?.data || [];
  console.log(`Requests ${JSON.stringify(requests)}`)
  const totalRequests = data?.totalElements || 0;
  console.log(`totalRequests ${totalRequests}`)

  const hasMore = data?.totalPages > pagination.pageNumber + 1;

  const header = (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center px-24 py-16">
        <Typography variant="h5" className="font-semibold">
          درخواست‌های شرکت
        </Typography>
        <div className="flex space-x-2">
          <IconButton onClick={() => setDrawerOpen(true)} size="small">
            <Filter />
          </IconButton>
          <IconButton 
            onClick={() => refetch()}
            size="small"
            disabled={isLoading || isFetching}
          >
            {isFetching ? (
              <CircularProgress size={20} />
            ) : (
              <RefreshCw />
            )}
          </IconButton>
        </div>
      </div>
      
      <Paper className="mx-24 mb-16 p-32 flex flex-col sm:flex-row items-center justify-between gap-2">
        <TextField
          placeholder="جستجو در درخواست‌ها..."
          variant="outlined"
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleSearchClear}>
                  <X size={16} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileText size={16} />}
            disabled={isLoading || isFetching}
          >
            گزارش
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSearch}
            disabled={isLoading || isFetching}
          >
            جستجو
          </Button>
        </div>
      </Paper>
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className="px-24 border-b border-gray-200"
      >
        <Tab label="همه" />
        <Tab 
          label={
            <div className="flex items-center">
              <span>در انتظار</span>
              {/*{!isLoading && (*/}
              {/*  <Chip */}
              {/*    size="small" */}
              {/*    label={data?.data?.filter(r => r.requestStatus === "PENDING").length || 0} */}
              {/*    color="warning" */}
              {/*    className="ml-2"*/}
              {/*  />*/}
              {/*)}*/}
            </div>
          } 
        />
        <Tab label="تایید شده" />
        <Tab label="رد شده" />
      </Tabs>
    </div>
  );

  const content = (
    <div className="p-24">
      {isLoading && !data ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <EmptyState 
            message="خطا در بارگذاری اطلاعات" 
            onRefresh={refetch}
          />
        </Box>
      ) : requests.length === 0 ? (
        <EmptyState 
          message="هیچ درخواستی یافت نشد" 
          onReset={() => setFilters({ status: null, type: null, search: '', categoryId: 2 })}
          onRefresh={refetch}
        />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" className="mb-4">
            نمایش {requests.length} درخواست از {totalRequests} درخواست
          </Typography>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-24">
            {requests.map(request => (
              <motion.div 
                key={request.requestId} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RequestCard 
                  request={request} 
                  onActionComplete={refetch}
                />
              </motion.div>
            ))}
          </div>
          
          {hasMore && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={isFetching}
                startIcon={isFetching ? <CircularProgress size={20} /> : null}
              >
                بارگذاری بیشتر
              </Button>
            </Box>
          )}
          
          {isFetching && data && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress size={24} />
            </Box>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <FusePageSimple 
        header={header} 
        content={content} 
        className="bg-gray-50"
      />
      <FilterDrawer
        open={drawerOpen}
        filters={filters}
        onClose={() => setDrawerOpen(false)}
        onApply={setFilters}
        isLoading={isLoading}
      />
    </>
  );
}
