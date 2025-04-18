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
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetConfigSchemasQuery, useGetConfigSchemaQuery, useCreateConfigSchemaMutation, useUpdateConfigSchemaMutation, useDeleteConfigSchemaMutation } from './store/configManagementApi';
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
    .min(3, 'نام شما باید حداقل 3 کاراکتر باشد')
    .max(50, 'نام شما نمی‌تواند بیش از 50 کاراکتر باشد')
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
});

const ConfigSchemasTab = () => {
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
  
  // RTK Query hooks
  const { 
    data: schemasData, 
    isLoading: isLoadingSchemas, 
    isFetching: isFetchingSchemas, 
    error: schemasError,
    refetch: refetchSchemas
  } = useGetConfigSchemasQuery({
    pageNumber: page,
    pageSize,
    search: searchTerm,
  });
  
  const { 
    data: currentSchema, 
    isLoading: isLoadingCurrentSchema 
  } = useGetConfigSchemaQuery(currentSchemaId, { 
    skip: !currentSchemaId 
  });
  
  const [
    createConfigSchema, 
    { isLoading: isCreating }
  ] = useCreateConfigSchemaMutation();
  
  const [
    updateConfigSchema, 
    { isLoading: isUpdating }
  ] = useUpdateConfigSchemaMutation();
  
  const [
    deleteConfigSchema, 
    { isLoading: isDeleting }
  ] = useDeleteConfigSchemaMutation();
  
  // Form setup
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schemaFormSchema),
    defaultValues: {
      name: '',
      displayName: '',
      schemaDefinition: JSON.stringify({ 
        type: 'object',
        properties: {},
        required: []
      }, null, 2),
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
          : currentSchema.schemaDefinition
      });
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
    });
    setOpenDialog(true);
    setShowJsonEditor(false);
    setSchemaError(null);
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
      
      const payload = {
        name: data.name,
        displayName: data.displayName,
        schemaDefinition: data.schemaDefinition
      };
      
      if (editMode) {
        await updateConfigSchema({ id: currentSchemaId, ...payload }).unwrap();
        enqueueSnackbar('طرحواره با موفقیت به‌روزرسانی شد', { variant: 'success' });
      } else {
        await createConfigSchema(payload).unwrap();
        enqueueSnackbar('طرحواره با موفقیت ایجاد شد', { variant: 'success' });
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
      await deleteConfigSchema(currentSchemaId).unwrap();
      enqueueSnackbar('طرحواره با موفقیت حذف شد', { variant: 'success' });
      setOpenDeleteDialog(false);
      refetchSchemas();
    } catch (error) {
      console.error('Error deleting schema:', error);
      enqueueSnackbar(error.data?.message || 'خطا در حذف طرحواره', { variant: 'error' });
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
  
  // Computed values
  const isSubmitting = isCreating || isUpdating;
  const schemas = schemasData?.data || [];
  const totalPages = schemasData?.totalPages || 0;
  const loading = isLoadingSchemas || isFetchingSchemas;
  
  return (
    <Root className="flex flex-col flex-auto min-h-full">
      <div className="header p-24 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <Typography className="text-3xl font-bold tracking-tight leading-8">
            مدیریت طرحواره‌های پیکربندی
          </Typography>
          <Typography className="font-medium tracking-tight" color="text.secondary">
            طرحواره‌های پیکربندی سیستم را مدیریت کنید
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
            افزودن طرحواره جدید
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
            خطا در بارگیری طرحواره‌ها: {schemasError.data?.message || 'خطای ناشناخته'}
          </Alert>
        ) : (
          <Paper className="w-full max-w-4xl rounded-lg shadow overflow-hidden">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>نام</TableCell>
                    <TableCell>نام نمایشی</TableCell>
                    <TableCell align="center">تعداد پیکربندی‌ها</TableCell>
                    <TableCell align="center">عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" height={250}>
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
                            label={schema.configCount || 0}
                            color={schema.configCount ? 'success' : 'default'}
                            size="small"
                          />
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
                                disabled={schema.configCount > 0}
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
                      <TableCell colSpan={4} align="center" height={100}>
                        <Typography color="text.secondary">
                          هیچ طرحواره‌ای یافت نشد
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
          {editMode ? 'ویرایش طرحواره' : 'افزودن طرحواره جدید'}
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
                    <Typography variant="subtitle1">تعریف طرحواره (JSON Schema)</Typography>
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
                
                <Typography variant="body2" color="text.secondary">
                  طرحواره‌ها برای تعریف ساختار پیکربندی‌ها استفاده می‌شوند و باید به فرمت JSON Schema باشند.
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
        <DialogTitle>حذف طرحواره</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از حذف این طرحواره اطمینان دارید؟ این عملیات قابل بازگشت نیست.
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
        <DialogTitle>پیش‌نمایش طرحواره</DialogTitle>
        <DialogContent>
          <SchemaPreview schemaId={previewSchemaId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>بستن</Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default ConfigSchemasTab;