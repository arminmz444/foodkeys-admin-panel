import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  IconButton, 
  Tooltip, 
  CircularProgress, 
  Pagination, 
  Box, 
  Chip, 
  Alert, 
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Tabs,
  Tab,
  Grid,
  FormHelperText,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dropzone from 'react-dropzone';
import { 
  useGetServicesQuery, 
  useGetServiceQuery, 
  useCreateServiceMutation, 
  useUpdateServiceMutation, 
  useDeleteServiceMutation,
  useGetServiceSchemasQuery,
  useGetServiceSchemaQuery,
  useUploadServiceFileMutation,
  useUploadServiceFileBase64Mutation,
  useGetServiceFilesQuery,
  useDeleteServiceFileMutation,
  useValidateServiceMutation
} from './store/configManagementApi';
import CodeEditor from './components/CodeEditor';
import DynamicForm from './components/DynamicForm';
import { createFormStructure, prepareFormInitialValues, safeJsonParse, jsonSchemaToZod } from './utils/form-utils';

// Styled components
const Root = styled('div')(({ theme }) => ({
  '& .header': {
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(3),
  },
  '& .service-data-editor': {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  '& .dropzone': {
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover,
    },
  },
  '& .dropzone-active': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  '& .status-active': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  },
  '& .status-inactive': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },
  '& .status-pending': {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.contrastText,
  },
}));

// Tab panel component
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Form validation schema for basic service properties
const serviceBasicSchema = z.object({
  name: z.string()
    .min(3, 'نام باید حداقل 3 کاراکتر باشد')
    .max(100, 'نام نمی‌تواند بیش از 100 کاراکتر باشد')
    .nonempty('نام الزامی است'),
  nameEn: z.string()
    .max(100, 'نام انگلیسی نمی‌تواند بیش از 100 کاراکتر باشد')
    .optional()
    .or(z.literal('')),
  subcategoryId: z.number({ invalid_type_error: 'انتخاب زیردسته الزامی است' })
    .positive('انتخاب زیردسته الزامی است'),
  serviceSchemaId: z.number({ invalid_type_error: 'انتخاب طرحواره سرویس الزامی است' })
    .positive('انتخاب طرحواره سرویس الزامی است'),
  status: z.number({ invalid_type_error: 'انتخاب وضعیت الزامی است' })
    .min(0, 'انتخاب وضعیت الزامی است'),
  keyWords: z.string().max(500, 'کلمات کلیدی نمی‌تواند بیش از 500 کاراکتر باشد').optional().or(z.literal('')),
  tags: z.string().max(500, 'برچسب‌ها نمی‌تواند بیش از 500 کاراکتر باشد').optional().or(z.literal('')),
});

