// // src/app/main/banks/services/subcategories/ServiceSchemaCreator.jsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   Paper, 
//   Typography, 
//   TextField, 
//   Button, 
//   Divider, 
//   Grid, 
//   Tab, 
//   Tabs, 
//   Box, 
//   Chip,
//   Snackbar,
//   Alert,
//   Card,
//   CardHeader,
//   CardContent,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   IconButton
// } from '@mui/material';
// import FuseLoading from '@fuse/core/FuseLoading';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SaveIcon from '@mui/icons-material/Save';
// import PreviewIcon from '@mui/icons-material/Preview';
// import EnhancedFormBuilder from '../../../../shared-components/form-builder/EnhancedFormBuilder';
// import { 
//   useGetSubCategoryQuery
// } from '../../../category/sub-category/SubCategoriesApi';
// import EnhancedDynamicFormGenerator from '../../../../shared-components/dynamic-field-generator/EnhancedDynamicFormGenerator';

// function ServiceSchemaCreator() {
//   const { id } = useParams(); // Subcategory ID
//   const navigate = useNavigate();
  
//   // Fetch subcategory details
//   const { data: subcategoryData, isLoading: isLoadingSubcategory } = useGetSubCategoryQuery(id);
  
//   // Mutations for creating/updating schema
//   // const [createServiceSchema, { isLoading: isCreating }] = useCreateServiceSchemaMutation();
//   // const [updateServiceSchema, { isLoading: isUpdating }] = useUpdateServiceSchemaMutation();
//   // /
//   // Form state
//   const [formFields, setFormFields] = useState([]);
//   const [schemaName, setSchemaName] = useState('');
//   const [schemaDisplayName, setSchemaDisplayName] = useState('');
//   const [elasticFields, setElasticFields] = useState([]);
//   const [schemaFormat, setSchemaFormat] = useState('json');
//   const [generatedSchema, setGeneratedSchema] = useState('');
  
//   // UI state
//   const [activeTab, setActiveTab] = useState(0);
//   const [showPreview, setShowPreview] = useState(false);
//   const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
//   // Initialize form with subcategory data
//   useEffect(() => {
//     if (subcategoryData) {
//       const defaultName = `${subcategoryData.subCategoryName}Schema`;
//       setSchemaName(defaultName);
//       setSchemaDisplayName(subcategoryData.subCategoryDisplayName || '');
//     }
//   }, [subcategoryData]);
  
//   // Handle form field updates
//   const handleFieldsChange = (updatedFields) => {
//     setFormFields(updatedFields);
    
//     // Update elastic fields based on searchable fields
//     const searchableFields = updatedFields
//       .filter(field => field.isSearchable)
//       .map(field => field.name);
    
//     setElasticFields(['name', ...searchableFields]);
//   };
  
//   // Handle schema export
//   const handleSchemaExport = (schema, format) => {
//     setGeneratedSchema(schema);
//     setSchemaFormat(format);
//   };
  
//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!schemaName.trim()) {
//       showNotification('لطفاً نام اسکیما را وارد کنید', 'error');
//       return;
//     }
    
//     if (formFields.length === 0) {
//       showNotification('لطفاً حداقل یک فیلد به فرم اضافه کنید', 'error');
//       return;
//     }
    
//     try {
//       // Prepare the schema data
//       const schemaData = {
//         name: schemaName,
//         displayName: schemaDisplayName,
//         elasticFields: elasticFields,
//         schemaDefinition: JSON.parse(generatedSchema),
//         subcategoryId: parseInt(id)
//       };
      
//       // Create or update the schema
//       const result = undefined//await createServiceSchema(schemaData).unwrap();
      
//       if (result) {
//         showNotification('اسکیمای سرویس با موفقیت ذخیره شد', 'success');
//         setTimeout(() => {
//           navigate('/banks/service/subcategory');
//         }, 2000);
//       }
//     } catch (error) {
//       console.error('Error saving schema:', error);
//       showNotification('خطا در ذخیره اسکیمای سرویس', 'error');
//     }
//   };
  
//   // Handle tab change
//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };
  
//   // Toggle preview
//   const handleTogglePreview = () => {
//     setShowPreview(!showPreview);
//   };
  
//   // Show notification
//   const showNotification = (message, severity = 'success') => {
//     setNotification({
//       open: true,
//       message,
//       severity
//     });
//   };
  
//   // Close notification
//   const handleCloseNotification = () => {
//     setNotification({ ...notification, open: false });
//   };
  
//   if (isLoadingSubcategory) {
//     return <FuseLoading />;
//   }
  
//   return (
//     <div className="p-6 md:p-12">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//         <div className="flex items-center">
//           <IconButton 
//             edge="start" 
//             onClick={() => navigate('/banks/service/subcategory')}
//             sx={{ mr: 2 }}
//           >
//             <ArrowBackIcon />
//           </IconButton>
//           <div>
//             <Typography variant="h4" className="font-bold">
//               تنظیم اسکیمای سرویس
//             </Typography>
//             <Typography variant="subtitle1" color="textSecondary">
//               {subcategoryData?.subCategoryDisplayName}
//             </Typography>
//           </div>
//         </div>
        
//         <div className="mt-4 md:mt-0">
//           <Button
//             variant="contained"
//             color="secondary"
//             startIcon={<SaveIcon />}
//             onClick={handleSubmit}
//             // disabled={isCreating || isUpdating}
//             className="ml-2"
//           >
//             ذخیره اسکیما
//           </Button>
//           <Button
//             variant="outlined"
//             startIcon={<PreviewIcon />}
//             onClick={handleTogglePreview}
//             className="ml-2"
//           >
//             {showPreview ? 'بازگشت به ویرایشگر' : 'پیش‌نمایش فرم'}
//           </Button>
//         </div>
//       </div>

//       {/* Main content */}
//       {!showPreview ? (
//         <Grid container spacing={4}>
//           {/* Schema settings */}
//           <Grid item xs={12}>
//             <Paper className="p-6">
//               <Typography variant="h6" className="mb-4">
//                 تنظیمات اسکیما
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={4}>
//                   <TextField
//                     fullWidth
//                     label="نام اسکیما (به انگلیسی)"
//                     value={schemaName}
//                     onChange={(e) => setSchemaName(e.target.value)}
//                     variant="outlined"
//                     required
//                     helperText="نام تکنیکی اسکیما برای استفاده در کد (بدون فاصله)"
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <TextField
//                     fullWidth
//                     label="عنوان نمایشی اسکیما"
//                     value={schemaDisplayName}
//                     onChange={(e) => setSchemaDisplayName(e.target.value)}
//                     variant="outlined"
//                     helperText="عنوان اسکیما برای نمایش به کاربر"
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel>فرمت اسکیما</InputLabel>
//                     <Select
//                       value={schemaFormat}
//                       onChange={(e) => setSchemaFormat(e.target.value)}
//                       label="فرمت اسکیما"
//                     >
//                       <MenuItem value="json">JSON Schema</MenuItem>
//                       <MenuItem value="zod">Zod Schema</MenuItem>
//                       <MenuItem value="uniforms">Uniforms Zod</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Grid>
          
//           {/* Elastic search fields */}
//           <Grid item xs={12}>
//             <Card>
//               <CardHeader
//                 title="فیلدهای قابل جستجو (ElasticSearch)"
//                 subheader="این فیلدها برای جستجو و فیلتر کردن در ElasticSearch استفاده می‌شوند"
//               />
//               <CardContent>
//                 <div className="flex flex-wrap gap-2">
//                   {elasticFields.map(field => (
//                     <Chip 
//                       key={field} 
//                       label={field} 
//                       onDelete={field !== 'name' ? () => {
//                         setElasticFields(elasticFields.filter(f => f !== field));
//                       } : undefined}
//                       color={field === 'name' ? "primary" : "default"}
//                     />
//                   ))}
//                   {elasticFields.length === 0 && (
//                     <Typography variant="body2" color="textSecondary">
//                       هیچ فیلدی برای جستجو انتخاب نشده است. فیلدهای "قابل جستجو" به صورت خودکار اضافه می‌شوند.
//                     </Typography>
//                   )}
//                 </div>
//                 <Typography variant="caption" color="textSecondary" className="mt-2 block">
//                   نکته: فیلد "name" به صورت پیش‌فرض اضافه شده و قابل حذف نیست.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
          
//           {/* Form builder */}
//           <Grid item xs={12}>
//             <Paper className="p-6">
//               <EnhancedFormBuilder
//                 initialFields={formFields}
//                 onChange={handleFieldsChange}
//                 onSchemaExport={handleSchemaExport}
//                 onPreview={handleTogglePreview}
//               />
//             </Paper>
//           </Grid>
//         </Grid>
//       ) : (
//         // Preview mode
//         <Paper className="p-6">
//           <Typography variant="h6" className="mb-4">
//             پیش‌نمایش فرم سرویس
//           </Typography>
          
//           <EnhancedDynamicFormGenerator
//             schema={JSON.parse(generatedSchema)}
//             initialData={{}}
//             formHeaderTitle={schemaDisplayName || schemaName}
//             formValidationStruct="JSON_SCHEMA"
//             formGenerationType="AUTO"
//             onSubmit={(data) => {
//               console.log('Form submitted:', data);
//               showNotification('فرم با موفقیت ارسال شد (نسخه پیش‌نمایش)', 'success');
//             }}
//           />
//         </Paper>
//       )}
      
//       {/* Notifications */}
//       <Snackbar
//         open={notification.open}
//         autoHideDuration={6000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseNotification} severity={notification.severity}>
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }

// export default ServiceSchemaCreator;


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  Grid, 
  Box, 
  Chip,
  Snackbar,
  Alert,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import EnhancedFormBuilder from '../../../../shared-components/form-builder/EnhancedFormBuilder';
import FormPreview from '../../../../shared-components/form-builder/FormPreview';
import { 
  useGetSubCategoryQuery,
} from '../../../category/sub-category/SubCategoriesApi';
import { motion } from 'framer-motion';

function ServiceSchemaCreator() {
  const { id } = useParams(); // Subcategory ID
  const navigate = useNavigate();
  
  // Fetch subcategory details
  const { data: subcategoryData, isLoading: isLoadingSubcategory } = useGetSubCategoryQuery(id);
  // const { data: existingSchema, isLoading: isLoadingSchema } = useGetServiceSchemaByIdQuery(
  //   subcategoryData?.serviceSchemaId, 
  //   { skip: !subcategoryData?.serviceSchemaId }
  // );
  const existingSchema = null; // or undefined

  // Mutations for creating/updating schema
  // const [createServiceSchema, { isLoading: isCreating }] = useCreateServiceSchemaMutation();
  // const [updateServiceSchema, { isLoading: isUpdating }] = useUpdateServiceSchemaMutation();
  const isLoading = false
  const isLoadingSchema = false
  const isCreating = false
  const isUpdating = false;
  // Form state
  const [formFields, setFormFields] = useState([]);
  const [schemaName, setSchemaName] = useState('');
  const [schemaDisplayName, setSchemaDisplayName] = useState('');
  const [elasticFields, setElasticFields] = useState(['name']);
  const [schemaFormat, setSchemaFormat] = useState('json');
  const [generatedSchema, setGeneratedSchema] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Initialize form with subcategory data
  useEffect(() => {
    if (subcategoryData) {
      const defaultName = `${subcategoryData.nameEn} Schema`;
      setSchemaName(defaultName);
      setSchemaDisplayName("اسکیمای خدمت " + subcategoryData.name || '');
    }
  }, [subcategoryData]);
  
  // Load existing schema data if available
  useEffect(() => {
    if (!existingSchema) return;   // bail out early

      try {
        setSchemaName(existingSchema.name);
        setSchemaDisplayName(existingSchema.displayName);
        
        if (existingSchema.elasticFields && Array.isArray(existingSchema.elasticFields)) {
          setElasticFields(existingSchema.elasticFields);
        }
        
        // Parse schema definition and convert to form fields
        if (existingSchema.schemaDefinition) {
          const schemaObj = typeof existingSchema.schemaDefinition === 'string' 
            ? JSON.parse(existingSchema.schemaDefinition)
            : existingSchema.schemaDefinition;
            
          // Convert JSON schema to field definitions
          const fields = convertSchemaToFields(schemaObj);
          setFormFields(fields);
        }
      } catch (error) {
        console.error('Error parsing existing schema:', error);
        showNotification('خطا در بارگذاری اسکیمای موجود', 'error');
      }
  }, [existingSchema]);
  
  // Handle form field updates
  const handleFieldsChange = (updatedFields) => {
    setFormFields(updatedFields);
    
    // Update elastic fields based on searchable fields
    const searchableFields = updatedFields
      .filter(field => field.isSearchable)
      .map(field => field.name);
    
    setElasticFields(prevFields => {
      // Always include 'name' field
      const newFields = ['name', ...searchableFields];
      // Remove duplicates
      return [...new Set(newFields)];
    });
  };
  
  // Handle schema export
  const handleSchemaExport = (schema, format) => {
    setGeneratedSchema(schema);
    setSchemaFormat(format);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!schemaName || !schemaName.trim()) {
      showNotification('لطفاً نام اسکیما را وارد کنید', 'error');
      return;
    }
    
    if (formFields.length === 0) {
      showNotification('لطفاً حداقل یک فیلد به فرم اضافه کنید', 'error');
      return;
    }
    
    try {
      // Parse the schema from string to object
      const schemaObject = schemaFormat === 'json' 
        ? JSON.parse(generatedSchema)
        : generatedSchema; // Fallback for Zod schema
      
      // Prepare the schema data
      const schemaData = {
        name: schemaName,
        displayName: schemaDisplayName,
        elasticFields: elasticFields,
        schemaDefinition: schemaObject,
        subcategoryId: parseInt(id)
      };
      
      let result;
      
      if (existingSchema?.id) {
        // Update existing schema
        result = undefined//await updateServiceSchema({ 
        //   id: existingSchema.id, 
        //   schemaData 
        // }).unwrap();
        
        showNotification('اسکیمای سرویس با موفقیت بروزرسانی شد', 'success');
      } else {
        // Create new schema
        console.log(JSON.stringify(schemaData))
        result = undefined //await createServiceSchema(schemaData).unwrap();
        showNotification('اسکیمای سرویس با موفقیت ذخیره شد', 'success');
      }
      
      // Navigate back after successful save
      setTimeout(() => {
        navigate('/banks/service/subcategory');
      }, 2000);
    } catch (error) {
      console.error('Error saving schema:', error);
      showNotification('خطا در ذخیره اسکیمای سرویس', 'error');
    }
  };
  
  // Toggle preview
  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Show notification
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Convert JSON schema to field definitions
  const convertSchemaToFields = (schema) => {
    if (!schema || !schema.properties) return [];
    
    const fields = [];
    const required = schema.required || [];
    
    Object.entries(schema.properties).forEach(([name, prop]) => {
      const field = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        name,
        label: prop.title || name,
        description: prop.description || '',
        required: required.includes(name),
        type: getFieldType(prop),
        placeholder: prop.uniforms?.placeholder || '',
        defaultValue: prop.default || '',
        isSearchable: !!prop.uniforms?.isSearchable,
        showInList: !!prop.uniforms?.showInList,
        clientDisplay: prop.uniforms?.clientDisplay || ['ADMIN_PANEL', 'USER_PANEL']
      };
      
      // Add validation
      if (prop.type === 'string') {
        field.minLength = prop.minLength || '';
        field.maxLength = prop.maxLength || '';
        field.pattern = prop.pattern || '';
      } else if (prop.type === 'number') {
        field.min = prop.minimum !== undefined ? prop.minimum : '';
        field.max = prop.maximum !== undefined ? prop.maximum : '';
        field.step = prop.multipleOf || '';
      }
      
      // Add options for select/radio/multiselect
      if (prop.enum) {
        field.options = prop.enum;
      } else if (prop.type === 'array' && prop.items && prop.items.enum) {
        field.options = prop.items.enum;
      }
      
      fields.push(field);
    });
    
    return fields;
  };
  
  // Determine field type from JSON schema
  const getFieldType = (prop) => {
    if (prop.type === 'string') {
      if (prop.format === 'email') return 'email';
      if (prop.format === 'uri') return 'url';
      if (prop.format === 'date') return 'date';
      if (prop.format === 'time') return 'time';
      if (prop.format === 'date-time') return 'datetime-local';
      if (prop.uniforms?.component === 'LongTextField') return 'textarea';
      if (prop.enum) return prop.uniforms?.checkboxes ? 'radio' : 'select';
      return 'text';
    }
    
    if (prop.type === 'number') return 'number';
    if (prop.type === 'boolean') return 'checkbox';
    
    if (prop.type === 'array') {
      if (prop.items && prop.items.enum) return 'multiselect';
      return 'array';
    }
    
    if (prop.type === 'object') return 'object';
    
    return 'text';
  };
  
  if (isLoadingSubcategory || isLoadingSchema) {
    return <FuseLoading />;
  }
  
  return (
    <div className="p-6 md:p-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
      >
        <div className="flex items-center">
          <IconButton 
            edge="start" 
            onClick={() => navigate('/banks/service/subcategory')}
            className="ml-2"
          >
            <ArrowBackIcon />
          </IconButton>
          <div>
            <Typography variant="h4" className="font-bold">
              تنظیم اسکیمای خدمت
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {subcategoryData?.name}
            </Typography>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
            className="ml-2"
          >
            {existingSchema?.id ? 'بروزرسانی اسکیما' : 'ذخیره اسکیما'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handleTogglePreview}
          >
            {showPreview ? 'بازگشت به ویرایشگر' : 'پیش‌نمایش فرم'}
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      {!showPreview ? (
        <Grid container spacing={4}>
          {/* Schema settings */}
          <Grid item xs={12}>
            <Paper className="p-6" elevation={2}>
              <Typography variant="h6" className="mb-4">
                تنظیمات اسکیما
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="نام اسکیما (به انگلیسی)"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                    variant="outlined"
                    required
                    helperText="نام تکنیکی اسکیما برای استفاده در کد (بدون فاصله)"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="عنوان نمایشی اسکیما"
                    value={schemaDisplayName}
                    onChange={(e) => setSchemaDisplayName(e.target.value)}
                    variant="outlined"
                    helperText="عنوان اسکیما برای نمایش به کاربر"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>فرمت اسکیما</InputLabel>
                    <Select
                      value={schemaFormat}
                      onChange={(e) => setSchemaFormat(e.target.value)}
                      label="فرمت اسکیما"
                    >
                      <MenuItem value="json">JSON Schema</MenuItem>
                      <MenuItem value="zod">Zod Schema</MenuItem>
                      <MenuItem value="uniforms">Uniforms Zod</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Elastic search fields */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="فیلدهای قابل جستجو (ElasticSearch)"
                subheader="این فیلدها برای جستجو و فیلتر کردن در ElasticSearch استفاده می‌شوند"
              />
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {elasticFields.map(field => (
                    <Chip 
                      key={field} 
                      label={field} 
                      onDelete={field !== 'name' ? () => {
                        setElasticFields(elasticFields.filter(f => f !== field));
                      } : undefined}
                      color={field === 'name' ? "primary" : "default"}
                    />
                  ))}
                  {elasticFields.length <= 1 && (
                    <Typography variant="body2" color="textSecondary">
                      هیچ فیلدی برای جستجو انتخاب نشده است. فیلدهای "قابل جستجو" به صورت خودکار اضافه می‌شوند.
                    </Typography>
                  )}
                </div>
                <Typography variant="caption" color="textSecondary" className="mt-2 block">
                  نکته: فیلد "name" به صورت پیش‌فرض اضافه شده و قابل حذف نیست.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Form builder */}
          <Grid item xs={12}>
            <Paper className="p-6">
              <EnhancedFormBuilder
                initialFields={formFields}
                onChange={handleFieldsChange}
                onSchemaExport={handleSchemaExport}
                onPreview={handleTogglePreview}
              />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        // Preview mode
        <Paper className="p-6">
          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
            <Tab label="پیش‌نمایش فرم" />
            <Tab label="اسکیمای تولید شده" />
          </Tabs>
          
          {activeTab === 0 ? (
            <FormPreview 
              fields={formFields} 
              formTitle={schemaDisplayName || schemaName} 
              formDescription={`این فرم برای زیرشاخه ${subcategoryData?.name} طراحی شده است.`}
            />
          ) : (
            <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>فرمت اسکیما</InputLabel>
                <Select
                  value={schemaFormat}
                  onChange={(e) => setSchemaFormat(e.target.value)}
                  label="فرمت اسکیما"
                >
                  <MenuItem value="json">JSON Schema</MenuItem>
                  <MenuItem value="zod">Zod Schema</MenuItem>
                  <MenuItem value="uniforms">Uniforms Zod</MenuItem>
                </Select>
              </FormControl>
              
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  bgcolor: '#fff',
                  maxHeight: '60vh',
                  overflow: 'auto',
                  direction: 'ltr',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}
              >
                <pre dir='ltr'>{generatedSchema}</pre>
              </Paper>
              
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedSchema);
                    showNotification('اسکیما در کلیپ‌بورد کپی شد', 'success');
                  }}
                >
                  کپی اسکیما
                </Button>
              </Box>
            </Box>
          )}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleTogglePreview}
            >
              بازگشت به ویرایشگر
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              disabled={isCreating || isUpdating}
            >
              {existingSchema?.id ? 'بروزرسانی اسکیما' : 'ذخیره اسکیما'}
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Notifications */}
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

export default ServiceSchemaCreator;