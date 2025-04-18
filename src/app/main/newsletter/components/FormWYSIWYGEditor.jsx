// src/app/modules/newsletter/components/FormWYSIWYGEditor.jsx
import React, { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import CustomJoditEditor from 'app/shared-components/jodit-editor/CustomJoditEditor';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';

function FormWYSIWYGEditor({ name, label, className = '', ...props }) {
  const { control, formState } = useFormContext();
  const { errors } = formState;
  const errorMessage = errors[name]?.message;

  // Use memoized onChange handler to prevent infinite loops
  const handleEditorChange = useCallback((value, onChange) => {
    onChange(value);
  }, []);

  return (
    <FormControl 
      error={!!errorMessage} 
      className={`w-full ${className}`}
      fullWidth
    >
      {label && (
        <FormLabel className="mb-2 font-medium text-14" component="legend">
          {label}
        </FormLabel>
      )}
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CustomJoditEditor
            value={field.value || ''}
            config={{
              direction: 'rtl',
              language: 'fa',
              toolbarButtonSize: 'middle',
              readonly: false,
              height: 400,
              minHeight: 200,
              maxHeight: 800
            }}
            onChange={(newContent) => handleEditorChange(newContent, field.onChange)}
            {...props}
          />
        )}
      />
      
      {errorMessage && (
        <FormHelperText className="text-red-500">
          {errorMessage}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default React.memo(FormWYSIWYGEditor);