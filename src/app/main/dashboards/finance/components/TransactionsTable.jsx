// src/app/components/finance/TransactionsTable.jsx
import React, { useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Chip,
  CircularProgress,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';
import { useGetMyTransactionsQuery } from '../FinanceDashboardApi';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import TransactionDetails from './TransactionDetails';

const TransactionsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    serviceName: '',
    fromDate: '',
    toDate: ''
  });
  const [openFilters, setOpenFilters] = useState(false);
  
  const { data, isLoading, isFetching } = useGetMyTransactionsQuery({
    pageNumber: page,
    pageSize: rowsPerPage,
    sortBy: orderBy,
    // sortDirection: order,
    ...filters
  });
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleOpenDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenDetails(true);
  };
  
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };
  
  const handleOpenFilters = () => {
    setOpenFilters(true);
  };
  
  const handleCloseFilters = () => {
    setOpenFilters(false);
  };
  
  const handleApplyFilters = () => {
    setPage(0);
    setOpenFilters(false);
  };
  
  const handleResetFilters = () => {
    setFilters({
      status: '',
      serviceName: '',
      fromDate: '',
      toDate: ''
    });
    setPage(0);
    setOpenFilters(false);
  };
  
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Paper elevation={3} className="p-24">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" component="h2">
            لیست تراکنش‌ها
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleOpenFilters}
          >
            فیلتر
          </Button>
        </Box>
        
        {isFetching && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={24} />
          </Box>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >
                    شناسه
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'serviceName'}
                    direction={orderBy === 'serviceName' ? order : 'asc'}
                    onClick={() => handleRequestSort('serviceName')}
                  >
                    سرویس
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'amount'}
                    direction={orderBy === 'amount' ? order : 'asc'}
                    onClick={() => handleRequestSort('amount')}
                  >
                    مبلغ
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    وضعیت
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'createdAt'}
                    direction={orderBy === 'createdAt' ? order : 'asc'}
                    onClick={() => handleRequestSort('createdAt')}
                  >
                    تاریخ
                  </TableSortLabel>
                </TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{transaction.referenceCode}</TableCell>
                  <TableCell>{transaction.serviceNameFa || transaction.serviceName}</TableCell>
                  <TableCell>{new Intl.NumberFormat('fa-IR').format(transaction.amount)} ریال</TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.statusStr}
                      color={getStatusChipColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{transaction.createdStr}</TableCell>
                  <TableCell>
                    <Button 
                      variant="text" 
                      color="primary"
                      onClick={() => handleOpenDetails(transaction)}
                    >
                      جزئیات
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      تراکنشی یافت نشد
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.pagination?.totalElements || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="تعداد در صفحه"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
        />
        
        {/* Transaction Details Dialog */}
        <Dialog
          open={openDetails}
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
          TransitionComponent={motion.div}
        >
          <DialogTitle>
            جزئیات تراکنش
            <IconButton
              aria-label="close"
              onClick={handleCloseDetails}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedTransaction && (
              <TransactionDetails 
                transactionId={selectedTransaction.id} 
                onClose={handleCloseDetails} 
              />
            )}
          </DialogContent>
        </Dialog>
        
        {/* Filters Dialog */}
        <Dialog
          open={openFilters}
          onClose={handleCloseFilters}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            فیلترها
            <IconButton
              aria-label="close"
              onClick={handleCloseFilters}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>وضعیت</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  label="وضعیت"
                >
                  <MenuItem value="">همه</MenuItem>
                  <MenuItem value="COMPLETED">تکمیل شده</MenuItem>
                  <MenuItem value="PENDING">در انتظار</MenuItem>
                  <MenuItem value="FAILED">ناموفق</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>سرویس</InputLabel>
                <Select
                  value={filters.serviceName}
                  onChange={(e) => setFilters({ ...filters, serviceName: e.target.value })}
                  label="سرویس"
                >
                  <MenuItem value="">همه</MenuItem>
                  <MenuItem value="INCREASE_CREDIT">افزایش اعتبار</MenuItem>
                  <MenuItem value="SUBMIT_COMPANY">ثبت شرکت</MenuItem>
                  <MenuItem value="PURCHASE_SUBSCRIPTION">خرید اشتراک</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="از تاریخ"
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              
              <TextField
                label="تا تاریخ"
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleResetFilters} color="secondary">
              حذف فیلترها
            </Button>
            <Button onClick={handleApplyFilters} color="primary">
              اعمال
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  );
};

export default TransactionsTable;