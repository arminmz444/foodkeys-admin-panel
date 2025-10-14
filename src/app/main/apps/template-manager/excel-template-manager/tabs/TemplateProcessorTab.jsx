// src/app/excel-templates/tabs/TemplateProcessorTab.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon,
  Remove as RemoveIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
import FuseLoading from '@fuse/core/FuseLoading';
import { 
  useGetExcelTemplatesQuery,
  useGenerateExcelMutation 
} from '../store/ExcelTemplateApi';

function TemplateProcessorTab() {
  const navigate = useNavigate();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateVariables, setTemplateVariables] = useState([
    { key: '', value: '' }
  ]);
  
  // Fetch templates
  const { 
    data: templates = [], 
    isLoading, 
    isError, 
    error 
  } = useGetExcelTemplatesQuery();
  
  // Generate Excel mutation
  const [generateExcel, { isLoading: isGenerating }] = useGenerateExcelMutation();
  
  const handleTemplateChange = (e) => {
    setSelectedTemplateId(e.target.value);
  };
  
  const handleAddVariable = () => {
    setTemplateVariables([...templateVariables, { key: '', value: '' }]);
  };
  
  const handleRemoveVariable = (index) => {
    const newVariables = [...templateVariables];
    newVariables.splice(index, 1);
    setTemplateVariables(newVariables);
  };
  
  const handleVariableChange = (index, field, value) => {
    const newVariables = [...templateVariables];
    newVariables[index][field] = value;
    setTemplateVariables(newVariables);
  };
  
  const handleGenerateExcel = async () => {
    if (!selectedTemplateId) {
      // toast.error('Please select a template');
      return;
    }
    
    // Convert array of variables to object
    const data = {};
    for (const variable of templateVariables) {
      if (variable.key.trim()) {
        // Extract the variable name without ${ }
        const key = variable.key.trim().replace(/^\${/, '').replace(/}$/, '');
        data[key] = variable.value;
      }
    }
    
    if (Object.keys(data).length === 0) {
      // toast.warning('Please add at least one variable');
      return;
    }
    
    try {
      const result = await generateExcel({
        templateId: selectedTemplateId,
        data
      }).unwrap();
      
      // Download the generated file
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      
      // Find template name for filename
      const template = templates.find(t => t.id.toString() === selectedTemplateId.toString());
      const filename = `generated_${template?.originalFilename || 'excel_file.xlsx'}`;
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      // toast.success('Excel file generated successfully!');
    } catch (err) {
      // toast.error(`Failed to generate Excel: ${err.message || 'Unknown error'}`);
    }
  };
  
  if (isLoading) {
    return <FuseLoading />;
  }
  
  if (isError) {
    return (
      <Box className="p-24 text-center">
        <Typography color="error">
          Error loading templates: {error?.message || 'Unknown error'}
        </Typography>
        <Button 
          className="mt-16" 
          variant="outlined" 
          onClick={() => navigate('/apps/excel-templates/list')}
        >
          Back to Templates
        </Button>
      </Box>
    );
  }
  
  return (
    <div className="w-full">
      <Typography variant="h6" className="mb-24">Generate Excel File</Typography>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="p-24">
          <Typography variant="subtitle1" className="mb-16">
            Select a template and provide variable values to generate a new Excel file
          </Typography>
          
          <FormControl fullWidth className="mb-24">
            <InputLabel id="template-select-label">Select Template</InputLabel>
            <Select
              labelId="template-select-label"
              value={selectedTemplateId}
              onChange={handleTemplateChange}
              label="Select Template"
              disabled={isGenerating}
            >
              {templates.map(template => (
                <MenuItem key={template.id} value={template.id.toString()}>
                  {template.name} ({template.originalFilename})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Divider className="mb-24" />
          
          <Box className="mb-16 flex justify-between items-center">
            <Typography variant="subtitle1">Template Variables</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddVariable}
              disabled={isGenerating}
              variant="outlined"
              size="small"
            >
              Add Variable
            </Button>
          </Box>
          
          <Typography variant="body2" color="textSecondary" className="mb-24">
            Add variables in the format ${'{VARIABLE_NAME}'} to match placeholders in your Excel template.
          </Typography>
          
          {templateVariables.map((variable, index) => (
            <Grid 
              container 
              spacing={2} 
              key={index} 
              className="mb-16" 
              alignItems="center"
            >
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Variable Name"
                  placeholder="${VARIABLE_NAME}"
                  value={variable.key}
                  onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                  disabled={isGenerating}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Value"
                  value={variable.value}
                  onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                  disabled={isGenerating}
                  size="small"
                />
                </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveVariable(index)}
                  disabled={isGenerating || templateVariables.length <= 1}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          
          <Box className="flex justify-end mt-32">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGenerateExcel}
              disabled={isGenerating || !selectedTemplateId}
              startIcon={isGenerating ? <CircularProgress size={16} /> : <FileDownloadIcon />}
            >
              {isGenerating ? 'Generating...' : 'Generate Excel'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </div>
  );
}

export default TemplateProcessorTab;