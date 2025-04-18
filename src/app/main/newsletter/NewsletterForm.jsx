// src/app/modules/newsletter/NewsletterForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema } from './newsletterValidation';
import { 
  useGetNewsletterQuery, 
  useCreateNewsletterMutation, 
  useUpdateNewsletterMutation 
} from './store/api/NewsletterApi';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import FormDateTimePicker from './components/FormDateTimePicker';
import CustomJoditWrapper from './components/CustomJoditWrapper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

// Function to get tomorrow's date in "YYYY-MM-DD HH:MM:SS" format
function getTomorrowFormattedDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const pad = (number) => (number < 10 ? '0' + number : number);
  
  const year = tomorrow.getFullYear();
  const month = pad(tomorrow.getMonth() + 1);
  const day = pad(tomorrow.getDate());
  const hours = pad(tomorrow.getHours());
  const minutes = pad(tomorrow.getMinutes());
  const seconds = pad(tomorrow.getSeconds());
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function NewsletterForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  // State to hold the current content from the editor to avoid re-renders
  const [editorContent, setEditorContent] = useState('');

  // Fetch newsletter data if editing
  const { data: newsletterData, isLoading: isLoadingNewsletter, error: loadError } = 
    useGetNewsletterQuery(id, { skip: !isEditing });

  // Mutations for create and update
  const [createNewsletter, { isLoading: isCreating, error: createError }] = useCreateNewsletterMutation();
  const [updateNewsletter, { isLoading: isUpdating, error: updateError }] = useUpdateNewsletterMutation();

  // Form setup with zod validation
  const methods = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      title: '',
      content: '',
      scheduledDate: getTomorrowFormattedDate() // Tomorrow in "YYYY-MM-DD HH:MM:SS" format
    }
  });

  const { reset, handleSubmit, control, formState, setValue } = methods;
  const { isDirty, isValid, errors } = formState;

  // Set editor content when data is loaded
  useEffect(() => {
    if (isEditing && newsletterData) {
      // Set editor content directly to avoid re-renders
      setEditorContent(newsletterData.content || '');
      
      // Use reset for other fields
      reset({
        title: newsletterData.title || '',
        scheduledDate: newsletterData.scheduledDate || getTomorrowFormattedDate()
      });
      
      // Set content field value separately
      setValue('content', newsletterData.content || '', { shouldDirty: true });
    }
  }, [isEditing, newsletterData, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      // Make sure to include the latest editor content
      const formData = {
        ...data,
        content: editorContent
      };
      
      if (isEditing) {
        await updateNewsletter({ id, newsletterData: formData }).unwrap();
      } else {
        await createNewsletter(formData).unwrap();
      }
      navigate('/newsletters');
    } catch (error) {
      console.error('Failed to save newsletter:', error);
    }
  };

  // Handle the editor content change
  const handleEditorChange = (newContent) => {
    setEditorContent(newContent);
    setValue('content', newContent, { shouldDirty: true });
  };

  if (isEditing && isLoadingNewsletter) {
    return (
      <div className="w-full flex justify-center mt-24">
        <CircularProgress />
      </div>
    );
  }

  if (isEditing && loadError) {
    return (
      <Alert severity="error" className="mt-16">
        خطا در بارگذاری خبرنامه
      </Alert>
    );
  }

  const error = createError || updateError;

  return (
    <div className="w-full p-24 md:p-32" dir="rtl">
      <div className="mb-24">
        <Breadcrumbs aria-label="breadcrumb" dir="rtl">
          <Link color="inherit" href="#" onClick={() => navigate('/newsletters')}>
            خبرنامه‌ها
          </Link>
          <Typography color="textPrimary">
            {isEditing ? 'ویرایش خبرنامه' : 'ایجاد خبرنامه'}
          </Typography>
        </Breadcrumbs>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-24">
        <Typography
          component={motion.h1}
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold tracking-tight leading-tight"
        >
          {isEditing ? 'ویرایش خبرنامه' : 'ایجاد خبرنامه'}
        </Typography>

        <div className="flex items-center mt-12 sm:mt-0 space-x-0 space-x-reverse space-x-8">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/newsletters')}
            className="whitespace-nowrap ml-8"
          >
            انصراف
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty || !isValid || isCreating || isUpdating}
            startIcon={isCreating || isUpdating ? <CircularProgress size={16} /> : null}
            className="whitespace-nowrap"
          >
            {isCreating || isUpdating ? 'در حال ذخیره...' : 'ذخیره'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert severity="error" className="mb-24">
          خطا در ذخیره خبرنامه
        </Alert>
      )}

      <Paper component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-24 md:p-32 shadow rounded-lg">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-24">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="عنوان"
                  placeholder="عنوان خبرنامه را وارد کنید"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <FuseSvgIcon className="ml-8" size={20}>heroicons-outline:mail</FuseSvgIcon>
                    )
                  }}
                  inputProps={{ dir: "rtl" }}
                  InputLabelProps={{ style: { right: 24, left: 'auto' } }}
                />
              )}
            />

            <FormDateTimePicker
              name="scheduledDate"
              label="تاریخ زمانبندی"
              minDateTime={new Date()}
            />

            {/* Use CustomJoditWrapper directly with local state instead of Controller */}
            <CustomJoditWrapper 
              initialValue={editorContent}
              onChange={handleEditorChange}
              label="محتوا"
              placeholder="محتوای خبرنامه را وارد کنید..."
              error={!!errors.content}
              errorMessage={errors.content?.message}
            />
          </form>
        </FormProvider>
      </Paper>
    </div>
  );
}

export default NewsletterForm;