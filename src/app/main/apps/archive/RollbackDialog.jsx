import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { useRollbackToArchiveMutation } from './store/archiveApi';

function RollbackDialog({ 
  open, 
  onClose, 
  archiveId, 
  archiveName = '',
  onSuccess,
  onError 
}) {
  const [rollbackToArchive, { isLoading }] = useRollbackToArchiveMutation();
  const [reason, setReason] = useState('');
  
  // Handle rollback
  const handleRollback = async () => {
    try {
      await rollbackToArchive({
        archiveId,
        reason: reason || 'بازگشت به نسخه قبلی'
      }).unwrap();
      
      if (onSuccess) {
        onSuccess('بازگشت به آرشیو با موفقیت انجام شد');
      }
      
      setReason('');
      onClose();
    } catch (error) {
      if (onError) {
        onError(`خطا در بازگشت به آرشیو: ${error.message || 'خطای ناشناخته'}`);
      }
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>بازگشت به آرشیو</DialogTitle>
      
      <DialogContent>
        <Box className="flex flex-col gap-16 py-16">
          <Alert severity="warning">
            با بازگشت به این آرشیو، اطلاعات فعلی موجودیت با اطلاعات موجود در آرشیو جایگزین خواهد شد. این عملیات غیرقابل بازگشت است.
          </Alert>
          
          {archiveName && (
            <Typography variant="body2">
              نام آرشیو: <strong>{archiveName}</strong>
            </Typography>
          )}
          
          <TextField
            label="دلیل بازگشت"
            fullWidth
            multiline
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="دلیل بازگشت به این آرشیو را وارد کنید"
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          انصراف
        </Button>
        <Button 
          onClick={handleRollback} 
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'بازگشت به آرشیو'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RollbackDialog;