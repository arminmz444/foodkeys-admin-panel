// // src/app/shared-components/form-builder/FormPreview.jsx
// import { useState, useEffect } from 'react';
// import { 
//   Paper, 
//   Typography, 
//   Box, 
//   Button, 
//   TextField, 
//   FormControl, 
//   InputLabel, 
//   Select, 
//   MenuItem, 
//   FormControlLabel, 
//   Checkbox, 
//   FormHelperText,
//   Radio,
//   RadioGroup,
//   FormLabel,
//   Divider,
//   Grid,
//   CircularProgress,
//   Collapse,
//   Fade
// } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { motion } from 'framer-motion';
// import { z } from 'zod';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';

// function FormPreview({ 
//   fields = [], 
//   formTitle = 'فرم پیش‌نمایش', 
//   formDescription = '',
//   schema,
//   schemaFormat
// }) {
//   const [submittedData, setSubmittedData] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [zodSchema, setZodSchema] = useState(null);
  
//   // Create Zod schema dynamically from fields
//   useEffect(() => {
//     if (!fields.length) return;
    
//     try {
//       const schemaObj = buildZodSchema(fields);
//       setZodSchema(schemaObj);
//     } catch (error) {
//       console.error('Error creating Zod schema:', error);
//     }
//   }, [fields]);
  
//   // Create react-hook-form with Zod validation
//   const { 
//     control, 
//     handleSubmit, 
//     formState: { errors },
//     reset
//   } = useForm({
//     resolver: zodSchema ? zodResolver(zodSchema) : undefined,
//     mode: 'onBlur'
//   });
  
//   // Submit handler
//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
    
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     setSubmittedData(data);
//     setIsSubmitting(false);
//     setShowSuccess(true);
    
//     // Hide success message after 3 seconds
//     setTimeout(() => {
//       setShowSuccess(false);
//     }, 3000);
//   };
  
//   // Reset form
//   const handleReset = () => {
//     reset();
//     setSubmittedData(null);
//   };
  
//   // Build Zod schema from fields
//   const buildZodSchema = (fields) => {
//     const shape = {};
    
//     fields.forEach(field => {
//       let fieldSchema;
      
//       switch (field.type) {
//         case 'text':
//         case 'password':
//         case 'textarea':
//         case 'email':
//         case 'url':
//         case 'tel':
//           fieldSchema = z.string({
//             invalid_type_error: 'فرمت داده ورودی اشتباه است',
//             required_error: field.required ? 'این فیلد الزامی است' : undefined
//           });
          
//           if (field.required) {
//             fieldSchema = fieldSchema.min(1, { message: 'این فیلد الزامی است' });
//           }
          
//           if (field.minLength) {
//             fieldSchema = fieldSchema.min(Number(field.minLength), { 
//               message: `حداقل ${field.minLength} کاراکتر وارد کنید` 
//             });
//           }
          
//           if (field.maxLength) {
//             fieldSchema = fieldSchema.max(Number(field.maxLength), { 
//               message: `حداکثر ${field.maxLength} کاراکتر مجاز است` 
//             });
//           }
          
//           if (field.type === 'email') {
//             fieldSchema = fieldSchema.email({ message: 'ایمیل معتبر وارد کنید' });
//           }
          
//           if (field.type === 'url') {
//             fieldSchema = fieldSchema.url({ message: 'آدرس اینترنتی معتبر وارد کنید' });
//           }
          
//           if (field.pattern) {
//             fieldSchema = fieldSchema.regex(new RegExp(field.pattern), { 
//               message: 'فرمت وارد شده صحیح نیست' 
//             });
//           }
//           break;
          
//         case 'number':
//         case 'range':
//           fieldSchema = z.number({
//             invalid_type_error: 'فرمت داده ورودی اشتباه است',
//             required_error: field.required ? 'این فیلد الزامی است' : undefined
//           });
          
//           if (field.min !== undefined && field.min !== '') {
//             fieldSchema = fieldSchema.min(Number(field.min), { 
//               message: `حداقل مقدار ${field.min} است` 
//             });
//           }
          
//           if (field.max !== undefined && field.max !== '') {
//             fieldSchema = fieldSchema.max(Number(field.max), { 
//               message: `حداکثر مقدار ${field.max} است` 
//             });
//           }
//           break;
          
//         case 'checkbox':
//           fieldSchema = z.boolean();
//           break;
          
//         case 'select':
//         case 'radio':
//           if (field.options && field.options.length > 0) {
//             fieldSchema = z.enum(field.options, {
//               required_error: field.required ? 'این فیلد الزامی است' : undefined,
//               invalid_type_error: 'فرمت داده ورودی اشتباه است',
//               message: 'مقدار انتخاب شده معتبر نیست'
//             });
//           } else {
//             fieldSchema = z.string();
//           }
//           break;
          
//         case 'multiselect':
//           if (field.options && field.options.length > 0) {
//             fieldSchema = z.array(z.string()).min(
//               field.required ? 1 : 0, 
//               field.required ? { message: 'حداقل یک گزینه انتخاب کنید' } : undefined
//             );
//           } else {
//             fieldSchema = z.array(z.string());
//           }
//           break;
          
//         case 'date':
//         case 'datetime-local':
//         case 'time':
//           fieldSchema = z.string();
//           if (field.required) {
//             fieldSchema = fieldSchema.min(1, { message: 'این فیلد الزامی است' });
//           }
//           break;
          
//         default:
//           fieldSchema = z.string();
//       }
      
//       // Add uniforms metadata
//       fieldSchema = fieldSchema.uniforms({
//         displayName: field.label,
//         label: field.label,
//         placeholder: field.placeholder,
//         description: field.description
//       });
      
//       // Make optional if not required
//       if (!field.required && field.type !== 'checkbox') {
//         fieldSchema = fieldSchema.optional();
//       }
      
//       shape[field.name] = fieldSchema;
//     });
    
//     return z.object(shape);
//   };
  
//   // Render field based on type
//   const renderField = (field) => {
//     const fieldProps = {
//       fullWidth: true,
//       margin: "normal",
//       label: field.label,
//       placeholder: field.placeholder,
//       helperText: errors[field.name]?.message || field.description,
//       error: !!errors[field.name],
//       disabled: isSubmitting
//     };
    
//     switch (field.type) {
//       case 'text':
//       case 'password':
//       case 'email':
//       case 'url':
//       case 'tel':
//         return (
//           <Controller
//             key={field.id}
//             name={field.name}
//             control={control}
//             defaultValue=""
//             render={({ field: { onChange, onBlur, value, ref } }) => (
//               <TextField
//                 {...fieldProps}
//                 type={field.type}
//                 onChange={onChange}
//                 onBlur={onBlur}
//                 value={value}
//                 inputRef={ref}
//               />
//             )}
//           />
//         );
        
//       case 'textarea':
//         return (
//           <Controller
//             key={field.id}
//             name={field.name}
//             control={control}
//             defaultValue=""
//             render={({ field: { onChange, onBlur, value, ref } }) => (
//               <TextField
//                 {...fieldProps}
//                 multiline
//                 rows={4}
//                 onChange={onChange}
//                 onBlur={onBlur}
//                 value={value}
//                 inputRef={ref}
//               />
//             )}
//           />
//         );
        
//       case 'number':
//       case 'range':
//         return (
//           <Controller
//             key={field.id}
//             name={field.name}
//             control={control}
//             defaultValue=""
//             render={({ field: { onChange, onBlur, value, ref } }) => (
//               <TextField
//                 {...fieldProps}
//                 type="number"
//                 onChange={(e) => {
//                   const val = e.target.value === '' ? '' : Number(e.target.value);
//                   onChange(val);
//                 }}
//                 onBlur={onBlur}
//                 value={value}
//                 inputRef={ref}
//                 InputProps={{
//                   inputProps: {
//                     min: field.min,
//                     max: field.max,
//                     step: field.step
//                   }
//                 }}
//               />
//             )}
//           />
//         );
        
//       case 'select':
//         return (
//           <Controller
//             key={field.id}
//             name={field.name}
//             control={control}
//             defaultValue=""
//             render={({ field: { onChange, onBlur, value, ref } }) => (
//               <FormControl 
//                 fullWidth 
//                 margin="normal" 
//                 error={!!errors[field.name]}
//                 disabled={isSubmitting}
//               >
//                 <InputLabel>{field.label}</InputLabel>
//                 <Select
//                   onChange={onChange}
//                   onBlur={onBlur}
//                   value={value}
//                   inputRef={ref}
//                   label={field.label}
//                 >
//                   {field.options.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {(errors[field.name]?.message || field.description) && (
//                   <FormHelperText>
//                     {errors[field.name]?.message || field.description}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//             )}
//           />
//         );
        
//       case 'multiselect':
//         return (
//           <Controller
//             key={field.id}
//             name={field.name}
//             control={control}
//             defaultValue={[]}
//             render={({ field: { onChange, onBlur, value = [], ref } }) => (
//               <FormControl 
//                 fullWidth 
//                 margin="normal" 
//                 error={!!errors[field.name]}
//                 disabled={isSubmitting}
//               >
//                 <InputLabel>{field.label}</InputLabel>
//                 <Select
//                   multiple
//                   onChange={onChange}
//                   onBlur={onBlur}
//                   value={value}
//                   inputRef={ref}
//                   label={field.label}
//                 >
//                   {field.options.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {(errors[field.name]?.message || field.description) && (
//                   <FormHelperText>
//                     {errors[field.name]?.message || field.description}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//             )}
//           />
//         );
        
//       case 'checkbox':
//         return (
//           <Controller
//             key={field.id}
//             name={field.name}
//             control={control}
//             defaultValue={false}
//             render={({ field: { onChange, onBlur, value, ref } }) => (
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={!!value}
//                     onChange={onChange}
//                     onBlur={onBlur}
//                     inputRef={ref}
//                     disabled={isSubmitting}
//                   />
//                 }
//                 label={field.label}
//               />
//             )}
//           />
//         );
        
//       case 'radio':
//         return (
//           <Controller
//             key={field.id}
//             name={field.name}
//             control={control}
//             defaultValue=""
//             render={({ field: { onChange, onBlur, value, ref } }) => (
//               <FormControl 
//                 component="fieldset" 
//                 margin="normal"
//                 error={!!errors[field.name]}
//                 disabled={isSubmitting}
//               >
//                 <FormLabel component="legend">{field.label}</FormLabel>
//                 <RadioGroup
//                   onChange={onChange}
//                   onBlur={onBlur}
//                   value={value}
//                   ref={ref}
//                 >
//                   {field.options.map((option) => (
//                     <FormControlLabel
//                       key={option}
//                       value={option}
//                       control={<Radio />}
//                       label={option}
//                     />
//                   ))}
//                 </RadioGroup>
//                 {(errors[field.name]?.message || field.description) && (
//                   <FormHelperText>
//                     {errors[field.name]?.message || field.description}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//             )}
//           />
//         );
        
//       case 'date':
//       case 'datetime-local':
//       case 'time':
//         return (
//           <Controller
//             key={field.id}
//             name={field.name}
//             control={control}
//             defaultValue=""
//             render={({ field: { onChange, onBlur, value, ref } }) => (
//               <TextField
//                 {...fieldProps}
//                 type={field.type}
//                 onChange={onChange}
//                 onBlur={onBlur}
//                 value={value}
//                 inputRef={ref}
//                 InputLabelProps={{ shrink: true }}
//               />
//             )}
//           />
//         );
        
//       default:
//         return null;
//     }
//   };
  
//   return (
//     <Paper 
//       className="p-6 relative" 
//       elevation={3} 
//       sx={{ 
//         maxWidth: '800px', 
//         margin: '0 auto', 
//         backgroundColor: '#fafafa',
//         position: 'relative' 
//       }}
//     >
//       {/* Success animation */}
//       <Fade in={showSuccess}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: 'rgba(255, 255, 255, 0.8)',
//             zIndex: 10,
//             backdropFilter: 'blur(2px)'
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.5, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.5, type: 'spring' }}
//           >
//             <CheckCircleIcon 
//               color="success" 
//               sx={{ fontSize: 80, mb: 2 }} 
//             />
//           </motion.div>
//           <Typography variant="h5" color="success.main" gutterBottom>
//             فرم با موفقیت ارسال شد
//           </Typography>
//         </Box>
//       </Fade>
      
//       <Typography variant="h5" gutterBottom>
//         {formTitle}
//       </Typography>
      
//       {formDescription && (
//         <Typography 
//           variant="body2" 
//           color="textSecondary" 
//           paragraph
//           sx={{ mb: 3 }}
//         >
//           {formDescription}
//         </Typography>
//       )}
      
