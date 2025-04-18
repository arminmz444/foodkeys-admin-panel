// src/app/modules/newsletter/components/CustomJoditWrapper.jsx
import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';

// Create a simple wrapper for Jodit that handles its own state
function CustomJoditWrapper({ 
  initialValue = '',
  onChange,
  label,
  error,
  errorMessage,
  className = '',
  ...props 
}) {
  // Use local state to control the editor
  const [content, setContent] = useState(initialValue);
  const editorRef = useRef(null);
  
  // Update local state when initialValue changes (but not on every render)
  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);
  
  // Config for Jodit
  const config = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "fa",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    direction: "rtl",
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    buttons: [
      "undo", "redo", "|",
      "bold", "strikethrough", "underline", "italic", "|",
      "superscript", "subscript", "|",
      "align", "|",
      "ul", "ol", "outdent", "indent", "|",
      "font", "fontsize", "brush", "paragraph", "|",
      "image", "link", "table", "|",
      "hr", "eraser", "copyformat", "|",
      "fullsize", "selectall", "print", "|",
      "source"
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    height: 400,
    ...props.config
  };
  
  // Handle changes
  const handleChange = (newContent) => {
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };
  
  return (
    <FormControl 
      error={!!error} 
      className={`w-full ${className}`}
      fullWidth
    >
      {label && (
        <FormLabel className="mb-2 font-medium text-14" component="legend">
          {label}
        </FormLabel>
      )}
      
      <JoditEditor
        ref={editorRef}
        value={content}
        config={config}
        onBlur={handleChange}
        onChange={() => {}}
        {...props}
      />
      
      {errorMessage && (
        <FormHelperText className="text-red-500">
          {errorMessage}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default React.memo(CustomJoditWrapper);