// src/app/main/apps/tickets/sidebars/main/NewTicketDialog.js
import { useState, useEffect } from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Chip
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { 
  useCreateTicketMutation,
  useGetTicketCategoriesQuery,
  useGetTicketDepartmentsQuery,
  useGetTicketPrioritiesQuery
} from '../../TicketingApi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define schema with Zod
const schema = z.object({
  subject: z.string().min(1, 'عنوان الزامی است'),
  category: z.string().min(1, 'دسته‌بندی الزامی است'),
  department: z.string().min(1, 'دپارتمان الزامی است'),
  priority: z.string().min(1, 'اولویت الزامی است'),
  message: z.string().min(1, 'پیام الزامی است')
});

function NewTicketDialog({ open, onClose }) {
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState([]);
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  
//   const { data: categories, isLoading: categoriesLoading } = useGetTicketCategoriesQuery();
//   const { data: departments, isLoading: departmentsLoading } = useGetTicketDepartmentsQuery();
//   const { data: priorities, isLoading: prioritiesLoading } = useGetTicketPrioritiesQuery();
  
  const categories = [
    { value: 'GENERAL', name: 'عمومی' },
    { value: 'TECHNICAL', name: 'فنی' },
    { value: 'FINANCIAL', name: 'مالی و اعتباری' }
  ];
  const departments = [
    { value: 'MANAGEMENT', name: 'مدیریت' },
    { value: 'SUPPORT', name: 'پشتیبانی' },
    { value: 'FINANCIAL', name: 'مالی' }
  ];
  const priorities = [
    { value: 'LOW', name: 'پایین' },
    { value: 'MEDIUM', name: 'متوسط' },
    { value: 'HIGH', name: 'بالا' },
    { value: 'URGENT', name: 'اضطراری' }
  ];
  const categoriesLoading = false;
  const departmentsLoading = false;
  const prioritiesLoading = false;
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: '',
      category: '',
      department: '',
      priority: '',
      message: ''
    }
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset();
      setAttachments([]);
    }
  }, [open, reset]);

  const handleAttachmentAdd = (event) => {
    const files = Array.from(event.target.files);
    setAttachments([...attachments, ...files]);
    // Reset the input so the same file can be selected again
    event.target.value = null;
  };

  const handleAttachmentRemove = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const onSubmit = async (data) => {
    try {
      const result = await createTicket({
        ...data,
        status: 'PENDING' // Default status for new tickets
      }).unwrap();
      
      // Navigate to the newly created ticket
      navigate(`/apps/ticketing/${result.id}`);
      onClose();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const isFormLoading = isLoading;

//   const isFormLoading = categoriesLoading || departmentsLoading || prioritiesLoading || isLoading;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle className="bg-primary text-white">
        <div className="flex items-center">
          <FuseSvgIcon className="mr-12">heroicons-outline:ticket</FuseSvgIcon>
          Create New Ticket
        </div>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="p-24">
          {isFormLoading ? (
            <div className="flex justify-center p-24">
              <CircularProgress />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="عنوان"
                        variant="outlined"
                        fullWidth
                        error={!!errors.subject}
                        helperText={errors?.subject?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.category}>
                        <InputLabel>دسته‌بندی</InputLabel>
                        <Select
                          {...field}
                          label="دسته‌بندی"
                        >
                          {categories?.map((category) => (
                            <MenuItem key={category.value} value={category.value}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.category && (
                          <Typography color="error" variant="caption">
                            {errors.category.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.department}>
                        <InputLabel>دپارتمان</InputLabel>
                        <Select
                          {...field}
                          label="دپارتمان"
                        >
                          {departments?.map((department) => (
                            <MenuItem key={department.value} value={department.value}>
                              {department.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.department && (
                          <Typography color="error" variant="caption">
                            {errors.department.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.priority}>
                        <InputLabel>اولویت</InputLabel>
                        <Select
                          {...field}
                          label="اولویت"
                        >
                          {priorities?.map((priority) => (
                            <MenuItem key={priority.value} value={priority.value}>
                              {priority.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.priority && (
                          <Typography color="error" variant="caption">
                            {errors.priority.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="پیام"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={6}
                        error={!!errors.message}
                        helperText={errors?.message?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Paper 
                    variant="outlined" 
                    className="p-16"
                    sx={{
                      backgroundColor: (theme) => theme.palette.background.default
                    }}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <Typography variant="subtitle2">فایل‌ها</Typography>
                        <input
                          type="file"
                          id="file-upload"
                          style={{ display: 'none' }}
                          onChange={handleAttachmentAdd}
                          multiple
                        />
                        <label htmlFor="file-upload">
                          <Button
                            component="span"
                            variant="outlined"
                            size="small"
                            startIcon={<FuseSvgIcon>heroicons-outline:paper-clip</FuseSvgIcon>}
                          >
                            اضافه کردن فایل‌ها
                          </Button>
                        </label>
                      </div>
                      
                      {attachments.length > 0 ? (
                        <div className="flex flex-wrap gap-8">
                          {attachments.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() => handleAttachmentRemove(index)}
                              size="small"
                            />
                          ))}
                        </div>
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          هیچ فایلی اضافه نشده است
                        </Typography>
                      )}
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </DialogContent>
        
        <DialogActions className="p-16 pb-24">
          <Button onClick={onClose} disabled={isLoading}>
            انصراف
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? 'ایجاد...' : 'ایجاد تیکت'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default NewTicketDialog;