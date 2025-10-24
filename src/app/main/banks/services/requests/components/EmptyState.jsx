import { Box, Typography, Button } from '@mui/material';
import { Filter, RefreshCw, Inbox } from 'lucide-react';

export default function EmptyState({ message, onReset, onRefresh }) {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 5,
        minHeight: 400,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}
    >
      <Inbox 
        size={80} 
        strokeWidth={1} 
        color="#9e9e9e" 
        style={{ marginBottom: 24, opacity: 0.6 }}
      />

      <Typography variant="h6" gutterBottom>
        {message || 'نتیجه‌ای یافت نشد'}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
        درخواست سرویسی با فیلترهای انتخاب شده پیدا نشد. فیلترها را تغییر دهید یا با اطلاعات دیگری جستجو کنید.
      </Typography>

      {(onReset || onRefresh) && (
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {onReset && (
            <Button
              variant="outlined"
              startIcon={<Filter size={16} />}
              onClick={onReset}
            >
              پاک کردن فیلترها
            </Button>
          )}
          
          {onRefresh && (
            <Button
              variant="contained"
              startIcon={<RefreshCw size={16} />}
              onClick={onRefresh}
            >
              بارگذاری مجدد
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
