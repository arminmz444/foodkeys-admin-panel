// src/components/DynamicForm/DynamicFormRenderer.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  Checkbox, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  Slider,
  Switch,
  Grid,
  Paper,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { validate } from 'jsonschema';

/**
 * Dynamic Form Renderer Component - Renders a form based on a Formily-like schema
 * 
 * @param {Object} props - Component props
 * @param {Object} props.schema - The form schema
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.readOnly - Whether the form is read-only
 */
const DynamicForm = ({
  schema,
  initialValues = {},
  onSubmit,
  onChange,
  loading = false,
  readOnly = false,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Initialize form values with schema defaults
  useEffect(() => {
    if (schema && schema.properties) {
      const defaultValues = { ...initialValues };
      
      // Extract default values from schema
      Object.entries(schema.properties).forEach(([key, field]) => {
        if (field.default !== undefined && defaultValues[key] === undefined) {
          defaultValues[key] = field.default;
        }
      });
      
      setFormValues(defaultValues);
    }
  }, [schema, initialValues]);

  // Handle field value change
  const handleFieldChange = (name, value) => {
    const newValues = { ...formValues, [name]: value };
    setFormValues(newValues);
    
    // Validate the field if already attempted submit
    if (submitAttempted) {
      validateField(name, value);
    }
    
    // Call onChange prop if provided
    if (onChange) {
      onChange(newValues);
    }
  };

  // Validate a single field
  const validateField = (name, value) => {
    if (!schema || !schema.properties || !schema.properties[name]) {
      return true;
    }
    
    const fieldSchema = schema.properties[name];
    const errors = [];
    
    // Required check
    if (schema.required && schema.required.includes(name) && 
        (value === undefined || value === null || value === '')) {
      errors.push('This field is required');
    }
    
    // Type validation
    switch (fieldSchema.type) {
      case 'string':
        if (value && fieldSchema.minLength && value.length < fieldSchema.minLength) {
          errors.push(`Minimum length is ${fieldSchema.minLength}`);
        }
        if (value && fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
          errors.push(`Maximum length is ${fieldSchema.maxLength}`);
        }
        if (value && fieldSchema.pattern) {
          const pattern = new RegExp(fieldSchema.pattern);
          if (!pattern.test(value)) {
            errors.push(fieldSchema.patternError || 'Invalid format');
          }
        }
        break;
      case 'number':
      case 'integer':
        const numValue = Number(value);
        if (value !== '' && isNaN(numValue)) {
          errors.push('Must be a number');
        }
        if (numValue !== '' && fieldSchema.minimum !== undefined && numValue < fieldSchema.minimum) {
          errors.push(`Minimum value is ${fieldSchema.minimum}`);
        }
        if (numValue !== '' && fieldSchema.maximum !== undefined && numValue > fieldSchema.maximum) {
          errors.push(`Maximum value is ${fieldSchema.maximum}`);
        }
        break;
      case 'array':
        if (value && fieldSchema.minItems && value.length < fieldSchema.minItems) {
          errors.push(`At least ${fieldSchema.minItems} items required`);
        }
        if (value && fieldSchema.maxItems && value.length > fieldSchema.maxItems) {
          errors.push(`Maximum ${fieldSchema.maxItems} items allowed`);
        }
        break;
      default:
        break;
    }
    
    // Custom validation rules
    if (fieldSchema.validator && typeof fieldSchema.validator === 'function') {
      try {
        const customError = fieldSchema.validator(value, formValues);
        if (customError) {
          errors.push(customError);
        }
      } catch (err) {
        console.error('Custom validator error:', err);
      }
    }
    
    // Update form errors
    const newErrors = { ...formErrors };
    if (errors.length > 0) {
      newErrors[name] = errors;
    } else {
      delete newErrors[name];
    }
    setFormErrors(newErrors);
    
    return errors.length === 0;
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate each field according to the schema
    if (schema && schema.properties) {
      Object.keys(schema.properties).forEach(fieldName => {
        const fieldSchema = schema.properties[fieldName];
        const value = formValues[fieldName];
        
        const errors = [];
        
        // Required check
        if (schema.required && schema.required.includes(fieldName) && 
            (value === undefined || value === null || value === '')) {
          errors.push('This field is required');
          isValid = false;
        }
        
        // Type validation (similar to validateField)
        // ... (validation logic similar to validateField)
        
        if (errors.length > 0) {
          newErrors[fieldName] = errors;
        }
      });
    }
    
    // Use JSON Schema validation for the whole form if needed
    try {
      const result = validate(formValues, schema);
      if (!result.valid) {
        result.errors.forEach(error => {
          const path = error.property.replace('instance.', '');
          if (!newErrors[path]) {
            newErrors[path] = [];
          }
          newErrors[path].push(error.message);
          isValid = false;
        });
      }
    } catch (err) {
      console.error('Schema validation error:', err);
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    const isValid = validateForm();
    if (isValid && onSubmit) {
      onSubmit(formValues);
    }
  };

  // Get error message for field
  const getFieldError = (name) => {
    if (!formErrors[name]) return null;
    return formErrors[name][0]; // Return first error message
  };

  // Render a form field based on its type
  const renderField = (name, fieldSchema) => {
    const {
      title,
      description,
      type,
      enum: enumValues,
      enumNames,
      widget = getDefaultWidget(type, enumValues),
      disabled = false,
      hidden = false,
      xComponent, // Custom component name
      ...otherProps
    } = fieldSchema;
    
    const value = formValues[name] !== undefined ? formValues[name] : '';
    const errorMessage = getFieldError(name);
    const isError = !!errorMessage;
    const isFieldRequired = schema.required && schema.required.includes(name);
    
    // Handle hidden fields
    if (hidden) {
      return null;
    }
    
    // Common props for all field types
    const commonProps = {
      key: name,
      id: name,
      label: title || name,
      value,
      disabled: disabled || readOnly || loading,
      error: isError,
      helperText: errorMessage || description,
      required: isFieldRequired,
      fullWidth: true,
      margin: "normal",
      size: "medium",
      ...otherProps
    };
    
    // Render different form elements based on widget type
    switch (widget) {
      case 'input':
      case 'text':
        return (
          <TextField
            {...commonProps}
            type="text"
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );
      
      case 'textarea':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={4}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );
      
      case 'number':
        return (
          <TextField
            {...commonProps}
            type="number"
            onChange={(e) => handleFieldChange(name, e.target.value)}
            inputProps={{
              min: fieldSchema.minimum,
              max: fieldSchema.maximum,
              step: fieldSchema.multipleOf || 1,
            }}
          />
        );
      
      case 'select':
        return (
          <FormControl
            fullWidth
            margin="normal"
            error={isError}
            required={isFieldRequired}
            disabled={disabled || readOnly || loading}
          >
            <InputLabel id={`${name}-label`}>{title || name}</InputLabel>
            <Select
              labelId={`${name}-label`}
              id={name}
              value={value}
              label={title || name}
              onChange={(e) => handleFieldChange(name, e.target.value)}
            >
              {(enumValues || []).map((item, index) => (
                <MenuItem key={item} value={item}>
                  {enumNames ? enumNames[index] : item}
                </MenuItem>
              ))}
            </Select>
            {(errorMessage || description) && (
              <FormHelperText>{errorMessage || description}</FormHelperText>
            )}
          </FormControl>
        );
      
      case 'checkbox':
        return (
          <FormControl
            fullWidth
            margin="normal"
            error={isError}
            required={isFieldRequired}
            disabled={disabled || readOnly || loading}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!value}
                  onChange={(e) => handleFieldChange(name, e.target.checked)}
                />
              }
              label={title || name}
            />
            {(errorMessage || description) && (
              <FormHelperText>{errorMessage || description}</FormHelperText>
            )}
          </FormControl>
        );
      
      case 'radio':
        return (
          <FormControl
            fullWidth
            margin="normal"
            error={isError}
            required={isFieldRequired}
            disabled={disabled || readOnly || loading}
          >
            <Typography variant="subtitle2" gutterBottom>
              {title || name}
            </Typography>
            <RadioGroup
              name={name}
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
            >
              {(enumValues || []).map((item, index) => (
                <FormControlLabel
                  key={item}
                  value={item}
                  control={<Radio />}
                  label={enumNames ? enumNames[index] : item}
                />
              ))}
            </RadioGroup>
            {(errorMessage || description) && (
              <FormHelperText>{errorMessage || description}</FormHelperText>
            )}
          </FormControl>
        );
      
      case 'slider':
        return (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography id={`${name}-label`} gutterBottom>
              {title || name} {isFieldRequired && <span style={{ color: 'error.main' }}>*</span>}
            </Typography>
            <Slider
              {...commonProps}
              aria-labelledby={`${name}-label`}
              getAriaValueText={(v) => `${v}`}
              valueLabelDisplay="auto"
              onChange={(_, newValue) => handleFieldChange(name, newValue)}
              min={fieldSchema.minimum || 0}
              max={fieldSchema.maximum || 100}
              step={fieldSchema.multipleOf || 1}
            />
            {(errorMessage || description) && (
              <FormHelperText error={isError}>{errorMessage || description}</FormHelperText>
            )}
          </Box>
        );
      
      case 'switch':
        return (
          <FormControl
            fullWidth
            margin="normal"
            error={isError}
            required={isFieldRequired}
            disabled={disabled || readOnly || loading}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={!!value}
                  onChange={(e) => handleFieldChange(name, e.target.checked)}
                />
              }
              label={title || name}
            />
            {(errorMessage || description) && (
              <FormHelperText>{errorMessage || description}</FormHelperText>
            )}
          </FormControl>
        );
      
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={title || name}
              value={value || null}
              onChange={(newValue) => handleFieldChange(name, newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: isFieldRequired,
                  error: isError,
                  helperText: errorMessage || description,
                  disabled: disabled || readOnly || loading,
                }
              }}
            />
          </LocalizationProvider>
        );
      
      case 'datetime':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label={title || name}
              value={value || null}
              onChange={(newValue) => handleFieldChange(name, newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: isFieldRequired,
                  error: isError,
                  helperText: errorMessage || description,
                  disabled: disabled || readOnly || loading,
                }
              }}
            />
          </LocalizationProvider>
        );
      
      case 'time':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label={title || name}
              value={value || null}
              onChange={(newValue) => handleFieldChange(name, newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: isFieldRequired,
                  error: isError,
                  helperText: errorMessage || description,
                  disabled: disabled || readOnly || loading,
                }
              }}
            />
          </LocalizationProvider>
        );
      
      default:
        return (
          <TextField
            {...commonProps}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );
    }
  };

  // Get default widget type based on data type
  const getDefaultWidget = (type, enumValues) => {
    if (enumValues && enumValues.length > 0) {
      return enumValues.length <= 3 ? 'radio' : 'select';
    }
    
    switch (type) {
      case 'string':
        return 'input';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'checkbox';
      case 'array':
        return 'select';
      default:
        return 'input';
    }
  };

  // Render form structure
  const renderForm = () => {
    if (!schema || !schema.properties) {
      return (
        <Alert severity="error">
          Invalid form schema. Please check the schema configuration.
        </Alert>
      );
    }
    
    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.entries(schema.properties).map(([name, fieldSchema]) => {
            const { span = 12 } = fieldSchema;
            return (
              <Grid item xs={12} sm={span} key={name}>
                {renderField(name, fieldSchema)}
              </Grid>
            );
          })}
          
          {onSubmit && !readOnly && (
            <Grid item xs={12}>
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Submitting...
                    </>
                  ) : (
                    schema.submitText || 'Submit'
                  )}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </form>
    );
  };

  return (
    <Box>
      {schema?.title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {schema.title}
        </Typography>
      )}
      
      {schema?.description && (
        <Typography variant="body2" color="textSecondary" paragraph>
          {schema.description}
        </Typography>
      )}
      
      <Paper sx={{ p: 3, mt: 2 }}>
        {renderForm()}
      </Paper>
    </Box>
  );
};

export default DynamicForm;