const ServiceRecordsTab = () => {
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showDataEditor, setShowDataEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [serviceError, setServiceError] = useState(null);
  const [schemaFormValidation, setSchemaFormValidation] = useState(null);
  const [parsedSchema, setParsedSchema] = useState(null);
  const [formStructure, setFormStructure] = useState([]);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [shouldValidateSchema, setShouldValidateSchema] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(null);
  
  // Mock data for subcategories (replace with actual API call)
  const subcategories = [
    { id: 1, title: 'رستوران‌ها' },
    { id: 2, title: 'کافه‌ها' },
    { id: 3, title: 'فروشگاه‌های مواد غذایی' },
    { id: 4, title: 'تولیدکنندگان مواد غذایی' },
    { id: 5, title: 'عمده‌فروشان مواد غذایی' },
  ];
  
  // Status options
  const statusOptions = [
    { value: 1, label: 'فعال', color: 'success' },
    { value: 0, label: 'غیرفعال', color: 'error' },
    { value: 2, label: 'در انتظار تایید', color: 'warning' },
  ];
  
  // RTK Query hooks
  const { 
    data: servicesData, 
    isLoading: isLoadingServices, 
    isFetching: isFetchingServices, 
    error: servicesError,
    refetch: refetchServices
  } = useGetServicesQuery({
    pageNumber: page,
    pageSize,
    search: searchTerm,
    filter: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(subcategoryFilter ? { subcategoryId: subcategoryFilter } : {})
    }
  });
  
  const { 
    data: currentService, 
    isLoading: isLoadingCurrentService 
  } = useGetServiceQuery(currentServiceId, { 
    skip: !currentServiceId 
  });
  
  const { 
    data: schemasData, 
    isLoading: isLoadingSchemas 
  } = useGetServiceSchemasQuery({
    pageNumber: 1,
    pageSize: 100,
  });
  
  const { 
    data: schemaData, 
    isLoading: isLoadingSchema 
  } = useGetServiceSchemaQuery(selectedSchema, { 
    skip: !selectedSchema 
  });
  
  const {
    data: serviceFiles,
    isLoading: isLoadingFiles,
    refetch: refetchFiles
  } = useGetServiceFilesQuery(currentServiceId, {
    skip: !currentServiceId || !openDialog
  });
  
  const [uploadFile, { isLoading: isUploading }] = useUploadServiceFileMutation();
  const [uploadFileBase64, { isLoading: isUploadingBase64 }] = useUploadServiceFileBase64Mutation();
  const [deleteFile, { isLoading: isDeleting }] = useDeleteServiceFileMutation();
  
  const [validateService, { isLoading: isValidating }] = useValidateServiceMutation();
  
  const [
    createService, 
    { isLoading: isCreating }
  ] = useCreateServiceMutation();
  
  const [
    updateService, 
    { isLoading: isUpdating }
  ] = useUpdateServiceMutation();
  
  const [
    deleteService, 
    { isLoading: isDeletingService }
  ] = useDeleteServiceMutation();
  
  // Form setup for basic service properties
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(serviceBasicSchema),
    defaultValues: {
      name: '',
      nameEn: '',
      subcategoryId: '',
      serviceSchemaId: '',
      status: 1, // Active by default
      keyWords: '',
      tags: '',
      data: '{}',
    }
  });
  
  // Form setup for schema-based data
  const { 
    control: schemaFormControl, 
    handleSubmit: handleSchemaFormSubmit, 
    reset: resetSchemaForm, 
    formState: { errors: schemaFormErrors }
  } = useForm({
    resolver: schemaFormValidation ? zodResolver(schemaFormValidation) : undefined,
    defaultValues: formInitialValues,
  });
  
  // Watched values
  const watchedSchemaId = watch('serviceSchemaId');
  const watchedSubcategoryId = watch('subcategoryId');
  
  // Effects
  // Update selected schema when schemaId changes
  useEffect(() => {
    if (watchedSchemaId) {
      setSelectedSchema(watchedSchemaId);
    }
  }, [watchedSchemaId]);
  
  // Update selected subcategory when subcategoryId changes
  useEffect(() => {
    if (watchedSubcategoryId) {
      setSelectedSubcategory(watchedSubcategoryId);
    }
  }, [watchedSubcategoryId]);
  
  // Update form values when editing a service
  useEffect(() => {
    if (currentService && editMode) {
      reset({
        name: currentService.name,
        nameEn: currentService.nameEn || '',
        subcategoryId: currentService.subcategory?.id || '',
        serviceSchemaId: currentService.serviceSchema?.id || '',
        status: currentService.status,
        keyWords: currentService.keyWords || '',
        tags: currentService.tags || '',
      });
      
      if (currentService.serviceSchema?.id) {
        setSelectedSchema(currentService.serviceSchema.id);
      }
      
      if (currentService.subcategory?.id) {
        setSelectedSubcategory(currentService.subcategory.id);
      }
      
      // Parse service data
      try {
        const serviceData = safeJsonParse(currentService.data, {});
        setFormInitialValues(serviceData);
      } catch (error) {
        console.error('Error parsing service data:', error);
        setFormInitialValues({});
      }
    }
  }, [currentService, reset, editMode]);
  
  // Update parsedSchema and form structure when schema data changes
  useEffect(() => {
    if (schemaData?.schemaDefinition) {
      try {
        const parsed = safeJsonParse(schemaData.schemaDefinition);
        setParsedSchema(parsed);
        
        // Create form structure from schema
        const structure = createFormStructure(parsed);
        setFormStructure(structure);
        
        // Create validation schema
        const zodSchema = jsonSchemaToZod(parsed);
        setSchemaFormValidation(zodSchema);
        
        // Prepare initial values
        if (!editMode || (editMode && !isDirty)) {
          const initialValues = prepareFormInitialValues(parsed, formInitialValues);
          setFormInitialValues(initialValues);
          resetSchemaForm(initialValues);
        }
      } catch (error) {
        console.error('Error parsing schema definition:', error);
      }
    }
  }, [schemaData, editMode, isDirty, resetSchemaForm]);
  
  // Handlers
  const handleOpenCreateDialog = () => {
    setEditMode(false);
    setCurrentServiceId(null);
    reset({
      name: '',
      nameEn: '',
      subcategoryId: '',
      serviceSchemaId: '',
      status: 1,
      keyWords: '',
      tags: '',
    });
    setSelectedSchema(null);
    setSelectedSubcategory(null);
    setParsedSchema(null);
    setFormStructure([]);
    setFormInitialValues({});
    resetSchemaForm({});
    setOpenDialog(true);
    setShowDataEditor(false);
    setShowPreview(false);
    setTabValue(0);
    setServiceError(null);
    setIsDirty(false);
    setShouldValidateSchema(false);
  };
  
  const handleOpenEditDialog = (id) => {
    setEditMode(true);
    setCurrentServiceId(id);
    setOpenDialog(true);
    setShowDataEditor(false);
    setShowPreview(false);
    setTabValue(0);
    setServiceError(null);
    setIsDirty(false);
    setShouldValidateSchema(false);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFileUploadError(null);
  };
  
  const handleOpenDeleteDialog = (id) => {
    setCurrentServiceId(id);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangePageSize = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };
  
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(event.target.value);
      setPage(1);
    }
  };
  
  const handleSearchChange = (event) => {
    if (event.target.value === '') {
      setSearchTerm('');
      setPage(1);
    }
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };
  
  const handleSubcategoryFilterChange = (event) => {
    setSubcategoryFilter(event.target.value);
    setPage(1);
  };
  
  const handleToggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  
  const handleSchemaFormChange = () => {
    setIsDirty(true);
  };
  
  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : 'نامشخص';
  };
  
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'default';
  };
  
  const getSubcategoryTitle = (id) => {
    const subcategory = subcategories.find(item => item.id === id);
    return subcategory ? subcategory.title : 'نامشخص';
  };
  
  const handleServiceSubmit = async (basicData) => {
    setShouldValidateSchema(true);
    
    if (!parsedSchema) {
      setServiceError('لطفا ابتدا یک طرحواره انتخاب کنید');
      return;
    }
    
    try {
      // Get data from schema form
      let serviceData = {};
      if (formStructure.length > 0) {
        // Submit schema form to get its data
        serviceData = await handleSchemaFormSubmit((data) => data)();
      }
      
      // Validate service data against schema
      try {
        await validateService({
          schemaId: basicData.serviceSchemaId,
          data: JSON.stringify(serviceData)
        }).unwrap();
      } catch (error) {
        setServiceError(error.data?.message || 'داده‌های سرویس با طرحواره مطابقت ندارد');
        return;
      }
      
      const payload = {
        name: basicData.name,
        nameEn: basicData.nameEn || null,
        subcategoryId: basicData.subcategoryId,
        serviceSchemaId: basicData.serviceSchemaId,
        status: basicData.status,
        keyWords: basicData.keyWords || null,
        tags: basicData.tags || null,
        data: JSON.stringify(serviceData),
        additionalData: '{}', // Default empty additional data
      };
      
      setServiceError(null);
      
      if (editMode) {
        await updateService({ id: currentServiceId, ...payload }).unwrap();
        enqueueSnackbar('سرویس با موفقیت به‌روزرسانی شد', { variant: 'success' });
      } else {
        await createService(payload).unwrap();
        enqueueSnackbar('سرویس با موفقیت ایجاد شد', { variant: 'success' });
      }
      
      setOpenDialog(false);
      refetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      setServiceError(error.data?.message || 'خطا در ذخیره سرویس');
    }
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteService(currentServiceId).unwrap();
      enqueueSnackbar('سرویس با موفقیت حذف شد', { variant: 'success' });
      setOpenDeleteDialog(false);
      refetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      enqueueSnackbar(error.data?.message || 'خطا در حذف سرویس', { variant: 'error' });
      setOpenDeleteDialog(false);
    }
  };
  
  const handleFileDrop = async (acceptedFiles) => {
    if (!currentServiceId || acceptedFiles.length === 0) return;
    
    setFileUploadError(null);
    
    try {
      const file = acceptedFiles[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileUploadError('حجم فایل نباید بیشتر از 5 مگابایت باشد');
        return;
      }
      
      // Upload file
      await uploadFile({
        serviceId: currentServiceId,
        file,
        fileServiceType: 'GENERAL'
      }).unwrap();
      
      refetchFiles();
      enqueueSnackbar('فایل با موفقیت آپلود شد', { variant: 'success' });
    } catch (error) {
      console.error('Error uploading file:', error);
      setFileUploadError(error.data?.message || 'خطا در آپلود فایل');
    }
  };
  
  const handleDeleteFile = async (fileId) => {
    if (!currentServiceId || !fileId) return;
    
    try {
      await deleteFile({
        serviceId: currentServiceId,
        fileId
      }).unwrap();
      
      refetchFiles();
      enqueueSnackbar('فایل با موفقیت حذف شد', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting file:', error);
      enqueueSnackbar(error.data?.message || 'خطا در حذف فایل', { variant: 'error' });
    }
  };
  
  // Computed values
  const isSubmitting = isCreating || isUpdating || isValidating;
  const services = servicesData?.data || [];
  const totalPages = servicesData?.totalPages || 0;
  const loading = isLoadingServices || isFetchingServices;
  const schemas = schemasData?.data || [];
  
  return (
    <Root className="flex flex-col flex-auto min-h-full">
      <div className="header p-24 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <Typography className="text-3xl font-bold tracking-tight leading-8">
            مدیریت سرویس‌ها
          </Typography>
          <Typography className="font-medium tracking-tight" color="text.secondary">
            سرویس‌های سیستم را مدیریت کنید
          </Typography>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center mt-16 md:mt-0 gap-16">
          <TextField
            label="جستجو"
            placeholder="نام یا نام انگلیسی سرویس را وارد کنید..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FuseSvgIcon size={20}>heroicons-outline:search</FuseSvgIcon>
                </InputAdornment>
              ),
            }}
            onKeyPress={handleSearch}
            onChange={handleSearchChange}
            className="md:min-w-200"
          />
          
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleToggleFilter}
            startIcon={<FuseSvgIcon>{filterOpen ? 'heroicons-outline:minus' : 'heroicons-outline:plus'}</FuseSvgIcon>}
            className="whitespace-nowrap"
          >
            {filterOpen ? 'بستن فیلتر' : 'نمایش فیلتر'}
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenCreateDialog}
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
            className="whitespace-nowrap"
          >
            افزودن سرویس جدید
          </Button>
        </div>
      </div>
      
      <Collapse in={filterOpen}>
        <Paper className="mx-24 mb-24 p-16">
          <Typography variant="subtitle1" className="mb-16">
            فیلتر سرویس‌ها
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>وضعیت</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="وضعیت"
                >
                  <MenuItem value="">همه وضعیت‌ها</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>زیردسته</InputLabel>
                <Select
                  value={subcategoryFilter}
                  onChange={handleSubcategoryFilterChange}
                  label="زیردسته"
                >
                  <MenuItem value="">همه زیردسته‌ها</MenuItem>
                  {subcategories.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center px-24"
      >
        {servicesError ? (
          <Alert severity="error" className="w-full max-w-4xl">
            خطا در بارگیری سرویس‌ها: {servicesError.data?.message || 'خطای ناشناخته'}
          </Alert>
        ) : (
          <Paper className="w-full max-w-6xl rounded-lg shadow overflow-hidden">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>نام</TableCell>
                    <TableCell>نام انگلیسی</TableCell>
                    <TableCell>زیردسته</TableCell>
                    <TableCell>طرحواره سرویس</TableCell>
                    <TableCell align="center">وضعیت</TableCell>
                    <TableCell align="center">بازدید</TableCell>
                    <TableCell align="center">عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" height={250}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : services.length > 0 ? (
                    services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <Tooltip title={service.name}>
                            <span className="font-medium">{service.name}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {service.nameEn || <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          {service.subcategory?.title || <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          {service.serviceSchema?.displayName || service.serviceSchema?.name || <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getStatusLabel(service.status)}
                            color={getStatusColor(service.status)}
                            size="small"
                            className="rounded-full"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Badge 
                            badgeContent={service.visit || 0} 
                            color="primary"
                            max={9999}
                          >
                            <FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
                          </Badge>
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                            <Tooltip title="ویرایش">
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleOpenEditDialog(service.id)}
                              >
                                <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="حذف">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleOpenDeleteDialog(service.id)}
                              >
                                <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
                              </IconButton>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" height={100}>
                        <Typography color="text.secondary">
                          هیچ سرویسی یافت نشد
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {totalPages > 1 && (
              <Box className="flex justify-between items-center p-16 border-t">
                <FormControl variant="outlined" size="small">
                  <InputLabel>تعداد در صفحه</InputLabel>
                  <Select
                    value={pageSize}
                    onChange={handleChangePageSize}
                    label="تعداد در صفحه"
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
                
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </Paper>
        )}
      </motion.div>
      
      {/* Create/Edit Service Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'ویرایش سرویس' : 'افزودن سرویس جدید'}
        </DialogTitle>
        <DialogContent>
          <form id="service-form" onSubmit={handleSubmit(handleServiceSubmit)}>
            {isLoadingCurrentService && editMode ? (
              <Box className="flex justify-center my-24">
                <CircularProgress />
              </Box>
            ) : (
              <>
                {serviceError && (
                  <Alert severity="error" className="mb-16">
                    {serviceError}
                  </Alert>
                )}
                
                <Tabs
                  value={tabValue}
                  onChange={handleChangeTab}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  className="mb-24"
                >
                  <Tab label="اطلاعات پایه" />
                  <Tab label="داده‌های سرویس" disabled={!selectedSchema} />
                  <Tab label="فایل‌ها" disabled={!editMode} />
                </Tabs>
                
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="نام سرویس"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            required
                            className="mb-16"
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="nameEn"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="نام انگلیسی سرویس"
                            fullWidth
                            error={!!errors.nameEn}
                            helperText={errors.nameEn?.message}
                            className="mb-16"
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="subcategoryId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.subcategoryId} className="mb-16">
                            <InputLabel>زیردسته</InputLabel>
                            <Select
                              {...field}
                              label="زیردسته"
                            >
                              {subcategories.map((subcategory) => (
                                <MenuItem key={subcategory.id} value={subcategory.id}>
                                  {subcategory.title}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.subcategoryId && (
                              <FormHelperText>{errors.subcategoryId.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="serviceSchemaId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.serviceSchemaId} className="mb-16">
                            <InputLabel>طرحواره سرویس</InputLabel>
                            <Select
                              {...field}
                              label="طرحواره سرویس"
                              disabled={editMode || isLoadingSchemas}
                            >
                              {isLoadingSchemas ? (
                                <MenuItem disabled>در حال بارگذاری...</MenuItem>
                              ) : (
                                schemas.map((schema) => (
                                  <MenuItem key={schema.id} value={schema.id}>
                                    {schema.displayName || schema.name}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            {errors.serviceSchemaId && (
                              <FormHelperText>{errors.serviceSchemaId.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.status} className="mb-16">
                            <InputLabel>وضعیت</InputLabel>
                            <Select
                              {...field}
                              label="وضعیت"
                            >
                              {statusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.status && (
                              <FormHelperText>{errors.status.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="keyWords"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="کلمات کلیدی"
                            fullWidth
                            error={!!errors.keyWords}
                            helperText={errors.keyWords?.message || 'کلمات کلیدی را با کاما جدا کنید'}
                            className="mb-16"
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="برچسب‌ها"
                            fullWidth
                            error={!!errors.tags}
                            helperText={errors.tags?.message || 'برچسب‌ها را با کاما جدا کنید'}
                            className="mb-16"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                  {isLoadingSchema ? (
                    <Box className="flex justify-center my-24">
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {!parsedSchema ? (
                        <Alert severity="info">
                          لطفا ابتدا یک طرحواره سرویس انتخاب کنید
                        </Alert>
                      ) : (
                        <>
                          <Box className="mb-16">
                            <Typography variant="subtitle1" className="mb-16">
                              وارد کردن داده‌های سرویس بر اساس طرحواره {schemaData?.displayName || schemaData?.name}
                            </Typography>
                            
                            {formStructure.length === 0 ? (
                              <Alert severity="info">
                                این طرحواره هیچ فیلدی برای وارد کردن ندارد
                              </Alert>
                            ) : (
                              <DynamicForm
                                schema={schemaData?.schemaDefinition}
                                initialData={formInitialValues}
                                onSubmit={handleSchemaFormChange}
                                control={schemaFormControl}
                                errors={schemaFormErrors}
                                submitButtonProps={{ style: { display: 'none' } }}
                              />
                            )}
                          </Box>
                        </>
                      )}
                    </>
                  )}
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                  {!editMode ? (
                    <Alert severity="info">
                      لطفا ابتدا سرویس را ایجاد کنید تا بتوانید فایل آپلود کنید
                    </Alert>
                  ) : (
                    <Box>
                      <Typography variant="subtitle1" className="mb-16">
                        مدیریت فایل‌های سرویس
                      </Typography>
                      
                      {fileUploadError && (
                        <Alert severity="error" className="mb-16">
                          {fileUploadError}
                        </Alert>
                      )}
                      
                      <Dropzone onDrop={handleFileDrop} disabled={isUploading}>
                        {({ getRootProps, getInputProps, isDragActive }) => (
                          <Box
                            {...getRootProps()}
                            className={`dropzone mb-24 ${isDragActive ? 'dropzone-active' : ''}`}
                          >
                            <input {...getInputProps()} />
                            {isUploading ? (
                              <Box className="flex flex-col items-center justify-center p-24">
                                <CircularProgress size={40} className="mb-16" />
                                <Typography>در حال آپلود فایل...</Typography>
                              </Box>
                            ) : (
                              <Box className="flex flex-col items-center justify-center p-24">
                                <FuseSvgIcon className="mb-8" size={48}>heroicons-outline:upload</FuseSvgIcon>
                                <Typography>فایل خود را اینجا رها کنید یا کلیک کنید</Typography>
                                <Typography variant="caption" color="text.secondary" className="mt-4">
                                  (حداکثر حجم فایل: 5 مگابایت)
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Dropzone>
                      
                      <Typography variant="subtitle2" className="mb-16">
                        فایل‌های آپلود شده
                      </Typography>
                      
                      {isLoadingFiles ? (
                        <Box className="flex justify-center my-24">
                          <CircularProgress />
                        </Box>
                      ) : serviceFiles && serviceFiles.length > 0 ? (
                        <Paper variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>نام فایل</TableCell>
                                <TableCell>نوع فایل</TableCell>
                                <TableCell>نوع سرویس</TableCell>
                                <TableCell align="right">حجم</TableCell>
                                <TableCell align="center">عملیات</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {serviceFiles.map((file) => (
                                <TableRow key={file.id}>
                                  <TableCell>{file.fileName}</TableCell>
                                  <TableCell>{file.contentType}</TableCell>
                                  <TableCell>{file.fileServiceType || 'عمومی'}</TableCell>
                                  <TableCell align="right">
                                    {Math.round(file.fileSize / 1024)} کیلوبایت
                                  </TableCell>
                                  <TableCell align="center">
                                    <Tooltip title="حذف فایل">
                                      <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteFile(file.id)}
                                        disabled={isDeleting}
                                      >
                                        <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Paper>
                      ) : (
                        <Alert severity="info">
                          هیچ فایلی برای این سرویس آپلود نشده است
                        </Alert>
                      )}
                    </Box>
                  )}
                </TabPanel>
              </>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button
            type="submit"
            form="service-form"
            variant="contained"
            color="primary"
            disabled={isSubmitting || isLoadingCurrentService}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'ذخیره'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>حذف سرویس</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از حذف این سرویس اطمینان دارید؟ این عملیات قابل بازگشت نیست.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>انصراف</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeletingService}
          >
            {isDeletingService ? <CircularProgress size={24} /> : 'حذف'}
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default ServiceRecordsTab;