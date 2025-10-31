// src/app/components/finance/TransactionDetails.jsx
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button 
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const TransactionDetails = ({ transaction }) => {
  const handleDownloadInvoice = () => {
    // Redirect to invoice PDF endpoint
    if (transaction?.hasBill) {
      window.open(`/api/v1/payments/${transaction.id}/invoice`, '_blank');
    }
  };
  
  if (!transaction) {
    return (
      <Box p={3}>
        <Typography color="error">
          خطا در دریافت اطلاعات تراکنش
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h3">
              اطلاعات کلی
            </Typography>
            {transaction.hasBill && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ReceiptIcon />}
                onClick={handleDownloadInvoice}
                size="small"
              >
                دریافت فاکتور
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                شناسه تراکنش
              </Typography>
              <Typography variant="body1">{transaction.id}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                مبلغ
              </Typography>
              <Typography variant="body1">
                {new Intl.NumberFormat('fa-IR').format(transaction.amount)} ریال
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                سرویس
              </Typography>
              <Typography variant="body1">
                {transaction.serviceNameFa || transaction.serviceName}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                وضعیت
              </Typography>
              <Chip 
                label={transaction.statusStr || transaction.status}
                color={
                  transaction.status === 'COMPLETED' || transaction.statusStr === 'موفق' ? 'success' :
                  transaction.status === 'PENDING' || transaction.statusStr === 'در انتظار' ? 'warning' :
                  transaction.status === 'FAILED' || transaction.statusStr === 'ناموفق' ? 'error' : 'default'
                }
                size="small"
              />
            </Box>
            
            {transaction.username && (
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  نام کاربری
                </Typography>
                <Typography variant="body1">{transaction.username}</Typography>
              </Box>
            )}
            
            {transaction.userFullName && (
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  نام کامل کاربر
                </Typography>
                <Typography variant="body1">{transaction.userFullName}</Typography>
              </Box>
            )}
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                تاریخ ایجاد
              </Typography>
              <Box dir="rtl">
                <Typography variant="body1" dir="rtl">
                  {transaction.createdStr || transaction.createdAtStr}
                </Typography>
                <Typography variant="caption" color="textSecondary" dir="ltr">
                  {transaction.createdTimeStr || transaction.createdAtTimeStr}
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                آخرین بروزرسانی
              </Typography>
              <Box dir="rtl">
                <Typography variant="body1" dir="rtl">
                  {transaction.updatedStr || transaction.updatedAtStr}
                </Typography>
                <Typography variant="caption" color="textSecondary" dir="ltr">
                  {transaction.updatedTimeStr || transaction.updatedAtTimeStr}
                </Typography>
              </Box>
            </Box>
            
            {transaction.hasBill && (
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  شماره فاکتور
                </Typography>
                <Typography variant="body1">{transaction.billId}</Typography>
              </Box>
            )}
            
            {transaction.error && (
              <Box gridColumn="span 2">
                <Typography variant="subtitle2" color="error">
                  خطا
                </Typography>
                <Typography variant="body2" color="error">
                  {transaction.error}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* Payments related to this transaction could be shown here */}
    </Box>
  );
};

export default TransactionDetails;