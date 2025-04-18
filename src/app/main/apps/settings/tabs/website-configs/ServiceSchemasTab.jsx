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
  FormHelperText,
  Select,
  MenuItem,
  InputAdornment,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useGetServiceSchemasQuery, 
  useGetServiceSchemaQuery, 
  useCreateServiceSchemaMutation, 
  useUpdateServiceSchemaMutation, 
  useDeleteServiceSchemaMutation,
  useValidateServiceSchemaMutation
} from './store/configManagementApi';
import CodeEditor from './components/CodeEditor';
import SchemaPreview from './components/SchemaPreview';
import { safeJsonParse } from './utils/form-utils';

// Styled components
const Root = styled('div')(({ theme }) => ({
  '& .header': {
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(3),
  },
  '& .schema-code-editor': {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
}));

// Form validation schema
const schemaFormSchema = z.object({
  name: z.string()
    .min(3, 'نام باید حداقل 3 کاراکتر باشد')
    .max(50, 'نام نمی‌تواند بیش از 50 کاراکتر باشد')
    .regex(/^[a-zA-Z0-9._-]+$/, 'نام فقط می‌تواند شامل حروف، اعداد، نقطه، خط تیره و زیرخط باشد')
    .nonempty('نام الزامی است'),
  displayName: z.string()
    .min(3, 'نام نمایشی باید حداقل 3 کاراکتر باشد')
    .max(100, 'نام نمایشی نمی‌تواند بیش از 100 کاراکتر باشد')
    .nonempty('نام نمایشی الزامی است'),
  schemaDefinition: z.string()
    .nonempty('تعریف طرحواره الزامی است')
    .refine(
      (val) => {
        try {
          JSON.parse(val);
          return true;
        } catch (e) {
          return false;
        }
      },
      { message: 'طرحواره باید یک JSON معتبر باشد' }
    ),
  elasticFields: z.string().optional(),
});

const ServiceSchemasTab = () => {
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSchemaId, setCurrentSchemaId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [previewSchemaId, setPreviewSchemaId] = useState(null);
  const [schemaError, setSchemaError] = useState(null);
  const [elasticFieldsOpen, setElasticFieldsOpen] = useState(false);
  
  // RTK Query hooks
  const { 
    data: schemasData, 
    isLoading: isLoadingSchemas, 
    isFetching: isFetchingSchemas, 
    error: schemasError,
    refetch: refetchSchemas
  } = useGetServiceSchemasQuery({
    pageNumber: page,
    pageSize,
    search: searchTerm,
  });
  
  const { 
    data: currentSchema, 
    isLoading: isLoadingCurrentSchema 
  } = useGetServiceSchemaQuery(currentSchemaId, { 
    skip: !currentSchemaId 
  });
  
  const [
    validateServiceSchema, 
    { isLoading: isValidating }
  ] = useValidateServiceSchemaMutation();
  
  const [
    createServiceSchema, 
    { isLoading: isCreating }
  ] = useCreateServiceSchemaMutation();
  
  const [
    updateServiceSchema, 
    { isLoading: isUpdating }
  ] = useUpdateServiceSchemaMutation();
  
  const [
    deleteServiceSchema, 
    { isLoading: isDeleting }
  ] = useDeleteServiceSchemaMutation();
  
  // Form setup
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schemaFormSchema),
    defaultValues: {
      name: '',
      displayName: '',
      schemaDefinition: JSON.stringify({ 
        type: 'object',
        properties: {},
        required: []
      }, null, 2),
      elasticFields: '',
    }
  });
  
  // Effects
  useEffect(() => {
    if (currentSchema) {
      reset({
        name: currentSchema.name,
        displayName: currentSchema.displayName,
        schemaDefinition: typeof currentSchema.schemaDefinition === 'object' 
          ? JSON.stringify(currentSchema.schemaDefinition, null, 2)
          : currentSchema.schemaDefinition,
        elasticFields: currentSchema.elasticFields || '',
      });
      
      if (currentSchema.elasticFields) {
        setElasticFieldsOpen(true);
      }
    }
  }, [currentSchema, reset]);
  
  // Handlers
  const handleOpenCreateDialog = () => {
    setEditMode(false);
    setCurrentSchemaId(null);
    reset({
      name: '',
      displayName: '',
      schemaDefinition: JSON.stringify({ 
        type: 'object',
        properties: {},
        required: []
      }, null, 2),
      elasticFields: '',
    });
    setOpenDialog(true);
    setShowJsonEditor(false);
    setSchemaError(null);
    setElasticFieldsOpen(false);
  };
  
  const handleOpenEditDialog = (id) => {
    setEditMode(true);
    setCurrentSchemaId(id);
    setOpenDialog(true);
    setShowJsonEditor(false);
    setSchemaError(null);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleOpenDeleteDialog = (id) => {
    setCurrentSchemaId(id);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleSchemaSubmit = async (data) => {
    try {
      setSchemaError(null);
      let parsedSchema;
      let parsedElasticFields = null;
      
      try {
        parsedSchema = JSON.parse(data.schemaDefinition);
      } catch (error) {
        setSchemaError('طرحواره JSON معتبر نیست');
        return;
      }
      
      // Check that schema has the required properties
      if (parsedSchema.type !== 'object') {
        setSchemaError('طرحواره باید از نوع object باشد');
        return;
      }
      
      if (!parsedSchema.properties) {
        setSchemaError('طرحواره باید دارای خاصیت properties باشد');
        return;
      }
      
      // Parse and validate elastic fields if provided
      if (data.elasticFields) {
        try {
          // Check if it's a JSON array or a comma-separated string
          if (data.elasticFields.trim().startsWith('[')) {
            parsedElasticFields = JSON.parse(data.elasticFields);
            
            if (!Array.isArray(parsedElasticFields)) {
              setSchemaError('فیلدهای قابل جستجو باید یک آرایه باشد');
              return;
            }
          } else {
            // Assume it's a comma-separated list
            parsedElasticFields = data.elasticFields.split(',').map(field => field.trim()).filter(Boolean);
          }
          
          // Check all fields exist in the schema
          for (const field of parsedElasticFields) {
            const pathParts = field.split('.');
            let current = parsedSchema.properties;
            
            for (const part of pathParts) {
              if (!current[part]) {
                setSchemaError(`فیلد "${field}" در طرحواره وجود ندارد`);
                return;
              }
              
              // Move to nested properties if available
              if (current[part].properties) {
                current = current[part].properties;
              }
            }
          }
        } catch (error) {
          setSchemaError('فیلدهای قابل جستجو معتبر نیست');
          return;
        }
      }
      
      // Validate schema with backend
      try {
        await validateServiceSchema({ schemaDefinition: data.schemaDefinition }).unwrap();
      } catch (error) {
        setSchemaError(error.data?.message || 'طرحواره معتبر نیست');
        return;
      }
      
      const payload = {
        name: data.name,
        displayName: data.displayName,
        schemaDefinition: data.schemaDefinition,
        elasticFields: data.elasticFields || null,
      };
      
      if (editMode) {
        await updateServiceSchema({ id: currentSchemaId, ...payload }).unwrap();
        enqueueSnackbar('طرحواره سرویس با موفقیت به‌روزرسانی شد', { variant: 'success' });
      } else {
        await createServiceSchema(payload).unwrap();
        enqueueSnackbar('طرحواره سرویس با موفقیت ایجاد شد', { variant: 'success' });
      }
      
      setOpenDialog(false);
      refetchSchemas();
    } catch (error) {
      console.error('Error saving schema:', error);
      enqueueSnackbar(error.data?.message || 'خطا در ذخیره طرحواره', { variant: 'error' });
    }
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteServiceSchema(currentSchemaId).unwrap();
      enqueueSnackbar('طرحواره سرویس با موفقیت حذف شد', { variant: 'success' });
      setOpenDeleteDialog(false);
      refetchSchemas();
    } catch (error) {
      console.error('Error deleting schema:', error);
      enqueueSnackbar(error.data?.message || 'خطا در حذف طرحواره سرویس', { variant: 'error' });
      setOpenDeleteDialog(false);
    }
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
  
  const handleOpenPreview = (id) => {
    setPreviewSchemaId(id);
  };
  
  const handleClosePreview = () => {
    setPreviewSchemaId(null);
  };
  
  const handleToggleElasticFields = () => {
    setElasticFieldsOpen(!elasticFieldsOpen);
  };
  
  const extractSearchableFields = () => {
    try {
      const schema = watch('schemaDefinition');
      const parsedSchema = JSON.parse(schema);
      
      if (parsedSchema.type !== 'object' || !parsedSchema.properties) {
        return [];
      }
      
      // Extract all field paths from the schema, including nested fields
      const extractFields = (properties, prefix = '') => {
        let fields = [];
        
        for (const [key, value] of Object.entries(properties)) {
          const fieldPath = prefix ? `${prefix}.${key}` : key;
          
          if (value.type === 'string' || value.type === 'number' || value.type === 'integer' || value.type === 'boolean') {
            fields.push(fieldPath);
          }
          
          if (value.type === 'object' && value.properties) {
            fields = [...fields, ...extractFields(value.properties, fieldPath)];
          }
          
          if (value.type === 'array' && value.items && value.items.type === 'object' && value.items.properties) {
            fields = [...fields, ...extractFields(value.items.properties, `${fieldPath}[]`)];
          }
        }
        
        return fields;
      };
      
      return extractFields(parsedSchema.properties);
    } catch (error) {
      console.error('Error extracting searchable fields:', error);
      return [];
    }
  };
  
  // Computed values
  const isSubmitting = isCreating || isUpdating || isValidating;
  const schemas = schemasData?.data || [];
  const totalPages = schemasData?.totalPages || 0;
  const loading = isLoadingSchemas || isFetchingSchemas;
  const searchableFields = extractSearchableFields();
  
  return (
    <Root className="flex flex-col flex-auto min-h-full">
      <div className="header p-24 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <Typography className="text-3xl font-bold tracking-tight leading-8">
            مدیریت طرحواره‌های سرویس
          </Typography>
          <Typography className="font-medium tracking-tight" color="text.secondary">
            طرحواره‌های سرویس سیستم را مدیریت کنید
          </Typography>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center mt-16 md:mt-0 gap-16">
          <TextField
            label="جستجو"
            placeholder="نام یا نام نمایشی طرحواره را وارد کنید..."
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
            className="min-w-256"
          />
          
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenCreateDialog}
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            افزودن طرحواره سرویس جدید
          </Button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center px-24"
      >
        {schemasError ? (
          <Alert severity="error" className="w-full max-w-4xl">
            خطا در بارگیری طرحواره‌های سرویس: {schemasError.data?.message || 'خطای ناشناخته'}
          </Alert>
        ) : (
          <Paper className="w-full max-w-4xl rounded-lg shadow overflow-hidden">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>نام</TableCell>
                    <TableCell>نام نمایشی</TableCell>
                    <TableCell align="center">تعداد سرویس‌ها</TableCell>
                    <TableCell align="center">فیلدهای جستجو</TableCell>
                    <TableCell align="center">عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" height={250}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : schemas.length > 0 ? (
                    schemas.map((schema) => (
                      <TableRow key={schema.id}>
                        <TableCell>{schema.name}</TableCell>
                        <TableCell>{schema.displayName}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={schema.serviceCount || 0}
                            color={schema.serviceCount ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {schema.elasticFields ? (
                            <Tooltip title={schema.elasticFields}>
                              <Chip
                                label={`${schema.elasticFields.split(',').length} فیلد`}
                                color="info"
                                size="small"
                              />
                            </Tooltip>
                          ) : (
                            <Chip label="بدون فیلد جستجو" size="small" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                            <Tooltip title="پیش‌نمایش">
                              <IconButton
                                color="info"
                                size="small"
                                onClick={() => handleOpenPreview(schema.id)}
                              >
                                <FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="ویرایش">
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleOpenEditDialog(schema.id)}
                              >
                                <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="حذف">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleOpenDeleteDialog(schema.id)}
                                disabled={schema.serviceCount > 0}
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
                      <TableCell colSpan={5} align="center" height={100}>
                        <Typography color="text.secondary">
                          هیچ طرحواره سرویسی یافت نشد
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
      
      {/* Create/Edit Schema Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'ویرایش طرحواره سرویس' : 'افزودن طرحواره سرویس جدید'}
        </DialogTitle>
        <DialogContent>
          <form id="schema-form" onSubmit={handleSubmit(handleSchemaSubmit)}>
            {isLoadingCurrentSchema && editMode ? (
              <Box className="flex justify-center my-24">
                <CircularProgress />
              </Box>
            ) : (
              <>
                {schemaError && (
                  <Alert severity="error" className="mb-16">
                    {schemaError}
                  </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="نام (کلید یکتا)"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        disabled={editMode}
                        required
                      />
                    )}
                  />
                  
                  <Controller
                    name="displayName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="نام نمایشی"
                        fullWidth
                        error={!!errors.displayName}
                        helperText={errors.displayName?.message}
                        required
                      />
                    )}
                  />
                </div>
                
                <div className="mb-16">
                  <Box className="flex justify-between items-center mb-8">
                    <Typography variant="subtitle1">تعریف طرحواره سرویس (JSON Schema)</Typography>
                    <Button 
                      size="small" 
                      onClick={() => setShowJsonEditor(!showJsonEditor)}
                      startIcon={<FuseSvgIcon>{showJsonEditor ? 'heroicons-outline:minus' : 'heroicons-outline:plus'}</FuseSvgIcon>}
                    >
                      {showJsonEditor ? 'بستن ویرایشگر' : 'باز کردن ویرایشگر'}
                    </Button>
                  </Box>
                  
                  <Collapse in={showJsonEditor}>
                    <div className="schema-code-editor mb-16">
                      <Controller
                        name="schemaDefinition"
                        control={control}
                        render={({ field }) => (
                          <CodeEditor
                            value={field.value}
                            onChange={field.onChange}
                            language="json"
                            height="400px"
                          />
                        )}
                      />
                    </div>
                  </Collapse>
                  
                  {errors.schemaDefinition && (
                    <Alert severity="error" className="mt-8">
                      {errors.schemaDefinition.message}
                    </Alert>
                  )}
                </div>
                
                <div className="mb-16">
                  <Box className="flex justify-between items-center mb-8">
                    <Typography variant="subtitle1">فیلدهای قابل جستجو (برای ElasticSearch)</Typography>
                    <Button 
                      size="small" 
                      onClick={handleToggleElasticFields}
                      startIcon={<FuseSvgIcon>{elasticFieldsOpen ? 'heroicons-outline:minus' : 'heroicons-outline:plus'}</FuseSvgIcon>}
                    >
                      {elasticFieldsOpen ? 'بستن' : 'باز کردن'}
                    </Button>
                  </Box>
                  
                  <Collapse in={elasticFieldsOpen}>
                    <div className="mb-16">
                      <Controller
                        name="elasticFields"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="فیلدهای قابل جستجو"
                            placeholder="نام‌های فیلدها را با کاما جدا کنید یا یک آرایه JSON وارد کنید"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!errors.elasticFields}
                            helperText={errors.elasticFields?.message}
                          />
                        )}
                      />
                      
                      {searchableFields.length > 0 && (
                        <Box className="mt-8">
                          <Typography variant="body2" className="mb-4">
                            فیلدهای قابل جستجو در طرحواره:
                          </Typography>
                          <Box className="flex flex-wrap gap-4">
                            {searchableFields.map((field) => (
                              <Chip
                                key={field}
                                label={field}
                                size="small"
                                onClick={() => {
                                  const currentFields = watch('elasticFields') || '';
                                  const fieldsArray = currentFields
                                    ? currentFields.split(',').map(f => f.trim()).filter(Boolean)
                                    : [];
                                    
                                  if (!fieldsArray.includes(field)) {
                                    fieldsArray.push(field);
                                    setValue('elasticFields', fieldsArray.join(', '));
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </div>
                  </Collapse>
                </div>
                
                <Typography variant="body2" color="text.secondary">
                  طرحواره‌های سرویس برای تعریف ساختار سرویس‌ها استفاده می‌شوند و باید به فرمت JSON Schema باشند.
                </Typography>
              </>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button
            type="submit"
            form="schema-form"
            variant="contained"
            color="primary"
            disabled={isSubmitting || isLoadingCurrentSchema}
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
        <DialogTitle>حذف طرحواره سرویس</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از حذف این طرحواره سرویس اطمینان دارید؟ این عملیات قابل بازگشت نیست.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>انصراف</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'حذف'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Schema Preview Dialog */}
      <Dialog
        open={!!previewSchemaId}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>پیش‌نمایش طرحواره سرویس</DialogTitle>
        <DialogContent>
          <SchemaPreview schemaId={previewSchemaId} type="service" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>بستن</Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default ServiceSchemasTab;