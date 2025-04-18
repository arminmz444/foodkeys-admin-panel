import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';

export default function CompanyRequestModal({ open, onClose, action, request, description, setDescription }) {
  const handleSubmit = () => {
    console.log(`Action: ${action}, Request ID: ${request.id}, Description: ${description}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{action === 'approve' ? 'تایید درخواست' : 'رد درخواست'}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          آیا مطمئن هستید که می‌خواهید این درخواست را {action === 'approve' ? 'تأیید' : 'رد'} کنید؟
        </Typography>

        {action === 'reject' && (
          <TextField
            label="دلیل رد (اختیاری)"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>انصراف</Button>
        <Button onClick={handleSubmit} variant="contained" color={action === 'approve' ? 'success' : 'error'}>
          {action === 'approve' ? 'تایید' : 'رد'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
