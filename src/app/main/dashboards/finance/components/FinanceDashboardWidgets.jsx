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
  const { data: widgets, isLoading } = useGetFinanceDashboardWidgetsQuery();
  
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
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            وضعیت بودجه
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {/* Expenses */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                  هزینه‌ها
                </Typography>
                <Typography variant="body2">
                  {new Intl.NumberFormat('fa-IR').format(widgets?.budget?.expenses)} / {new Intl.NumberFormat('fa-IR').format(widgets?.budget?.expensesLimit)} ریال
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((widgets?.budget?.expenses * 100) / widgets?.budget?.expensesLimit, 100)}
                color="warning"
                sx={{ height: 8, borderRadius: 4, my: 1 }}
              />
            </Box>
            
            {/* Savings */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                  پس‌انداز
                </Typography>
                <Typography variant="body2">
                  {new Intl.NumberFormat('fa-IR').format(widgets?.budget?.savings)} / {new Intl.NumberFormat('fa-IR').format(widgets?.budget?.savingsGoal)} ریال
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((widgets?.budget?.savings * 100) / widgets?.budget?.savingsGoal, 100)}
                color="success"
                sx={{ height: 8, borderRadius: 4, my: 1 }}
              />
            </Box>
            
            {/* Bills */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                  فاکتورها
                </Typography>
                <Typography variant="body2">
                  {new Intl.NumberFormat('fa-IR').format(widgets?.budget?.bills)} / {new Intl.NumberFormat('fa-IR').format(widgets?.budget?.billsLimit)} ریال
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((widgets?.budget?.bills * 100) / widgets?.budget?.billsLimit, 100)}
                color={(widgets?.budget?.bills > widgets?.budget?.billsLimit) ? "error" : "primary"}
                sx={{ height: 8, borderRadius: 4, my: 1 }}
              />
              {widgets?.budget?.bills > widgets?.budget?.billsLimit && (
                <Typography variant="caption" color="error">
                  از محدوده تعیین شده فراتر رفته‌اید!
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
        
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
            <Table size="small">
              <TableHead>
                <TableRow>
                  {widgets?.recentTransactions?.columns.map((column, index) => (
                    <TableCell key={index}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {widgets?.recentTransactions?.rows?.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{transaction.referenceCode}</TableCell>
                    <TableCell>{transaction.username}</TableCell>
                    <TableCell>{transaction.serviceNameFa || transaction.serviceName}</TableCell>
                    <TableCell>{new Intl.NumberFormat('fa-IR').format(transaction.amount)} ریال</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.statusStr}
                        color={transaction.status === 'COMPLETED' ? 'success' : transaction.status === 'PENDING' ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transaction.createdStr}</TableCell>
                  </TableRow>
                ))}
                {(!widgets?.recentTransactions?.rows || widgets?.recentTransactions?.rows.length === 0) && (
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
            <Table size="small">
              <TableHead>
                <TableRow>
                  {widgets?.recentPayments?.columns.map((column, index) => (
                    <TableCell key={index}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {widgets?.recentPayments?.rows?.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>{payment.id.substring(0, 8)}</TableCell>
                    <TableCell>{payment.username}</TableCell>
                    <TableCell>{payment.serviceFa || payment.service}</TableCell>
                    <TableCell>{new Intl.NumberFormat('fa-IR').format(payment.amount)} ریال</TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.paymentStatus}
                        size="small"
                        style={{ backgroundColor: payment.paymentStatusColor, color: '#ffffff' }}
                      />
                    </TableCell>
                    <TableCell>{payment.createdAtStr}</TableCell>
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