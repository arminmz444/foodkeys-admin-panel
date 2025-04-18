import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box 
      className="flex flex-col items-center justify-center p-24" 
      style={{ minHeight: '400px' }}
    >
      <Paper className="p-24 max-w-lg w-full">
        <Box className="flex flex-col items-center mb-24">
          <ErrorIcon color="error" style={{ fontSize: 64 }} />
          <Typography variant="h5" className="mt-16 mb-8">
            خطایی رخ داده است
          </Typography>
          <Typography variant="body1" color="textSecondary" className="text-center">
            متأسفانه خطایی در بارگذاری این بخش رخ داده است. لطفاً صفحه را مجدداً بارگذاری کنید.
          </Typography>
        </Box>
        
        {process.env.NODE_ENV !== 'production' && error && (
          <Box className="mb-24">
            <Typography variant="subtitle2" color="error">
              خطا: {error.toString()}
            </Typography>
            {error.stack && (
              <pre className="bg-gray-100 p-16 rounded overflow-auto mt-8 text-xs">
                {error.stack}
              </pre>
            )}
          </Box>
        )}
        
        <Box className="flex justify-center">
          <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
            تلاش مجدد
          </Button>
          
          <Button 
            variant="outlined" 
            color="inherit" 
            className="ml-16"
            onClick={() => window.location.reload()}
          >
            بارگذاری مجدد صفحه
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ErrorFallback;