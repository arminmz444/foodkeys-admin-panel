import { Box, Typography, Button } from '@mui/material';
import { AssignmentOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function ArchiveTaskNotFound({ onRefresh }) {
  const navigate = useNavigate();
  
  return (
    <Box className="w-full p-32 flex flex-col items-center justify-center">
      <AssignmentOutlined className="text-96 text-gray-400" />
      <Typography variant="h5" className="mt-16 mb-8">
        هیچ وظیفه آرشیوی یافت نشد!
      </Typography>
      <Typography variant="body1" className="mb-16 text-center">
        وظیفه آرشیوی با مشخصات مورد نظر شما یافت نشد. فیلترها را تغییر دهید یا یک وظیفه جدید ایجاد کنید.
      </Typography>
      <Box className="flex gap-16">
        {onRefresh && (
          <Button
            variant="outlined"
            color="primary"
            onClick={onRefresh}
          >
            تلاش مجدد
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/apps/archive-tasks')}
        >
          بازگشت به صفحه اصلی
        </Button>
      </Box>
    </Box>
  );
}

export default ArchiveTaskNotFound;