//       <Divider sx={{ mb: 3 }} />
      
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={2}>
//           {fields.map(field => (
//             <Grid item xs={12} key={field.id}>
//               {renderField(field)}
//             </Grid>
//           ))}
//         </Grid>
        
//         <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
//           <Button
//             variant="outlined"
//             onClick={handleReset}
//             disabled={isSubmitting}
//           >
//             پاک کردن فرم
//           </Button>
          
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={isSubmitting}
//             startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
//           >
//             {isSubmitting ? 'در حال ارسال...' : 'ارسال فرم'}
//           </Button>
//         </Box>
//       </form>
      
//       {/* Show submitted data */}
//       <Collapse in={!!submittedData && !showSuccess}>
//         <Paper 
//           elevation={2} 
//           sx={{ mt: 4, p: 2, backgroundColor: '#f0f8ff' }}
//         >
//           <Typography variant="subtitle1" gutterBottom>
//             داده‌های ارسال شده:
//           </Typography>
//           <pre
//             style={{
//               direction: 'ltr',
//               textAlign: 'left',
//               overflow: 'auto',
//               maxHeight: '300px',
//               padding: '12px',
//               backgroundColor: '#f5f5f5',
//               borderRadius: '4px',
//               fontSize: '0.875rem'
//             }}
//           >
//             {JSON.stringify(submittedData, null, 2)}
//           </pre>
//         </Paper>
//       </Collapse>
//     </Paper>
//   );
// }

// export default FormPreview;

