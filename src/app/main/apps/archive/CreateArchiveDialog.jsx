// CreateArchiveDialog.jsx
import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  CircularProgress,
  FormHelperText,
  Typography
} from '@mui/material';
import { useGetArchiveTypesQuery, useCreateArchiveTaskMutation } from './FoodIndustryBankApi';

function CreateArchiveDialog({ 
  open, 
  onClose, 
  entityType = 'Company', 
  entityId, 
  entityName = '',
  onSuccess,
  onError 
}) {
  const { data: archiveTypes, isLoading: isLoadingTypes } = useGetArchiveTypesQuery();
  const [createArchiveTask, { isLoading: isCreating }] = useCreateArchiveTaskMutation();
  
  const [formData, setFormData] = useState({
    name: `آرشیو ${entityName || entityType} #${entityId}`,
    description: '',
    entityName: entityType,
    entityId: entityId,
    archiveType: 'MANUAL'
  });
  
  const [errors, setErrors] = useState({});
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'نام آرشیو الزامی است';
    }
    
    if (!formData.archiveType) {
      newErrors.archiveType = 'نوع آرشیو الزامی است';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await createArchiveTask(formData).unwrap();
      
      if (onSuccess) {
        onSuccess('درخواست ایجاد آرشیو با موفقیت ثبت شد');
      }
      
      // Reset form and close dialog
      setFormData({
        name: `آرشیو ${entityName || entityType} #${entityId}`,
        description: '',
        entityName: entityType,
        entityId: entityId,
        archiveType: 'MANUAL'
      });
      
      onClose();
    } catch (error) {
      if (onError) {
        onError(`خطا در ایجاد آرشیو: ${error.message || 'خطای ناشناخته'}`);
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
      <DialogTitle>ایجاد آرشیو جدید</DialogTitle>
      
      <DialogContent>
        <Box className="flex flex-col gap-16 py-16">
          <TextField
            name="name"
            label="نام آرشیو"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
          />
          
          <TextField
            name="description"
            label="توضیحات"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            error={Boolean(errors.description)}
            helperText={errors.description}
          />
          
          <FormControl fullWidth error={Boolean(errors.archiveType)} required>
            <InputLabel>نوع آرشیو</InputLabel>
            <Select
              name="archiveType"
              value={formData.archiveType}
              label="نوع آرشیو"
              onChange={handleInputChange}
              disabled={isLoadingTypes}
            >
              {isLoadingTypes ? (
                <MenuItem value="">
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                archiveTypes?.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.archiveType && (
              <FormHelperText>{errors.archiveType}</FormHelperText>
            )}
          </FormControl>
          
          <Box>
            <Typography variant="caption" color="textSecondary">
              موجودیت: {entityType} - شناسه: {entityId}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isCreating}>
          انصراف
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
          variant="contained"
          disabled={isCreating || isLoadingTypes}
        >
          {isCreating ? <CircularProgress size={24} /> : 'ایجاد آرشیو'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateArchiveDialog;