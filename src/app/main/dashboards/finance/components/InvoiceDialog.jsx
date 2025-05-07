// src/app/components/finance/InvoiceDialog.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  IconButton, 
  Box, 
  CircularProgress 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import { motion } from 'framer-motion';

const InvoiceDialog = ({ open, onClose, invoiceId }) => {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);
  
  useEffect(() => {
    if (open && invoiceId) {
      setLoading(true);
    }
  }, [open, invoiceId]);
  
  const handleIframeLoad = () => {
    setLoading(false);
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={motion.div}
    >
      <DialogTitle>
        فاکتور
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
      <DialogContent dividers sx={{ height: '70vh', overflow: 'hidden' }}>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        )}
        <iframe
          ref={iframeRef}
          src={`/api/v1/payments/${invoiceId}/invoice`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: loading ? 'none' : 'block',
          }}
          onLoad={handleIframeLoad}
          title="Invoice"
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GetAppIcon />}
          onClick={() => window.open(`/api/v1/payments/${invoiceId}/invoice`, '_blank')}
        >
          دانلود فاکتور
        </Button>
        <Button onClick={onClose} color="secondary">
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDialog;