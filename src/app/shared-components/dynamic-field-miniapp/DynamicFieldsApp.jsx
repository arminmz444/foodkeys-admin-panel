// src/dynamic-fields-miniapp/DynamicFieldsApp.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
  Snackbar
} from '@mui/material';
import { 
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

/**
 * Dynamic Fields MiniApp for Company Entity
 * This component allows adding custom fields to a company
 */
const DynamicFieldsApp = ({ companyId }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  
  // Field types available for dynamic fields
  const fieldTypes = [
    { value: 'text', label: 'متن' },
    { value: 'number', label: 'عدد' },
    { value: 'email', label: 'ایمیل' },
    { value: 'url', label: 'لینک' },
    { value: 'select', label: 'انتخاب از لیست' },
    { value: 'checkbox', label: 'تیک باکس' },
    { value: 'date', label: 'تاریخ' },
    { value: 'textarea', label: 'متن چند خطی' }
  ];
  
  // Load existing company data and dynamic fields
  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch company data
        const companyResponse = await fetch(`/api/companies/${companyId}`);
        if (!companyResponse.ok) {
          throw new Error(`Failed to fetch company: ${companyResponse.statusText}`);
        }
        const company = await companyResponse.json();
        setCompanyData(company);
        
        // Fetch dynamic fields configuration
        const fieldsResponse = await fetch(`/api/companies/${companyId}/dynamic-fields`);
        if (!fieldsResponse.ok) {
          // If this API endpoint doesn't exist yet, we'll create an empty fields array
          if (fieldsResponse.status === 404) {
            setFields([]);
          } else {
            throw new Error(`Failed to fetch fields: ${fieldsResponse.statusText}`);
          }
        } else {
          const fieldsData = await fieldsResponse.json();
          setFields(fieldsData || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyId]);
  
  // Add a new field
  const handleAddField = () => {
    setFields([...fields, {
      id: Date.now(),
      name: '',
      label: '',
      type: 'text',
      required: false,
      options: [],
      value: '',
      isNew: true
    }]);
  };
  
  // Update a field property
  const handleFieldChange = (index, property, value) => {
    const updatedFields = [...fields];
    updatedFields[index][property] = value;
    
    // If type changed to select and options don't exist, initialize them
    if (property === 'type' && value === 'select' && !updatedFields[index].options) {
      updatedFields[index].options = [];
    }
    
    setFields(updatedFields);
  };
  
  // Add an option to a select field
  const handleAddOption = (index, option) => {
    if (!option || option.trim() === '') return;
    
    const updatedFields = [...fields];
    if (!updatedFields[index].options) {
      updatedFields[index].options = [];
    }
    
    if (!updatedFields[index].options.includes(option)) {
      updatedFields[index].options.push(option);
      setFields(updatedFields);
    }
  };
  
  // Remove an option from a select field
  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(updatedFields);
  };
  
  // Remove a field
  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };
  
  // Save all fields
  const handleSave = async () => {
    // Validate fields
    const invalidFields = fields.filter(field => !field.name || !field.label);
    if (invalidFields.length > 0) {
      setError('لطفاً برای تمام فیلدها نام و برچسب وارد کنید');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Save fields configuration
      const configResponse = await fetch(`/api/companies/${companyId}/dynamic-fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
      });
      
      if (!configResponse.ok) {
        throw new Error(`Failed to save field configuration: ${configResponse.statusText}`);
      }
      
      // Save field values in company's additional info
      const fieldValues = {};
      fields.forEach(field => {
        fieldValues[field.name] = field.value || null;
      });
      
      const valuesResponse = await fetch(`/api/companies/${companyId}/additional-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dynamicFields: fieldValues })
      });
      
      if (!valuesResponse.ok) {
        throw new Error(`Failed to save field values: ${valuesResponse.statusText}`);
      }
      
      setSuccess(true);
      
      // Mark all fields as not new
      setFields(fields.map(field => ({ ...field, isNew: false })));
    } catch (err) {
      console.error('Error saving fields:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  
  // Handle success snackbar close
  const handleSnackbarClose = () => {
    setSuccess(false);
  };
  
  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            فیلدهای دینامیک شرکت
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddField}
          >
            افزودن فیلد جدید
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Field list and editor */}
        {fields.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            هیچ فیلد دینامیکی تعریف نشده است. برای ایجاد فیلد جدید روی دکمه "افزودن فیلد جدید" کلیک کنید.
          </Alert>
        ) : (
          fields.map((field, index) => (
            <Paper key={field.id} sx={{ p: 2, mb: 3, border: field.isNew ? '1px dashed #1976d2' : 'none' }}>
              {field.isNew && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  این فیلد هنوز ذخیره نشده است.
                </Alert>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="نام فیلد (انگلیسی)"
                    value={field.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    helperText="نام فیلد باید انگلیسی و بدون فاصله باشد"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="برچسب فیلد (فارسی)"
                    value={field.label}
                    onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>نوع فیلد</InputLabel>
                    <Select
                      value={field.type}
                      onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                    >
                      {fieldTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.required || false}
                        onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                      />
                    }
                    label="اجباری"
                  />
                </Grid>
                
                {/* Field-specific options */}
                {field.type === 'select' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      گزینه‌ها
                    </Typography>
                    
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <TextField
                        label="گزینه جدید"
                        size="small"
                        sx={{ flex: 1, mr: 1 }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddOption(index, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <Button 
                        variant="outlined"
                        onClick={(e) => {
                          const input = e.target.previousSibling;
                          handleAddOption(index, input.value);
                          input.value = '';
                        }}
                      >
                        افزودن
                      </Button>
                    </Box>
                    
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {field.options && field.options.map((option, optionIndex) => (
                        <Chip
                          key={optionIndex}
                          label={option}
                          onDelete={() => handleRemoveOption(index, optionIndex)}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {/* Field value preview */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    مقدار پیش‌فرض
                  </Typography>
                  
                  {field.type === 'text' || field.type === 'email' || field.type === 'url' || field.type === 'number' ? (
                    <TextField
                      fullWidth
                      type={field.type}
                      label={field.label}
                      value={field.value || ''}
                      onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                    />
                  ) : field.type === 'textarea' ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label={field.label}
                      value={field.value || ''}
                      onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                    />
                  ) : field.type === 'select' ? (
                    <FormControl fullWidth>
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        value={field.value || ''}
                        onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                      >
                        {field.options && field.options.map((option, optionIndex) => (
                          <MenuItem key={optionIndex} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : field.type === 'checkbox' ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value === true}
                          onChange={(e) => handleFieldChange(index, 'value', e.target.checked)}
                        />
                      }
                      label={field.label}
                    />
                  ) : field.type === 'date' ? (
                    <TextField
                      fullWidth
                      type="date"
                      label={field.label}
                      InputLabelProps={{ shrink: true }}
                      value={field.value || ''}
                      onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                    />
                  ) : null}
                </Grid>
                
                {/* Delete button */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemoveField(index)}
                  >
                    حذف فیلد
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))
        )}
        
        {/* Save button */}
        {fields.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Preview of all fields */}
      {fields.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            پیش‌نمایش فرم
          </Typography>
          
          <Grid container spacing={3}>
            {fields.map((field, index) => (
              <Grid item xs={12} sm={6} key={field.id}>
                {field.type === 'text' || field.type === 'email' || field.type === 'url' || field.type === 'number' ? (
                  <TextField
                    fullWidth
                    type={field.type}
                    label={field.label}
                    value={field.value || ''}
                    required={field.required}
                    disabled
                  />
                ) : field.type === 'textarea' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label={field.label}
                    value={field.value || ''}
                    required={field.required}
                    disabled
                  />
                ) : field.type === 'select' ? (
                  <FormControl fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      value={field.value || ''}
                      required={field.required}
                      disabled
                    >
                      {field.options && field.options.map((option, optionIndex) => (
                        <MenuItem key={optionIndex} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : field.type === 'checkbox' ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value === true}
                        disabled
                      />
                    }
                    label={field.label}
                  />
                ) : field.type === 'date' ? (
                  <TextField
                    fullWidth
                    type="date"
                    label={field.label}
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    required={field.required}
                    disabled
                  />
                ) : null}
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      
      {/* Success snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="فیلدهای دینامیک با موفقیت ذخیره شدند"
      />
    </Box>
  );
};

export default DynamicFieldsApp;