import React from 'react';
import Editor from '@monaco-editor/react';
import { CircularProgress, Box } from '@mui/material';

/**
 * A code editor component based on Monaco Editor
 */
const CodeEditor = ({
  value,
  onChange,
  language = 'javascript',
  height = '300px',
  readOnly = false,
  options = {}
}) => {
  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  const defaultOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    readOnly,
    fontFamily: 'Cascadia Code, Fira Code, Consolas, monospace',
    fontSize: 14,
    wordWrap: 'on',
    automaticLayout: true,
    ...options
  };

  return (
    <Box
      sx={{
        '.monaco-editor': {
          paddingTop: 1,
          // paddingRight: 10,
          // paddingLeft: 10,
          color: "#ffffff",
          direction: 'rtl'
        },
        height,
        width: '100%',
        overflow: 'hidden',
        borderRadius: 1
      }}
    >
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={handleEditorChange}
        options={defaultOptions}
        loading={<CircularProgress size={40} />}
        theme="vs-dark"
      />
    </Box>
  );
};

export default CodeEditor;