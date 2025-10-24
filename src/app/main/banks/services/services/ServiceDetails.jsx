import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FuseLoading from '@fuse/core/FuseLoading';
import { 
  TextField, 
  Button, 
  MenuItem, 
  Paper, 
  Box, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Snackbar
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useParams, useNavigate } from 'react-router-dom';
import FormPreview from '../../../../shared-components/form-builder/FormPreview';
import { useGetServiceByIdQuery, useUpdateServiceMutation, useCreateServiceMutation, useDeleteServiceMutation } from '../ServicesBankApi';
import { convertSchemaToFields, formatFormDataForApi } from '../../../../../utils/schemaConverter';
import axios from 'axios';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreateMode = !id || id === 'new';
  const isDraft = id && id.toString().startsWith('draft-');
  
  // State
  const [localService, setLocalService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({});
  const [schemaFields, setSchemaFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [jsonSchema, setJsonSchema] = useState(null);
  const [error, setError] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Queries
  const { data: serviceFromApi, isLoading: apiLoading } = useGetServiceByIdQuery(id, { 
    skip: isCreateMode || isDraft 
  });
  
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      nameEn: '',
      ranking: 0,
      rankingAll: 0,
      description: '',
      subCategoryId: '',
      elasticFields: '',
      status: 0
    }
  });

  // Get current user data and check for ADMIN_ACCESS
  const user = useAppSelector(selectUser);
  const hasAdminAccess = user?.data?.accesses?.includes('ADMIN_ACCESS') || 
    user?.accesses?.includes('ADMIN_ACCESS') || 
    user?.userAccesses?.some(access => access.name === 'ADMIN_ACCESS');

  // Service status options
  const serviceStatusOptions = [
    { value: 0, label: 'در انتظار تایید' },
    { value: 1, label: 'تایید شده' },
    { value: 2, label: 'رد شده' },
    { value: 3, label: 'آرشیو شده' },
    { value: 4, label: 'حذف شده' },
    { value: 5, label: 'ویرایش شده' },
    { value: 6, label: 'منتشر شده' },
    { value: 7, label: 'بازبینی' },
    { value: 8, label: 'ثبت اولیه' }
  ];

  const getStatusColor = (statusValue) => {
    const colorMap = {
      0: '#ffc107', // PENDING
      1: '#4caf50', // VERIFIED
      2: '#f44336', // DENIED
      3: '#482880', // ARCHIVED
      4: '#aa2e25', // DELETED
      5: '#3f50b5', // UPDATED
      6: '#8561c5', // PUBLISHED
      7: '#ffeb3b', // REVISION
      8: '#d7e360'  // SUBMIT
    };
    return colorMap[statusValue] || '#000000';
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Watch subcategory ID to load schema when it changes
  const watchSubCategoryId = watch('subCategoryId');

  // Handle form data from FormPreview component
  const handleFormDataChange = (data) => {
    setServiceFormData(data);
  };

  // Fetch subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get('/subcategory/options?categoryId=4&pageSize=100');
        if (response.data.status === "SUCCESS") {
          setSubcategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setError("خطا در دریافت زیرشاخه‌ها");
      }
    };
    
    fetchSubCategories();
  }, []);

  // Fetch schema when subcategory changes (in create/draft mode)
  useEffect(() => {
    const fetchSubCategorySchema = async (subCategoryId) => {
      if (!subCategoryId) return;
      
      setIsLoadingSchema(true);
      try {
        const response = await axios.get(`/subcategory/${subCategoryId}/schema`);
        if (response.data.status === "SUCCESS" && response.data.data) {
          const schema = response.data.data;
          setJsonSchema(schema.schemaDefinition);
          
          if (schema.schemaDefinition && schema.schemaDefinition.properties) {
            const fieldsArray = convertSchemaToFields(schema.schemaDefinition);
            setSchemaFields(fieldsArray);
            setFormTitle(schema.formTitle || 'فرم سرویس');
            setFormDescription(schema.formDescription || '');
          }
        }
      } catch (error) {
        console.error("Error fetching schema:", error);
        setError("خطا در دریافت ساختار فرم");
      } finally {
        setIsLoadingSchema(false);
      }
    };

    // Only fetch schema on subcategory change for create/draft mode
    if ((isCreateMode || isDraft) && watchSubCategoryId && watchSubCategoryId !== selectedSubcategory) {
      setSelectedSubcategory(watchSubCategoryId);
      // Reset form data when subcategory changes
      setServiceFormData({});
      fetchSubCategorySchema(watchSubCategoryId);
    }
  }, [watchSubCategoryId, isCreateMode, isDraft, selectedSubcategory]);

  // Initialize form and schema data
  useEffect(() => {
    if (isDraft) {
      // Handle draft services from localStorage
      const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
      const found = drafts.find((draft) => draft.id === id);
      if (found) {
        setLocalService(found);
        reset({
          name: found.name || '',
          nameEn: found.nameEn || '',
          ranking: found.ranking || 0,
          rankingAll: found.rankingAll || 0,
          description: found.description || '',
          subCategoryId: found.subCategoryId || '',
          elasticFields: found.elasticFields ? found.elasticFields.join(',') : '',
          status: found.status || 0
        });
        
        // Set form data for preview
        setServiceFormData(found.serviceData || {});
        
        // Load schema if subcategory is set
        if (found.subCategoryId) {
          setSelectedSubcategory(found.subCategoryId);
          fetchSubCategorySchema(found.subCategoryId);
        }
      }
    } else if (isCreateMode) {
      // Handle new service creation
      reset({
        name: '',
        nameEn: '',
        ranking: 0,
        rankingAll: 0,
        description: '',
        subCategoryId: '',
        elasticFields: '',
        status: 0
      });
      setServiceFormData({});
    } else if (serviceFromApi) {
      // Handle services from API (edit mode)
      reset({
        name: serviceFromApi.name || '',
        nameEn: serviceFromApi.nameEn || '',
        ranking: serviceFromApi.ranking || 0,
        rankingAll: serviceFromApi.rankingAll || 0,
        description: serviceFromApi.description || '',
        subCategoryId: serviceFromApi.subCategoryId || '',
        elasticFields: serviceFromApi.elasticFields ? serviceFromApi.elasticFields.join(',') : '',
        status: serviceFromApi.status || 0
      });
      
      // Set form data for preview
      setServiceFormData(serviceFromApi.data || {});
      
      // Extract schema information if available
      if (serviceFromApi.serviceSchemaDTO) {
        try {
          const schema = serviceFromApi.serviceSchemaDTO.schemaDefinition;
          setJsonSchema(schema);
          
          if (schema && schema.properties) {
            const fieldsArray = convertSchemaToFields(schema);
            setSchemaFields(fieldsArray);
            setFormTitle(serviceFromApi.serviceSchemaDTO.formTitle || 'فرم سرویس');
            setFormDescription(serviceFromApi.serviceSchemaDTO.formDescription || '');
          }
        } catch (err) {
          console.error('Error processing schema:', err);
          setError('خطا در پردازش اسکیمای فرم');
        }
      }
    }
  }, [isDraft, isCreateMode, id, serviceFromApi, reset]);

  // Helper function to fetch subcategory schema
  const fetchSubCategorySchema = async (subCategoryId) => {
    if (!subCategoryId) return;
    
    setIsLoadingSchema(true);
    try {
      const response = await axios.get(`/subcategory/${subCategoryId}/schema`);
      if (response.data.status === "SUCCESS" && response.data.data) {
        const schema = response.data.data;
        setJsonSchema(schema.schemaDefinition);
        
        if (schema.schemaDefinition && schema.schemaDefinition.properties) {
          const fieldsArray = convertSchemaToFields(schema.schemaDefinition);
          setSchemaFields(fieldsArray);
          setFormTitle(schema.formTitle || 'فرم سرویس');
          setFormDescription(schema.formDescription || '');
        }
      }
    } catch (error) {
      console.error("Error fetching schema:", error);
      setError("خطا در دریافت ساختار فرم");
    } finally {
      setIsLoadingSchema(false);
    }
  };

  // Submit both form data and schema data
  const onSubmit = async (data) => {
    try {
      // Format form data according to schema
      const formattedSchemaData = jsonSchema 
        ? formatFormDataForApi(serviceFormData, jsonSchema) 
        : serviceFormData;
      
      // Prepare elasticFields array from comma-separated string
      const elasticFieldsArray = data.elasticFields
        ? data.elasticFields.split(',').map((field) => field.trim()).filter(field => field)
        : [];
      
      if (isDraft) {
        // Convert draft to real service via API
        // Create new service from draft data
        const newService = {
          name: data.name,
          nameEn: data.nameEn,
          ranking: parseInt(data.ranking) || 0,
          rankingAll: parseInt(data.rankingAll) || 0,
          description: data.description,
          subCategoryId: parseInt(data.subCategoryId) || 0,
          elasticFields: elasticFieldsArray,
          data: formattedSchemaData,
          additionalData: null, // Set to null as per Spring Boot DTO
          status: parseInt(data.status) || 0
        };
        
        // Call the API to create a new service
        await createService(newService).unwrap();
        showNotification('سرویس با موفقیت ایجاد شد!');
        
        // Remove draft from localStorage after successful creation
        const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
        const updatedDrafts = drafts.filter(draft => draft.id !== id);
        localStorage.setItem('draftServices', JSON.stringify(updatedDrafts));
        
        navigate('/banks/service');
      } else if (isCreateMode) {
        // Create new service via API
        const newService = {
          name: data.name,
          nameEn: data.nameEn,
          ranking: parseInt(data.ranking) || 0,
          rankingAll: parseInt(data.rankingAll) || 0,
          description: data.description,
          subCategoryId: parseInt(data.subCategoryId) || 0,
          elasticFields: elasticFieldsArray,
          data: formattedSchemaData,
          additionalData: null, // Set to null as per Spring Boot DTO
          status: parseInt(data.status) || 0
        };
        
        await createService(newService).unwrap();
        showNotification('سرویس با موفقیت ایجاد شد!');
        navigate('/banks/service');
      } else {
        // Update service via API
        const updatedService = {
          id: serviceFromApi.id,
          name: data.name,
          nameEn: data.nameEn,
          ranking: parseInt(data.ranking) || 0,
          rankingAll: parseInt(data.rankingAll) || 0,
          description: data.description,
          subCategoryId: parseInt(data.subCategoryId) || 0,
          elasticFields: elasticFieldsArray,
          data: formattedSchemaData,
          additionalData: serviceFromApi.additionalData || null,
          status: parseInt(data.status) || 0
        };
        
        await updateService({ id: serviceFromApi.id, service: updatedService }).unwrap();
        showNotification('سرویس با موفقیت بروزرسانی شد');
        navigate('/banks/service');
      }
    } catch (err) {
      console.error('Operation failed:', err);
      setError(isCreateMode || isDraft ? 'خطا در ایجاد سرویس' : 'خطا در به‌روزرسانی سرویس');
      showNotification(
        isCreateMode || isDraft ? 'خطا در ایجاد سرویس' : 'خطا در به‌روزرسانی سرویس', 
        'error'
      );
    }
  };

  const handleDelete = async () => {
    try {
      if (isDraft) {
        const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
        const updatedDrafts = drafts.filter(draft => draft.id !== id);
        localStorage.setItem('draftServices', JSON.stringify(updatedDrafts));
        showNotification('پیش‌نویس سرویس با موفقیت حذف شد!');
      } else if (!isCreateMode) {
        await deleteService(id).unwrap();
        showNotification('سرویس با موفقیت حذف شد!');
      }
      navigate('/banks/service');
    } catch (err) {
      console.error('Delete failed:', err);
      setError('خطا در حذف سرویس');
      showNotification('خطا در حذف سرویس', 'error');
    }
  };

  // Find subcategory label by ID
  const getSubcategoryLabel = (subcategoryId) => {
    const subcategory = subcategories.find(item => item.value.toString() === subcategoryId.toString());
    return subcategory ? subcategory.label : subcategoryId;
  };

  if ((!isCreateMode && !isDraft && apiLoading) || (isDraft && !localService && !isCreateMode)) {
    return <FuseLoading />;
  }

  return (
    <div className="p-8 sm:p-16 max-w-5xl mx-auto">
      <Box className="flex flex-row items-center mb-6">
        <Typography variant="h4" className="flex-grow">
          {isCreateMode ? 'ایجاد سرویس جدید' : (isDraft ? 'تبدیل پیش‌نویس به سرویس' : 'ویرایش سرویس')}
        </Typography>
        
        {/* Status Select - Only show to admin users and not in create mode */}
        {hasAdminAccess && !isCreateMode && (
          <FormControl variant="outlined" className="min-w-160 ml-4" size="small">
            <InputLabel id="service-status-label">وضعیت</InputLabel>
            <Select
              labelId="service-status-label"
              label="وضعیت"
              {...register('status')}
              value={watch('status') || 0}
              onChange={(e) => setValue('status', e.target.value, { shouldDirty: true })}
            >
              {serviceStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <div 
                      style={{ 
                        backgroundColor: getStatusColor(option.value),
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        marginRight: '8px',
                        marginLeft: '8px'
                      }} 
                    />
                    {option.label}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        {!isCreateMode && (
          <Button 
            variant="outlined" 
            color="error"
            className="ml-4"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            حذف
          </Button>
        )}
        <Button 
          variant="outlined" 
          className="ml-4"
          onClick={() => navigate('/banks/service')}
        >
          انصراف
        </Button>
      </Box>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف این {isDraft ? 'پیش‌نویس سرویس' : 'سرویس'} اطمینان دارید؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>انصراف</Button>
          <Button 
            onClick={() => {
              setDeleteDialogOpen(false);
              handleDelete();
            }} 
            color="error"
            variant="contained"
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
      
      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper className="p-6 mb-8" elevation={2}>
          <Typography variant="h6" className="mb-4">
            اطلاعات پایه سرویس
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField 
              fullWidth 
              label="نام سرویس" 
              {...register('name', { required: 'نام سرویس الزامی است' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              variant="outlined" 
            />
            <TextField 
              fullWidth 
              label="نام انگلیسی سرویس" 
              {...register('nameEn')} 
              variant="outlined" 
            />
            <TextField 
              fullWidth 
              label="رتبه" 
              type="number" 
              {...register('ranking')} 
              variant="outlined" 
            />
            <TextField 
              fullWidth 
              label="رتبه کلی" 
              type="number" 
              {...register('rankingAll')} 
              variant="outlined" 
            />
            
            {/* Subcategory Select - disabled in edit mode, enabled in create/draft mode */}
            {(!isCreateMode && !isDraft) ? (
              // Edit mode - show selected subcategory as text
              <TextField 
                fullWidth 
                label="زیر شاخه" 
                value={getSubcategoryLabel(watchSubCategoryId)}
                disabled
                variant="outlined"
              />
            ) : (
              // Create/Draft mode - show select dropdown
              <FormControl 
                fullWidth 
                error={!!errors.subCategoryId}
                required
              >
                <InputLabel>زیر شاخه</InputLabel>
                <Select
                  {...register('subCategoryId', { 
                    required: 'انتخاب زیر شاخه الزامی است'
                  })}
                  label="زیر شاخه"
                >
                  {subcategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.subCategoryId && (
                  <FormHelperText>{errors.subCategoryId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          </div>
          
          <TextField 
            fullWidth 
            label="توضیحات" 
            {...register('description')} 
            variant="outlined" 
            multiline 
            rows={3} 
            className="mb-4"
          />
          
          <TextField
            fullWidth
            label="فیلدهای ایندکس (با ویرگول یا کاما جدا کنید)"
            {...register('elasticFields')}
            variant="outlined"
            helperText="اگر خالی باشد، نام سرویس و زیر شاخه به‌صورت خودکار اضافه می‌شوند"
          />
        </Paper>
        
        {isLoadingSchema && (
          <Paper className="p-6 mb-8 text-center" elevation={2}>
            <Typography variant="body1" className="mb-2">
              در حال بارگذاری فرم...
            </Typography>
            <FuseLoading />
          </Paper>
        )}
        
        {!isLoadingSchema && schemaFields.length > 0 && (
          <Paper className="p-6 mb-8" elevation={2}>
            <Typography variant="h6" className="mb-4">
              اطلاعات تخصصی سرویس
            </Typography>
            
            <FormPreview
              fields={schemaFields}
              formTitle={formTitle}
              formDescription={formDescription}
              initialData={serviceFormData}
              onDataChange={handleFormDataChange}
              submitButtonLabel="ذخیره اطلاعات"
              hideSubmitButton={true}
            />
          </Paper>
        )}
        
        <Box className="flex justify-end mt-6">
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isUpdating || isCreating || isLoadingSchema}
          >
            {isUpdating || isCreating 
              ? 'در حال ارسال...' 
              : (isCreateMode 
                  ? 'ایجاد سرویس' 
                  : isDraft 
                    ? 'تبدیل به سرویس' 
                    : 'ذخیره تغییرات'
                )
            }
          </Button>
        </Box>
      </form>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ServiceDetails;