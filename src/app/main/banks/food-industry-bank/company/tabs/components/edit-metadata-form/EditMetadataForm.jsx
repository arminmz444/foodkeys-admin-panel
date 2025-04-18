// import { useState } from "react";
// import { Button, Typography } from "@mui/material";
// import TextField from "@mui/material/TextField";
// import DynamicFormGenerator from "app/shared-components/dynamic-field-generator/DynamicFormGenerator";

// const customSubmitField = ({ handleSubmit }) => {
//   return (
//     <Button variant="contained" onClick={handleSubmit}>
//       cذخیره
//     </Button>
//   );
// };
// /**
//  * EditMetadataForm renders inputs for editing metadata (for example: title and description).
//  * It receives the current file object (which contains a metadata object), an onSave callback
//  * that should be called with the updated metadata, and an onCancel callback.
//  */
// function EditMetadataForm({ file, onSave, onCancel, zodSchema, defaultValues }) {
//   // Initialize metadata state from file.metadata (or default to empty fields)
//   const [meta, setMeta] = useState(
//     file.metadata || { title: "", description: "" }
//   );

//   // Called when user clicks "Save"
//   function handleSubmit() {
//     onSave(meta);
//   }

//   return (
//     <div className="border rounded p-4 my-4 bg-gray-50">
//       <Typography variant="subtitle1" className="font-bold mb-2">
//         ویرایش اطلاعات فایل
//       </Typography>
//       {/*       
//       <div className="mb-2">
//         <label className="block mb-1 text-sm font-medium">عنوان</label>
//         <TextField
//           fullWidth
//           variant="outlined"
//           size="small"
//           value={meta.title}
//           onChange={(e) => setMeta({ ...meta, title: e.target.value })}
//           placeholder="عنوان فایل"
//         />
//       </div>
//       <div className="mb-2">
//         <label className="block mb-1 text-sm font-medium">توضیحات</label>
//         <TextField
//           fullWidth
//           variant="outlined"
//           size="small"
//           multiline
//           rows={3}
//           value={meta.description}
//           onChange={(e) => setMeta({ ...meta, description: e.target.value })}
//           placeholder="توضیحات فایل"
//         />
//       </div> */}
//       <DynamicFormGenerator
//         formHeaderTitle={"ویرایش اطلاعات فایل"}
//         schema={zodSchema}
//         formValidationStruct="ZOD_SCHEMA"
//         formGenerationType="MANUAL"
//         initialData={defaultValues}
//         onSubmit={onSave}
//         hideSubmitField={true}
//         customSubmitField={customSubmitField}
//       />
//       {/* <div className="flex gap-2">
//         <Button variant="contained" onClick={on}>
//           ذخیره
//         </Button>
//         <Button variant="text" onClick={onCancel}>
//           انصراف
//         </Button>
//       </div> */}
//     </div>
//   );
// }

// export default EditMetadataForm;

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button, 
  Typography, 
  TextField, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormHelperText,
  Grid
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { getMetadataSchema, getMetadataFieldsConfig } from '../../utils/fileUtils';

function EditMetadataForm({ 
  open, 
  onClose, 
  file, 
  onSave, 
  title = 'ویرایش اطلاعات فایل'
}) {
  // Get appropriate schema and config based on file type
  const schema = getMetadataSchema(file.fileServiceType, file.contentType);
  const fieldsConfig = getMetadataFieldsConfig(file.fileServiceType, file.contentType);
  
  // Initialize form with react-hook-form and zod validation
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid, isDirty }, 
    reset, 
    getValues,
    setValue,
    watch
  } = useForm({
    defaultValues: file.metadata || {},
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  // Reset form when file changes
  useEffect(() => {
    if (file.metadata) {
      reset(file.metadata);
    }
  }, [file.metadata, reset]);

  // Handle form submission
  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  // Helper function to add array item
  const addArrayItem = (field) => {
    const values = getValues(field) || [];
    if (values.length < (fieldsConfig[field].max || 3)) {
      setValue(field, [...values, '']);
    }
  };

  // Helper function to remove array item
  const removeArrayItem = (field, index) => {
    const values = getValues(field) || [];
    if (values.length > 1) {
      const newValues = [...values];
      newValues.splice(index, 1);
      setValue(field, newValues);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      component={motion.div}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <DialogTitle className="flex items-center">
        <FuseSvgIcon className="mr-2">heroicons-outline:pencil-alt</FuseSvgIcon>
        {title}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {Object.entries(fieldsConfig).map(([fieldName, config]) => (
              config.isArray ? (
                // Handle array fields (like emails, phone numbers)
                <Grid item xs={12} key={fieldName}>
                  <Typography variant="subtitle2" className="mb-1">
                    {config.label}
                    {config.required && <span className="text-red-500">*</span>}
                  </Typography>
                  
                  {/* Watch array values to re-render on change */}
                  {(watch(fieldName) || []).map((_, index) => (
                    <div key={`${fieldName}-${index}`} className="flex items-center mb-2">
                      <Controller
                        name={`${fieldName}.${index}`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            placeholder={`${config.label} ${index + 1}`}
                            error={!!errors[fieldName]?.[index]}
                            helperText={errors[fieldName]?.[index]?.message}
                          />
                        )}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => removeArrayItem(fieldName, index)}
                        className="ml-1"
                        disabled={(watch(fieldName) || []).length <= 1}
                      >
                        <FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
                      </IconButton>
                    </div>
                  ))}
                  
                  {/* Add button for array items */}
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                    onClick={() => addArrayItem(fieldName)}
                    disabled={(watch(fieldName) || []).length >= (config.max || 3)}
                  >
                    افزودن {config.label}
                  </Button>
                  
                  {/* Array-level error message */}
                  {errors[fieldName] && !errors[fieldName]?.[0] && (
                    <FormHelperText error>{errors[fieldName]?.message}</FormHelperText>
                  )}
                </Grid>
              ) : (
                // Handle regular fields
                <Grid item xs={12} sm={config.multiline ? 12 : 6} key={fieldName}>
                  <Controller
                    name={fieldName}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={`${config.label}${config.required ? ' *' : ''}`}
                        fullWidth
                        size="small"
                        multiline={config.multiline}
                        rows={config.multiline ? 3 : 1}
                        error={!!errors[fieldName]}
                        helperText={errors[fieldName]?.message}
                      />
                    )}
                  />
                </Grid>
              )
            ))}
          </Grid>
        </DialogContent>
        
        <DialogActions className="p-4">
          <Button onClick={onClose} color="inherit">
            انصراف
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!isValid || !isDirty}
          >
            ذخیره
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditMetadataForm;