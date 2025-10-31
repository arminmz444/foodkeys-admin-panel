// src/app/components/finance/UserInfoModal.jsx
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { useGetUserInfoQuery } from '../FinanceDashboardApi';

const UserInfoModal = ({ open, onClose, userId }) => {
  const { data: userInfo, isLoading, error } = useGetUserInfoQuery(userId, {
    skip: !userId || !open
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon />
          اطلاعات کاربر
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
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
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box textAlign="center" py={4}>
            <Typography color="error">
              خطا در دریافت اطلاعات کاربر
            </Typography>
          </Box>
        ) : userInfo ? (
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    نام کاربری
                  </Typography>
                  <Typography variant="body1">
                    {userInfo.username || 'نامشخص'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    نام کامل
                  </Typography>
                  <Typography variant="body1">
                    {userInfo.userFullName || userInfo.fullName || userInfo.firstName + " " + userInfo.lastName || 'نامشخص'}
                  </Typography>
                </Box>
                
                {userInfo.email && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      ایمیل
                    </Typography>
                    <Typography variant="body1">{userInfo.email}</Typography>
                  </Box>
                )}
                
                {userInfo.phone && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      تلفن
                    </Typography>
                    <Typography variant="body1">{userInfo.phone}</Typography>
                  </Box>
                )}
                
                {userInfo.id && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      شناسه کاربر
                    </Typography>
                    <Typography variant="body1">{userInfo.id}</Typography>
                  </Box>
                )}
                
                {userInfo.createdAt && (
                  <Box gridColumn="span 2">
                    <Typography variant="subtitle2" color="textSecondary">
                      تاریخ عضویت
                    </Typography>
                    <Typography variant="body1">
                      {new Date(userInfo.createdAt).toLocaleDateString('fa-IR')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography color="textSecondary">
              اطلاعات کاربر یافت نشد
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserInfoModal;
