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
  Grid,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateArchiveTaskMutation, useGetArchiveTypesQuery } from './store/archiveApi';

function CreateArchiveTaskDialog({ open, onClose, onShowSnackbar }) {
  const [createArchiveTask, { isLoading }] = useCreateArchiveTaskMutation();
  const { data: archiveTypes, isLoading: isLoadingTypes } = useGetArchiveTypesQuery();
  
  const [entityTypes] = useState([
    { value: 'Company', label: 'شرکت' },
    { value: 'Product', label: 'محصول' },
    { value: 'User', label: 'کاربر' },
    { value: 'Invoice', label: 'فاکتور' },
  ]);
  
  // Define validation schema with Zod
  const schema = z.object({
    name: z.string().min(1, 'نام وظیفه الزامی است'),
    description: z.string().optional(),
    entityName: z.string().min(1, 'نوع موجودیت الزامی است'),
    entityId: z.string().min(1, 'شناسه موجودیت الزامی است'),
    archiveType: z.string().min(1, 'نوع آرشیو الزامی است'),
    configuration: z.string().optional()
  });
  
  // Initialize react-hook-form
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      entityName: '',
      entityId: '',
      archiveType: 'MANUAL',
      configuration: ''
    },
    resolver: zodResolver(schema)
  });
  
  // Form submission handler
  const onSubmit = async (data) => {
    try {
      await createArchiveTask(data).unwrap();
      onShowSnackbar('وظیفه آرشیو با موفقیت ایجاد شد', 'success');
      reset();
      onClose();
    } catch (error) {
      onShowSnackbar(`خطا در ایجاد وظیفه آرشیو: ${error.message || 'خطای ناشناخته'}`, 'error');
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ایجاد وظیفه آرشیو جدید</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="نام وظیفه"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="توضیحات"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="entityName"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.entityName}>
                    <InputLabel>نوع موجودیت</InputLabel>
                    <Select
                      {...field}
                      label="نوع موجودیت"
                    >
                      {entityTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                      ))}
                    </Select>
                    {errors.entityName && (
                      <FormHelperText>{errors.entityName.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="entityId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="شناسه موجودیت"
                    fullWidth
                    required
                    error={!!errors.entityId}
                    helperText={errors.entityId?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="archiveType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.archiveType}>
                    <InputLabel>نوع آرشیو</InputLabel>
                    <Select
                      {...field}
                      label="نوع آرشیو"
                      disabled={isLoadingTypes}
                    >
                      {isLoadingTypes ? (
                        <MenuItem value="">
                          <CircularProgress size={24} />
                        </MenuItem>
                      ) : (
                        archiveTypes?.map((type) => (
                          <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                        ))
                      )}
                    </Select>
                    {errors.archiveType && (
                      <FormHelperText>{errors.archiveType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="configuration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="پیکربندی (JSON)"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.configuration}
                    helperText={errors.configuration?.message}
                    placeholder="{}"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={isLoading}>
            انصراف
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'ایجاد'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateArchiveTaskDialog;