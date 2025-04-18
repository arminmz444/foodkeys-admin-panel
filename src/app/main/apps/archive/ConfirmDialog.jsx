import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from '@mui/material';

function ConfirmDialog({ 
  open, 
  title, 
  content, 
  confirmText, 
  cancelText, 
  confirmColor = 'primary', 
  onConfirm, 
  onCancel 
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText || 'انصراف'}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" autoFocus>
          {confirmText || 'تایید'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;