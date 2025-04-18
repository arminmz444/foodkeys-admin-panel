// import { AutoField, AutoForm } from 'uniforms-mui';
// import { SubmitField } from 'app/shared-components/dynamic-field-generator/custom-fields/index.js';
// import { Box, Button, Paper, Typography, Grid } from '@mui/material';
// import Ajv from 'ajv';
// import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
// import ImageField from 'app/shared-components/dynamic-field-generator/ImageField.jsx';
// import ZodBridge from 'uniforms-bridge-zod';
// import { z } from 'zod';
// import Stack from '@mui/material/Stack';
// import { useState, useEffect } from 'react';

// /**
//  * Enhanced Dynamic Form Generator Component
//  * 
//  * @param {Object} props 
//  * @param {Object} props.initialData 
//  * @param {Function} props.onSubmit
//  * @param {String} props.formHeaderTitle
//  * @param {Object} props.schema
//  * @param {String} props.formValidationStruct 
//  * @param {Boolean} props.isSubmitting 
//  * @param {Object} props.formFieldsInputTypes 
//  * @param {String} props.formGenerationType 
//  * @param {Boolean} props.hideSubmitField 
//  * @param {Function} props.setCreateDialogOpen 
//  * @param {Function} props.customSubmitField 
//  * @param {Object} props.layoutConfig 
//  * @param {Object} props.customComponents
//  * @param {Object} props.containerProps
//  */
// function EnhancedDynamicFormGenerator(formProps) {
//   let schema
//   const {
//     initialData = {},
//     onSubmit,
//     formHeaderTitle,
//     formValidationStruct = 'JSON_SCHEMA',
//     isSubmitting = false,
//     formFieldsInputTypes = null,
//     formGenerationType = 'AUTO',
//     hideSubmitField = false,
//     setCreateDialogOpen,
//     customSubmitField = null,
//     layoutConfig = {
//       type: 'single-column', // 'single-column', 'two-column', 'three-column', 'custom'
//       spacing: 2,
//       customLayout: null, 
//       containerPadding: 2,
//       fieldGap: 2,
//     },
//     customComponents = {},
//     containerProps = {},
//   } = formProps;
//   schema = formProps?.schema;
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState(initialData);

//   // Handle form data updates
//   useEffect(() => {
//     setFormData(initialData);
//   }, [initialData]);

//   const defaultSchema =
//     formValidationStruct === 'ZOD_SCHEMA'
//       ? z.object({
//           text: z.string(),
//           num: z.number(),
//           bool: z.boolean(),
//           nested: z.object({ text: z.string(), t: z.number() }).array(),
//           date: z.date(),
//           list: z.string().uniforms({ label: 'متن لیست', placeholder: 'متن نمونه لیست' }).array(),
//           select: z.enum(['a', 'b']),
//           radio: z.enum(['a', 'b']).uniforms({ checkboxes: true })
//         })
//       : {
//           title: formHeaderTitle || 'محصولات و خدمات',
//           type: 'object',
//           properties: {
//             products: {
//               type: 'array',
//               title: 'محصولات و خدمات',
//               items: {
//                 type: 'object',
//                 properties: {
//                   name: {
//                     type: 'string',
//                     title: 'نام محصول'
//                   },
//                   description: {
//                     type: 'string',
//                     title: 'توضیحات محصول'
//                   },
//                   categoryType: {
//                     type: 'string',
//                     title: 'دسته‌بندی محصول'
//                   },
//                   showProduct: {
//                     type: 'boolean',
//                     title: 'نمایش در صفحه اختصاصی؟'
//                   },
//                   pictures: {
//                     type: 'array',
//                     title: 'تصاویر',
//                     items: {
//                       type: 'object',
//                       properties: {
//                         url: {
//                           type: 'string',
//                           uniforms: { component: customComponents.ImageField || ImageField },
//                           title: 'آدرس عکس آپلود شده'
//                         },
//                         description: { type: 'string', title: 'توضیحات عکس' }
//                       }
//                     }
//                   }
//                 },
//                 required: ['name', 'categoryType']
//               }
//             }
//           }
//         };

