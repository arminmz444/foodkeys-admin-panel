// src/app/main/banks/food-industry-bank/company/tabs/MiniAppTab.jsx
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import FuseLoading from "@fuse/core/FuseLoading";
import { getMiniappsByCompanyId, deleteMiniapp } from '../../FoodIndustryBankApi';
import EnhancedGrapesJSEditor from '@/app/shared-components/EnhancedGrapesJSEditor';

/**
 * MiniApp Tab Component for the Company page
 * This tab displays the MiniApps associated with the company and allows creating, editing, and deleting them
 */
function MiniAppTab() {
  const methods = useFormContext();
  const { watch } = methods;
  const companyId = watch('id');
  
  const [miniapps, setMiniapps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedMiniapp, setSelectedMiniapp] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  // Fetch MiniApps for this company
  useEffect(() => {
    if (!companyId) return;
    
    const fetchMiniapps = async () => {
      try {
        setLoading(true);
        const response = await getMiniappsByCompanyId(companyId);
        setMiniapps(response);
      } catch (err) {
        console.error('Error fetching miniapps:', err);
        setError('خطا در بارگذاری مینی‌اپ‌ها');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMiniapps();
  }, [companyId]);
  
  // Open editor for creating a new MiniApp
  const handleCreateNew = () => {
    setSelectedMiniapp(null);
    setEditorOpen(true);
  };
  
  // Open editor for editing an existing MiniApp
  const handleEdit = (miniapp) => {
    setSelectedMiniapp(miniapp);
    setEditorOpen(true);
  };
  
  // Open preview for a MiniApp
  const handlePreview = (miniapp) => {
    setSelectedMiniapp(miniapp);
    setPreviewOpen(true);
  };
  
  // Open delete confirmation dialog
  const handleDeleteClick = (miniapp) => {
    setSelectedMiniapp(miniapp);
    setConfirmDeleteOpen(true);
  };
  
  // Handle MiniApp deletion
  const handleConfirmDelete = async () => {
    if (!selectedMiniapp) return;
    
    try {
      await deleteMiniapp(selectedMiniapp.id);
      
      // Update the local state
      setMiniapps(prevMiniapps => 
        prevMiniapps.filter(m => m.id !== selectedMiniapp.id)
      );
      
      setConfirmDeleteOpen(false);
      setSelectedMiniapp(null);
    } catch (err) {
      console.error('Error deleting miniapp:', err);
      setError('خطا در حذف مینی‌اپ');
    }
  };
  
  // Handle saving a MiniApp from the editor
  const handleSaveMiniapp = (savedMiniapp) => {
    // Update the local state
    setMiniapps(prevMiniapps => {
      const index = prevMiniapps.findIndex(m => m.id === savedMiniapp.id);
      if (index >= 0) {
        // Update existing MiniApp
        const updated = [...prevMiniapps];
        updated[index] = savedMiniapp;
        return updated;
      } else {
        // Add new MiniApp
        return [...prevMiniapps, savedMiniapp];
      }
    });
    
    setEditorOpen(false);
    setSelectedMiniapp(null);
  };
  
  // Close editor
  const handleCloseEditor = () => {
    setEditorOpen(false);
    setSelectedMiniapp(null);
  };
  
  // Show loading state
  if (loading) {
    return <FuseLoading />;
  }
  
  return (
    <div>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">مینی‌اپ‌های شرکت</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          ایجاد مینی‌اپ جدید
        </Button>
      </Box>
      
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}
      
      {miniapps.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary" sx={{ mb: 2 }}>
            هیچ مینی‌اپی برای این شرکت تعریف نشده است
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            ایجاد اولین مینی‌اپ
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {miniapps.map((miniapp) => (
            <Grid item xs={12} md={6} lg={4} key={miniapp.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {miniapp.name} <Typography component="span" variant="body2" color="textSecondary">v{miniapp.version}</Typography>
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    مسیر: {miniapp.routePath}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {miniapp.description || 'بدون توضیحات'}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    نوع ادغام: {miniapp.integrationType === 'iframe' ? 'آی‌فریم' : 'ماژول فدراسیون'}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    نوع کلاینت: {miniapp.clientType === 'ADMIN_PANEL_CLIENT' ? 'پنل ادمین' : 'پورتال عمومی'}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <IconButton onClick={() => handlePreview(miniapp)} title="پیش‌نمایش">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(miniapp)} title="ویرایش">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(miniapp)} title="حذف">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* GrapesJS Editor Dialog */}
      <Dialog
        fullScreen
        open={editorOpen}
        onClose={handleCloseEditor}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedMiniapp ? `ویرایش ${selectedMiniapp.name}` : 'ایجاد مینی‌اپ جدید'}
          <IconButton
            onClick={handleCloseEditor}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: 'calc(100vh - 64px)' }}>
          <EnhancedGrapesJSEditor
            companyId={companyId}
            miniappId={selectedMiniapp?.id}
            onSave={handleSaveMiniapp}
          />
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          پیش‌نمایش: {selectedMiniapp?.name}
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '80vh' }}>
          {selectedMiniapp && (
            <iframe
              src={`/api/miniapps/${selectedMiniapp.id}/render?companyId=${companyId}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={selectedMiniapp.name}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>بستن</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>حذف مینی‌اپ</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف مینی‌اپ "{selectedMiniapp?.name}" اطمینان دارید؟
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            این عملیات غیرقابل بازگشت است و تمام محتوای مینی‌اپ حذف خواهد شد.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>لغو</Button>
          <Button onClick={handleConfirmDelete} color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MiniAppTab;