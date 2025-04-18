import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { getRequestStatusName, getRequestTypeName } from '../mockData';

export default function RequestDetailsModal({ open, onClose, action, request }) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{action === 'approve' ? 'تایید درخواست' : 'رد درخواست'}</DialogTitle>
      <DialogContent>
        <Typography>درخواست: {getRequestTypeName(request.requestType)}</Typography>
        <Typography>درخواست‌دهنده: {request.requester.name}</Typography>
        <Typography>شرکت: {request.company.companyName}</Typography>
        {action === 'reject' && (
          <TextField
            label="دلیل رد"
            multiline rows={4}
            fullWidth value={reason}
            onChange={e => setReason(e.target.value)}
            className="mt-4"
          />
        )}
        {action === 'approve' && (
          <TextField
            label="توضیحات"
            multiline rows={4}
            fullWidth value={reason}
            onChange={e => setDescription(e.target.value)}
            className="mt-16"
          />
        )}
        <Typography variant="body2" color="text.secondary" className="mt-8 mb-4">
                  این عملیات قابل بازگردانی نیست؛ لطفا از صحت آن اطمینان حاصل فرمایید.
                </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>انصراف</Button>
        <Button variant="contained" color={action==='approve'?'success':'error'} onClick={()=>{console.log(action, request.id, reason); onClose();}}>
          {action==='approve'?'تایید':'رد'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