//   if (!schema) schema = defaultSchema;

//   console.log(
//     `Dynamic Forms: FORM_HEADER_TITLE = ${formHeaderTitle}, INITIAL_DATA = ${JSON.stringify(formData)}, SCHEMA = ${JSON.stringify(schema)}, FORM_VALIDATION_STRUCT = ${formValidationStruct}`
//   );

//   const ajv = new Ajv({ strict: false, allErrors: false, useDefaults: true });
//   ajv.addKeyword('uniforms');

//   function createValidator(schema) {
//     if (formValidationStruct === 'ZOD_SCHEMA') return null;

//     const validator = ajv.compile(schema);
//     return (model) => {
//       validator(model);
//       return validator.errors?.length ? { details: validator.errors } : null;
//     };
//   }

//   const validator = createValidator(schema);

//   const bridge =
//     formValidationStruct === 'ZOD_SCHEMA' ? new ZodBridge({ schema }) : new JSONSchemaBridge({ schema, validator });

//   const renderFields = () => {
//     if (formGenerationType === 'AUTO' || !formFieldsInputTypes) return null;

//     const fields = Array.isArray(formFieldsInputTypes) 
//       ? formFieldsInputTypes 
//       : Object.keys(formFieldsInputTypes);

//     if (layoutConfig.type === 'custom' && layoutConfig.customLayout) {
//       return layoutConfig.customLayout(fields.map(field => (
//         <AutoField 
//           key={field} 
//           name={typeof field === 'string' ? field : field.name} 
//           {...(formFieldsInputTypes[field]?.props || {})}
//         />
//       )));
//     }

//     let cols = 12; 
//     if (layoutConfig.type === 'two-column') cols = 6;
//     if (layoutConfig.type === 'three-column') cols = 4;

//     return (
//       <Grid container spacing={layoutConfig.spacing || 2}>
//         {fields.map((field) => (
//           <Grid item xs={12} sm={cols} key={typeof field === 'string' ? field : field.name}>
//             <AutoField 
//               name={typeof field === 'string' ? field : field.name} 
//               {...(formFieldsInputTypes[field]?.props || {})}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     );
//   };

//   return (
//     <Paper
//       sx={{ p: layoutConfig.containerPadding || 2, width: '100%', maxWidth: 800, margin: 'auto' }}
//       elevation={0}
//       {...containerProps}
//     >
//       {formHeaderTitle && (
//         <Box mb={layoutConfig.fieldGap || 2}>
//           <Typography variant="h5" gutterBottom>
//             {formHeaderTitle}
//           </Typography>
//         </Box>
//       )}

//       <AutoForm
//         schema={bridge}
//         model={formData}
        
//         onSubmit={async (doc) => {
//           setLoading(true);
//           try {
//             if (onSubmit) {
//               await onSubmit(doc);
//             }
//           } catch (error) {
//             console.error('خطا در ارسال فرم:', error);
//             throw error;
//           }
//           setLoading(false);
//         }}
//         showInlineError
//       >
//         {renderFields()}

//         {formGenerationType !== 'AUTO' && !hideSubmitField && (
//           <Stack
//             className="mt-16 mb-0 flex flex-row justify-end"
//             spacing={2}
//             direction="row"
//             sx={{ mt: 4 }}
//           >
//             {setCreateDialogOpen && (
//               <Button onClick={() => setCreateDialogOpen(false)}>بستن</Button>
//             )}
//             <SubmitField
//               variant="contained"
//               type="submit"
//               color="secondary"
//               label="ثبت"
//               loading={loading}
//             />
//           </Stack>
//         )}
        
//         {customSubmitField && customSubmitField({ handleSubmit: onSubmit })}
//       </AutoForm>
//     </Paper>
//   );
// }

// export default EnhancedDynamicFormGenerator;

// src/app/shared-components/dynamic-form-generator/EnhancedDynamicFormGenerator.jsx
import { useState, useEffect } from "react";
import { AutoField, AutoForm } from 'uniforms-mui';
import { Box, Button, Paper, Typography, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import Ajv from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import ImageField from './ImageField.jsx';
import { ZodBridge } from 'uniforms-bridge-zod';
import { z } from 'zod';
import Stack from '@mui/material/Stack';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * Enhanced Dynamic Form Generator Component
 * 
 * @param {Object} props 
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Submit callback
 * @param {String} props.formHeaderTitle - Form title
 * @param {Object|z.ZodObject} props.schema - JSON Schema object or Zod schema
 * @param {String} props.formValidationStruct - 'JSON_SCHEMA' or 'ZOD_SCHEMA'
 * @param {Boolean} props.isSubmitting - Loading state
 * @param {Object|Array} props.formFieldsInputTypes - Field definitions
 * @param {String} props.formGenerationType - 'AUTO' or 'MANUAL'
 * @param {Boolean} props.hideSubmitField - Whether to hide submit button
 * @param {Function} props.setCreateDialogOpen - Dialog close callback
 * @param {Function} props.customSubmitField - Custom submit field
 * @param {Object} props.layoutConfig - Layout configuration
 * @param {Object} props.customComponents - Custom field components
 * @param {Object} props.containerProps - Props for container Paper component
 */
function EnhancedDynamicFormGenerator(formProps) {
  const {
    initialData = {},
    onSubmit,
    formHeaderTitle,
    schema,
    formValidationStruct = 'JSON_SCHEMA',
    isSubmitting = false,
    formFieldsInputTypes = null,
    formGenerationType = 'AUTO',
    hideSubmitField = false,
    setCreateDialogOpen,
    customSubmitField = null,
    layoutConfig = {
      type: 'single-column', // 'single-column', 'two-column', 'three-column', 'custom'
      spacing: 2,
      customLayout: null, 
      containerPadding: 2,
      fieldGap: 2,
    },
    customComponents = {},
    containerProps = {},
  } = formProps;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [bridge, setBridge] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Handle form data updates
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);
  
  // Create bridge based on schema type
  useEffect(() => {
    if (!schema) return;
    
    try {
      let newBridge;
      
      if (formValidationStruct === 'ZOD_SCHEMA') {
        // For Zod schema
        newBridge = new ZodBridge({ schema });
      } else {
        // For JSON Schema
        const jsonSchema = typeof schema === 'string' ? JSON.parse(schema) : schema;
        
        const ajv = new Ajv({ strict: false, allErrors: true, useDefaults: true });
        ajv.addKeyword('uniforms');
        
        const validator = ajv.compile(jsonSchema);
        const validate = (model) => {
          validator(model);
          return validator.errors?.length ? { details: validator.errors } : null;
        };
        
        newBridge = new JSONSchemaBridge({ schema: jsonSchema, validate });
      }
      
      setBridge(newBridge);
    } catch (error) {
      console.error('Error creating schema bridge:', error);
      setNotification({
        open: true,
        message: 'خطا در پردازش اسکیما',
        severity: 'error'
      });
    }
  }, [schema, formValidationStruct]);

  // Default schema if none provided
  const defaultSchema = formValidationStruct === 'ZOD_SCHEMA'
    ? z.object({
        text: z.string(),
        num: z.number(),
        bool: z.boolean(),
        nested: z.object({ text: z.string(), t: z.number() }).array(),
        date: z.date(),
        list: z.string().uniforms({ label: 'متن لیست', placeholder: 'متن نمونه لیست' }).array(),
        select: z.enum(['a', 'b']),
        radio: z.enum(['a', 'b']).uniforms({ checkboxes: true })
      })
    : {
        title: formHeaderTitle || 'فرم پویا',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'نام'
          },
          email: {
            type: 'string',
            format: 'email',
            title: 'ایمیل'
          }
        },
        required: ['name']
      };

  // Handle close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Render fields manually
  const renderFields = () => {
    if (formGenerationType === 'AUTO' || !formFieldsInputTypes) return null;

    const fields = Array.isArray(formFieldsInputTypes) 
      ? formFieldsInputTypes 
      : Object.keys(formFieldsInputTypes);

    // Custom layout if provided
    if (layoutConfig.type === 'custom' && layoutConfig.customLayout) {
      return layoutConfig.customLayout(fields.map(field => (
        <AutoField 
          key={field} 
          name={typeof field === 'string' ? field : field.name} 
          {...(formFieldsInputTypes[field]?.props || {})}
        />
      )));
    }

    // Grid-based layouts
    let cols = 12; 
    if (layoutConfig.type === 'two-column') cols = 6;
    if (layoutConfig.type === 'three-column') cols = 4;

    return (
      <Grid container spacing={layoutConfig.spacing || 2}>
        {fields.map((field) => (
          <Grid item xs={12} sm={cols} key={typeof field === 'string' ? field : field.name}>
            <AutoField 
              name={typeof field === 'string' ? field : field.name} 
              {...(formFieldsInputTypes[field]?.props || {})}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  if (!bridge && formValidationStruct === 'JSON_SCHEMA') {
    // Create default bridge
    const ajv = new Ajv({ strict: false, allErrors: false, useDefaults: true });
    ajv.addKeyword('uniforms');
    
    const validator = ajv.compile(defaultSchema);
    const validate = (model) => {
      validator(model);
      return validator.errors?.length ? { details: validator.errors } : null;
    };
    
    return (
      <Paper
        sx={{ p: layoutConfig.containerPadding || 2, width: '100%', maxWidth: 800, margin: 'auto' }}
        elevation={0}
        {...containerProps}
      >
        <Typography variant="body1" color="error">
          اسکیما به درستی تعریف نشده است
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{ p: layoutConfig.containerPadding || 2, width: '100%', maxWidth: 800, margin: 'auto', position: 'relative' }}
      elevation={0}
      {...containerProps}
    >
      {/* Success animation */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(2px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 80 }} />
          </motion.div>
          <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
            فرم با موفقیت ارسال شد
          </Typography>
        </motion.div>
      )}
      
      {formHeaderTitle && (
        <Box mb={layoutConfig.fieldGap || 2}>
          <Typography variant="h5" gutterBottom>
            {formHeaderTitle}
          </Typography>
        </Box>
      )}

      <AutoForm
        schema={bridge || new ZodBridge({ schema: defaultSchema })}
        model={formData}
        onSubmit={async (doc) => {
          setLoading(true);
          try {
            if (onSubmit) {
              await onSubmit(doc);
              // Show success animation
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 2000);
            }
          } catch (error) {
            console.error('خطا در ارسال فرم:', error);
            setNotification({
              open: true,
              message: 'خطا در ارسال فرم',
              severity: 'error'
            });
            throw error;
          } finally {
            setLoading(false);
          }
        }}
        showInlineError
      >
        {renderFields()}

        {formGenerationType !== 'AUTO' && !hideSubmitField && (
          <Stack
            className="mt-16 mb-0 flex flex-row justify-end"
            spacing={2}
            direction="row"
            sx={{ mt: 4 }}
          >
            {setCreateDialogOpen && (
              <Button onClick={() => setCreateDialogOpen(false)}>بستن</Button>
            )}
            <Button
              variant="contained"
              type="submit"
              color="secondary"
              disabled={loading || isSubmitting}
              startIcon={loading || isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading || isSubmitting ? 'در حال ارسال...' : 'ثبت'}
            </Button>
          </Stack>
        )}
        
        {customSubmitField && customSubmitField({ handleSubmit: onSubmit, loading })}
      </AutoForm>
      
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
    </Paper>
  );
}

export default EnhancedDynamicFormGenerator;