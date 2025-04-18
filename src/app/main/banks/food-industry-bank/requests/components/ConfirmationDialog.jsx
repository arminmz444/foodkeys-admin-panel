import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Button,
  IconButton,
  Alert
} from '@mui/material';
import { X, AlertTriangle, Check } from 'lucide-react';

export default function ConfirmationDialog({ open, title, onClose, onConfirm }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!comment.trim()) {
      setError('لطفا توضیحات را وارد کنید');
      return;
    }
    
    onConfirm(comment);
    setComment('');
    setError('');
  };

  const handleClose = () => {
    setComment('');
    setError('');
    onClose();
  };

  const isApprove = title.includes('تایید');

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center">
          {isApprove ? (
            <Check size={20} color="#4caf50" className="mr-2" />
          ) : (
            <AlertTriangle size={20} color="#f44336" className="mr-2" />
          )}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <X />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          label="توضیحات"
          placeholder="لطفا دلیل تایید/رد درخواست را وارد کنید"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (e.target.value.trim()) setError('');
          }}
          error={!!error}
          helperText={error || 'این توضیحات برای کاربر ارسال می‌شود'}
          sx={{ mb: 2, mt: 1 }}
          autoFocus
        />

        <Typography variant="body2" color="text.secondary">
          این عملیات قابل بازگشت نیست. لطفا قبل از ثبت تایید نمایید.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={handleClose}>
          انصراف
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          color={isApprove ? "success" : "error"}
          endIcon={isApprove ? <Check size={18} /> : <AlertTriangle size={18} />}
        >
          {isApprove ? 'تایید نهایی' : 'رد درخواست'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}