// src/app/shared-components/form-builder/FormPreview.jsx
import { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox, 
  FormHelperText,
  Radio,
  RadioGroup,
  FormLabel,
  Divider,
  Grid,
  CircularProgress,
  Collapse,
  Fade
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';

function FormPreview({ 
  fields = [], 
  formTitle = 'فرم پیش‌نمایش', 
  formDescription = ''
}) {
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Create react-hook-form without Zod
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm({
    mode: 'onBlur'
  });
  
  // Submit handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmittedData(data);
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  // Reset form
  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };
  
  // Create validation rules from field configuration
  const getValidationRules = (field) => {
    const rules = {};
    
    if (field.required) {
      rules.required = "این فیلد الزامی است";
    }
    
    if (field.type === 'email') {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "ایمیل معتبر وارد کنید"
      };
    }
    
    if (field.minLength && ['text', 'password', 'textarea', 'email', 'url', 'tel'].includes(field.type)) {
      rules.minLength = {
        value: Number(field.minLength),
        message: `حداقل ${field.minLength} کاراکتر وارد کنید`
      };
    }
    
    if (field.maxLength && ['text', 'password', 'textarea', 'email', 'url', 'tel'].includes(field.type)) {
      rules.maxLength = {
        value: Number(field.maxLength),
        message: `حداکثر ${field.maxLength} کاراکتر مجاز است`
      };
    }
    
    if (field.min && ['number', 'range'].includes(field.type)) {
      rules.min = {
        value: Number(field.min),
        message: `حداقل مقدار ${field.min} است`
      };
    }
    
    if (field.max && ['number', 'range'].includes(field.type)) {
      rules.max = {
        value: Number(field.max),
        message: `حداکثر مقدار ${field.max} است`
      };
    }
    
    if (field.pattern) {
      try {
        rules.pattern = {
          value: new RegExp(field.pattern),
          message: "فرمت وارد شده صحیح نیست"
        };
      } catch (error) {
        console.error('Invalid regex pattern:', error);
      }
    }
    
    return rules;
  };
  
  // Render field based on type
  const renderField = (field) => {
    const fieldProps = {
      fullWidth: true,
      margin: "normal",
      label: field.label || field.name,
      placeholder: field.placeholder || '',
      helperText: errors[field.name]?.message || field.description || '',
      error: !!errors[field.name],
      disabled: isSubmitting
    };
    
    const validationRules = getValidationRules(field);
    
    switch (field.type) {
      case 'text':
      case 'password':
      case 'email':
      case 'url':
      case 'tel':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={validationRules}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                {...fieldProps}
                type={field.type}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                inputRef={ref}
              />
            )}
          />
        );
        
      case 'textarea':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={validationRules}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                {...fieldProps}
                multiline
                rows={4}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                inputRef={ref}
              />
            )}
          />
        );
        
      case 'number':
      case 'range':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={validationRules}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                {...fieldProps}
                type="number"
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  onChange(val);
                }}
                onBlur={onBlur}
                value={value}
                inputRef={ref}
                InputProps={{
                  inputProps: {
                    min: field.min,
                    max: field.max,
                    step: field.step || 1
                  }
                }}
              />
            )}
          />
        );
        
      case 'select':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={validationRules}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <FormControl 
                fullWidth 
                margin="normal" 
                error={!!errors[field.name]}
                disabled={isSubmitting}
              >
                <InputLabel>{field.label || field.name}</InputLabel>
                <Select
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  inputRef={ref}
                  label={field.label || field.name}
                >
                  {(field.options || []).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {(errors[field.name]?.message || field.description) && (
                  <FormHelperText error={!!errors[field.name]}>
                    {errors[field.name]?.message || field.description}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        );
        
      case 'multiselect':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || []}
            rules={validationRules}
            render={({ field: { onChange, onBlur, value = [], ref } }) => (
              <FormControl 
                fullWidth 
                margin="normal" 
                error={!!errors[field.name]}
                disabled={isSubmitting}
              >
                <InputLabel>{field.label || field.name}</InputLabel>
                <Select
                  multiple
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  inputRef={ref}
                  label={field.label || field.name}
                >
                  {(field.options || []).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {(errors[field.name]?.message || field.description) && (
                  <FormHelperText error={!!errors[field.name]}>
                    {errors[field.name]?.message || field.description}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        );
        
      case 'checkbox':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || false}
            rules={validationRules}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <FormControl 
                fullWidth 
                margin="normal" 
                error={!!errors[field.name]}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!value}
                      onChange={onChange}
                      onBlur={onBlur}
                      inputRef={ref}
                      disabled={isSubmitting}
                    />
                  }
                  label={field.label || field.name}
                />
                {errors[field.name]?.message && (
                  <FormHelperText error>
                    {errors[field.name].message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        );
        
      case 'radio':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={validationRules}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <FormControl 
                component="fieldset" 
                margin="normal"
                error={!!errors[field.name]}
                disabled={isSubmitting}
                fullWidth
              >
                <FormLabel component="legend">{field.label || field.name}</FormLabel>
                <RadioGroup
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                >
                  {(field.options || []).map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
                {(errors[field.name]?.message || field.description) && (
                  <FormHelperText error={!!errors[field.name]}>
                    {errors[field.name]?.message || field.description}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        );
        
      case 'date':
      case 'datetime-local':
      case 'time':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={validationRules}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                {...fieldProps}
                type={field.type}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                inputRef={ref}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Paper 
      className="p-6 relative" 
      elevation={3} 
      sx={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        backgroundColor: '#fafafa',
        position: 'relative' 
      }}
    >
      {/* Success animation */}
      <Fade in={showSuccess}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10,
            backdropFilter: 'blur(2px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <CheckCircleIcon 
              color="success" 
              sx={{ fontSize: 80, mb: 2 }} 
            />
          </motion.div>
          <Typography variant="h5" color="success.main" gutterBottom>
            فرم با موفقیت ارسال شد
          </Typography>
        </Box>
      </Fade>
      
      <Typography variant="h5" gutterBottom>
        {formTitle}
      </Typography>
      
      {formDescription && (
        <Typography 
          variant="body2" 
          color="textSecondary" 
          paragraph
          sx={{ mb: 3 }}
        >
          {formDescription}
        </Typography>
      )}
      
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {fields.map(field => (
            <Grid item xs={12} key={field.id}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            پاک کردن فرم
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'در حال ارسال...' : 'ارسال فرم'}
          </Button>
        </Box>
      </form>
      
      {/* Show submitted data */}
      <Collapse in={!!submittedData && !showSuccess}>
        <Paper 
          elevation={2} 
          sx={{ mt: 4, p: 2, backgroundColor: '#f0f8ff' }}
        >
          <Typography variant="subtitle1" gutterBottom>
            داده‌های ارسال شده:
          </Typography>
          <pre
            style={{
              direction: 'ltr',
              textAlign: 'left',
              overflow: 'auto',
              maxHeight: '300px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
          >
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </Paper>
      </Collapse>
    </Paper>
  );
}

export default FormPreview;