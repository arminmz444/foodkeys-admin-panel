// src/app/components/finance/FinanceDashboardWidgets.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CircularProgress,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGetFinanceDashboardWidgetsQuery } from '../FinanceDashboardApi';

const FinanceDashboardWidgets = () => {
  const { data: widgets, isLoading, error } = useGetFinanceDashboardWidgetsQuery();
  
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

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography variant="h6" color="error">
          خطا در بارگذاری داده‌ها: {error.message || 'خطای نامشخص'}
        </Typography>
      </Box>
    );
  }

  if (!widgets) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography variant="h6" color="textSecondary">
          داده‌ای یافت نشد
        </Typography>
      </Box>
    );
  }
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Transaction Summary */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            خلاصه تراکنش‌ها
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  تعداد کل
                </Typography>
                <Typography variant="h5">
                  {widgets?.transactionSummary?.totalCount}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  موفق
                </Typography>
                <Typography variant="h5" color="success.main">
                  {widgets?.transactionSummary?.completedCount}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  در انتظار
                </Typography>
                <Typography variant="h5" color="warning.main">
                  {widgets?.transactionSummary?.pendingCount}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  ناموفق
                </Typography>
                <Typography variant="h5" color="error.main">
                  {widgets?.transactionSummary?.failedCount}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ gridColumn: 'span 2' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  مجموع مبالغ
                </Typography>
                <Typography variant="h5">
                  {new Intl.NumberFormat('fa-IR').format(widgets?.transactionSummary?.totalAmount)} ریال
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ gridColumn: 'span 2' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  نرخ رشد
                </Typography>
                <Typography variant="h5" color={widgets?.transactionSummary?.growthRate > 0 ? 'success.main' : 'error.main'}>
                  {widgets?.transactionSummary?.growthRate > 0 ? '+' : ''}{widgets?.transactionSummary?.growthRate}%
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
        
        {/* Payment Summary */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            خلاصه پرداخت‌ها
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  تعداد کل
                </Typography>
                <Typography variant="h5">
                  {widgets?.paymentSummary?.totalCount}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  موفق
                </Typography>
                <Typography variant="h5" color="success.main">
                  {widgets?.paymentSummary?.completedCount}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  در انتظار
                </Typography>
                <Typography variant="h5" color="warning.main">
                  {widgets?.paymentSummary?.pendingCount}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  ناموفق
                </Typography>
                <Typography variant="h5" color="error.main">
                  {widgets?.paymentSummary?.failedCount}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ gridColumn: 'span 2' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  مجموع مبالغ
                </Typography>
                <Typography variant="h5">
                  {new Intl.NumberFormat('fa-IR').format(widgets?.paymentSummary?.totalAmount)} ریال
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ gridColumn: 'span 2' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  نرخ رشد
                </Typography>
                <Typography variant="h5" color={widgets?.paymentSummary?.growthRate > 0 ? 'success.main' : 'error.main'}>
                  {widgets?.paymentSummary?.growthRate > 0 ? '+' : ''}{widgets?.paymentSummary?.growthRate}%
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
        
        {/* Budget Overview */}
       
        {/* Recent Transactions */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              تراکنش‌های اخیر
            </Typography>
            <Button
              variant="text"
              color="primary"
              component={Link}
              to="/dashboards/finance/transactions"
            >
              مشاهده همه
            </Button>
          </Box>
          
          <TableContainer>
            <Table size="small" dir="rtl">
              <TableHead>
                <TableRow>
                  {widgets?.recentTransactions?.columns.map((column, index) => (
                    <TableCell key={index} align="center" sx={{ textAlign: 'center' }}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {widgets?.recentTransactions?.rows?.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>{transaction.id || transaction.referenceCode}</TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>{transaction.username}</TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>{transaction.serviceNameFa || transaction.serviceName || transaction.service}</TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>{new Intl.NumberFormat('fa-IR').format(transaction.amount)} ریال</TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>
                      <Chip 
                        label={transaction.statusStr || transaction.status}
                        color={transaction.status === 'COMPLETED' ? 'success' : transaction.status === 'PENDING' ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>
                      <Box dir="rtl">
                        <Typography variant="body2" component="div" dir="rtl">
                          {transaction.createdStr || transaction.createdAtStr}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" component="div" dir="ltr">
                          {transaction.createdTimeStr || transaction.createdAtTimeStr}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {(!widgets?.recentTransactions?.rows || widgets?.recentTransactions?.rows.length === 0) && (
                  <TableRow >
                    <TableCell colSpan={6} align="center" className='text-center mt-8'>
                      <Typography variant="body2" color="textSecondary" className='text-center'>
                        تراکنشی یافت نشد
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        
        {/* Recent Payments */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              پرداخت‌های اخیر
            </Typography>
            <Button
              variant="text"
              color="primary"
              component={Link}
              to="/dashboards/finance/payments"
            >
              مشاهده همه
            </Button>
          </Box>
          
          <TableContainer>
            <Table size="small" dir="rtl">
              <TableHead>
                <TableRow>
                  {widgets?.recentPayments?.columns.map((column, index) => (
                    <TableCell key={index} align="center" sx={{ textAlign: 'center' }}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {widgets?.recentPayments?.rows?.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>{payment.id.substring(0, 8)}</TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>{payment.username}</TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>{payment.serviceFa || payment.service}</TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>{new Intl.NumberFormat('fa-IR').format(payment.amount)} ریال</TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>
                      <Chip 
                        label={payment.paymentStatus}
                        size="small"
                        color={
                          payment.paymentStatusColor === 'success' ? 'success' :
                          payment.paymentStatusColor === 'warning' ? 'warning' :
                          payment.paymentStatusColor === 'danger' ? 'error' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>
                      <Box dir="rtl">
                        <Typography variant="body2" component="div" dir="rtl">
                          {payment.createdAtStr}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" component="div" dir="ltr">
                          {payment.createdAtTimeStr}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {(!widgets?.recentPayments?.rows || widgets?.recentPayments?.rows.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary">
                        پرداختی یافت نشد
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default FinanceDashboardWidgets;