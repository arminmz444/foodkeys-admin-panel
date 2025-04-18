import React, { useState, useEffect } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  FormGroup, 
  FormControl, 
  FormHelperText, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  IconButton, 
  Box, 
  Typography, 
  Grid, 
  Divider, 
  Paper, 
  Tooltip, 
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { ChromePicker } from 'react-color';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { jsonSchemaToZod, createFormStructure, prepareFormInitialValues, generatePlaceholder } from './form-utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { zodResolver } from '@hookform/resolvers/zod';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// RTL cache for components
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

/**
 * Dynamic Form component that renders form fields based on a JSON schema
 */
const DynamicForm = ({
  schema,
  onSubmit,
  initialData = {},
  submitLabel = 'ذخیره',
  cancelLabel = 'انصراف',
  onCancel,
  isSubmitting = false,
  isReadOnly = false,
  submitButtonProps = {},
  cancelButtonProps = {},
}) => {
  const [formStructure, setFormStructure] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  
  useEffect(() => {
    if (!schema) return;
    
    try {
      // Parse schema if it's a string
      const parsedSchema = typeof schema === 'string' ? JSON.parse(schema) : schema;
      
      // Create form structure and initial values
      const structure = createFormStructure(parsedSchema);
      setFormStructure(structure);
      
      const values = prepareFormInitialValues(parsedSchema, initialData);
      setInitialValues(values);
    } catch (error) {
      console.error('Error parsing schema:', error);
    }
  }, [schema, initialData]);
  
  // Create validation schema from JSON schema
  const validationSchema = React.useMemo(() => {
    if (!schema) return null;
    try {
      return jsonSchemaToZod(
        typeof schema === 'string' ? JSON.parse(schema) : schema
      );
    } catch (error) {
      console.error('Error creating validation schema:', error);
      return null;
    }
  }, [schema]);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: initialValues,
    resolver: validationSchema ? zodResolver(validationSchema) : undefined
  });
  
  // Reset form when initialValues change
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);
  
  const handleFormSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };
  
  if (!schema || !formStructure.length) {
    return <Alert severity="info">فرم در دسترس نیست</Alert>;
  }
  
  return (
    <CacheProvider value={rtlCache}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Paper className="p-16 sm:p-24 mb-24">
          <Grid container spacing={2}>
            {formStructure.map((field) => (
              <React.Fragment key={field.path}>
                <Grid item xs={12} md={field.ui.fullWidth ? 12 : 6}>
                  <FormField
                    field={field}
                    control={control}
                    errors={errors}
                    isReadOnly={isReadOnly}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          
          {!isReadOnly && (
            <Box className="mt-24 flex justify-end gap-8">
              {onCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  {...cancelButtonProps}
                >
                  {cancelLabel}
                </Button>
              )}
              
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                {...submitButtonProps}
              >
                {isSubmitting ? 'در حال ذخیره...' : submitLabel}
              </Button>
            </Box>
          )}
        </Paper>
      </form>
    </CacheProvider>
  );
};

/**
 * Individual form field component
 */
const FormField = ({ field, control, errors, isReadOnly = false }) => {
  const fieldError = errors[field.name]?.message;
  
  switch (field.component) {
    case 'text':
    case 'email':
    case 'url':
    case 'password':
      return (
        <Controller
          name={field.path}
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label={field.title}
              value={value || ''}
              onChange={onChange}
              onBlur={onBlur}
              error={!!fieldError}
              helperText={fieldError || field.description}
              fullWidth
              type={field.component}
              placeholder={generatePlaceholder(field)}
              variant="outlined"
              disabled={isReadOnly}
              required={field.required}
              InputProps={field.ui.inputProps}
            />
          )}
        />
      );
      
    case 'number':
      return (
        <Controller
          name={field.path}
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label={field.title}
              value={value === null ? '' : value}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value);
                onChange(val);
              }}
              onBlur={onBlur}
              error={!!fieldError}
              helperText={fieldError || field.description}
              fullWidth
              type="number"
              placeholder={generatePlaceholder(field)}
              variant="outlined"
              disabled={isReadOnly}
              required={field.required}
              InputProps={{
                inputProps: {
                  min: field.validation.minimum,
                  max: field.validation.maximum,
                  step: field.validation.multipleOf || (field.type === 'integer' ? 1 : 'any'),
                },
                ...field.ui.inputProps
              }}
            />
          )}
        />
      );
      
    case 'textarea':
      return (
        <Controller
          name={field.path}
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label={field.title}
              value={value || ''}
              onChange={onChange}
              onBlur={onBlur}
              error={!!fieldError}
              helperText={fieldError || field.description}
              fullWidth
              multiline
              rows={field.ui.rows || 4}
              placeholder={generatePlaceholder(field)}
              variant="outlined"
              disabled={isReadOnly}
              required={field.required}
            />
          )}
        />
      );
      
    case 'richtext':
      return (
        <Controller
          name={field.path}
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl fullWidth error={!!fieldError}>
              <Typography variant="body1" className="mb-8" component="div">
                {field.title} {field.required && <span className="text-red-500">*</span>}
              </Typography>
              <ReactQuill
                value={value || ''}
                onChange={onChange}
                theme="snow"
                readOnly={isReadOnly}
                placeholder={generatePlaceholder(field)}
              />
              {(fieldError || field.description) && (
                <FormHelperText>
                  {fieldError || field.description}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      );
      
    case 'checkbox':
      return (
        <Controller
          name={field.path}
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl error={!!fieldError} fullWidth>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={isReadOnly}
                  />
                }
                label={field.title}
              />
              {(fieldError || field.description) && (
                <FormHelperText>
                  {fieldError || field.description}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      );
      
    case 'select':
      return (
        <Controller
          name={field.path}
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl fullWidth error={!!fieldError} variant="outlined">
              <InputLabel>{field.title}</InputLabel>
              <Select
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                label={field.title}
                disabled={isReadOnly}
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {(fieldError || field.description) && (
                <FormHelperText>
                  {fieldError || field.description}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      );
      
    case 'multiselect':
      return (
        <Controller
          name={field.path}
          control={control}
          render={({ field: { value = [], onChange, onBlur } }) => (
            <FormControl fullWidth error={!!fieldError} variant="outlined">
              <InputLabel>{field.title}</InputLabel>
              <Select
                multiple
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                label={field.title}
                disabled={isReadOnly}
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {(fieldError || field.description) && (
                <FormHelperText>
                  {fieldError || field.description}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      );
      
    case 'datepicker':
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name={field.path}
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormControl fullWidth error={!!fieldError}>
                <DatePicker
                  label={field.title}
                  value={value ? dayjs(value) : null}
                  onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      error: !!fieldError,
                      helperText: fieldError || field.description,
                      required: field.required,
                      onBlur
                    }
                  }}
                  disabled={isReadOnly}
                />
              </FormControl>
            )}
          />
        </LocalizationProvider>
      );
      
    case 'colorpicker':
      return (
        <Controller
          name={field.path}
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl fullWidth error={!!fieldError}>
              <Typography variant="body1" className="mb-8" component="div">
                {field.title} {field.required && <span className="text-red-500">*</span>}
              </Typography>
              <Box className="mb-8">
                <ChromePicker
                  color={value || '#000000'}
                  onChange={(color) => onChange(color.hex)}
                  disableAlpha={!field.ui.alpha}
                  disabled={isReadOnly}
                />
              </Box>
              {(fieldError || field.description) && (
                <FormHelperText>
                  {fieldError || field.description}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      );
      
    case 'array':
      return <ArrayField field={field} control={control} errors={errors} isReadOnly={isReadOnly} />;
      
    case 'fieldset':
      return (
        <Box className="w-full mb-8">
          <Typography variant="h6" className="mb-16">
            {field.title}
          </Typography>
          {field.description && (
            <Typography variant="body2" className="mb-16 text-gray-600">
              {field.description}
            </Typography>
          )}
          <Grid container spacing={2}>
            {field.subfields?.map((subfield) => (
              <Grid item xs={12} md={subfield.ui.fullWidth ? 12 : 6} key={subfield.path}>
                <FormField
                  field={subfield}
                  control={control}
                  errors={errors}
                  isReadOnly={isReadOnly}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      );
      
    default:
      return (
        <Alert severity="warning">
          نوع فیلد پشتیبانی نشده: {field.component}
        </Alert>
      );
  }
};

/**
 * Component for array fields with dynamic items
 */
const ArrayField = ({ field, control, errors, isReadOnly }) => {
  const fieldError = errors[field.name]?.message;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.path,
  });
  
  const handleAddItem = () => {
    // Create empty item with default values
    const emptyItem = field.subfields?.reduce((acc, subfield) => {
      const key = subfield.name;
      switch (subfield.type) {
        case 'string':
          acc[key] = '';
          break;
        case 'number':
        case 'integer':
          acc[key] = null;
          break;
        case 'boolean':
          acc[key] = false;
          break;
        case 'array':
          acc[key] = [];
          break;
        case 'object':
          acc[key] = {};
          break;
        default:
          acc[key] = null;
      }
      return acc;
    }, {}) || {};
    
    append(emptyItem);
  };
  
  return (
    <Box className="w-full mb-16">
      <Box className="flex justify-between items-center mb-8">
        <Typography variant="body1" component="div">
          {field.title} {field.required && <span className="text-red-500">*</span>}
        </Typography>
        
        {!isReadOnly && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddItem}
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            افزودن آیتم
          </Button>
        )}
      </Box>
      
      {field.description && (
        <Typography variant="body2" className="mb-8 text-gray-600">
          {field.description}
        </Typography>
      )}
      
      {fieldError && (
        <FormHelperText error className="mb-8">
          {fieldError}
        </FormHelperText>
      )}
      
      {fields.length === 0 ? (
        <Alert severity="info" className="mb-16">
          هیچ آیتمی وجود ندارد
        </Alert>
      ) : (
        fields.map((item, index) => (
          <Paper
            key={item.id}
            className="p-16 mb-16 border border-gray-300"
            elevation={0}
          >
            <Box className="flex justify-between mb-16">
              <Typography variant="subtitle1">
                آیتم {index + 1}
              </Typography>
              
              {!isReadOnly && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(index)}
                  aria-label="حذف آیتم"
                >
                  <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
                </IconButton>
              )}
            </Box>
            
            <Grid container spacing={2}>
              {field.subfields?.map((subfield) => {
                const subfieldPath = `${field.path}[${index}].${subfield.name}`;
                
                return (
                  <Grid
                    item
                    xs={12}
                    md={subfield.ui.fullWidth ? 12 : 6}
                    key={subfieldPath}
                  >
                    <FormField
                      field={{
                        ...subfield,
                        path: subfieldPath,
                      }}
                      control={control}
                      errors={errors}
                      isReadOnly={isReadOnly}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default DynamicForm;