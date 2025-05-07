// src/components/ExcelTemplateManager/TemplateProcessor.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  TextField,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { generateExcel } from '../../services/excelTemplateService';

const TemplateProcessor = ({ onBack, isMobile }) => {
  const { templates, loading } = useSelector(state => state.excelTemplate);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateVariables, setTemplateVariables] = useState([
    { key: '', value: '' }
  ]);
  const [processing, setProcessing] = useState(false);
  
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
    // Validate form
    if (!selectedTemplateId) {
      toast.error('Please select a template');
      return;
    }
    
    // Check if we have at least one valid key-value pair
    const validVariables = templateVariables.filter(v => v.key.trim() && v.key.startsWith('${') && v.key.endsWith('}'));
    
    if (validVariables.length === 0) {
      toast.error('Please add at least one valid variable (format: ${VARIABLE_NAME})');
      return;
    }
    
    // Convert array of variables to object with keys and values
    const data = {};
    for (const variable of templateVariables) {
      if (variable.key.trim()) {
        // Extract the variable name without ${ }
        const key = variable.key.trim().replace(/^\${/, '').replace(/}$/, '');
        data[key] = variable.value;
      }
    }
    
    setProcessing(true);
    
    try {
      const blob = await generateExcel(selectedTemplateId, data);
      
      // Download the generated file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Get template name for the file
      const template = templates.find(t => t.id === parseInt(selectedTemplateId));
      const filename = `generated_${template?.originalFilename || 'excel_report.xlsx'}`;
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file generated successfully!');
    } catch (error) {
      toast.error(`Failed to generate Excel: ${error.message || 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant={isMobile ? 'h5' : 'h4'}>Process Excel Template</Typography>
      </Box>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper elevation={2} sx={{ p: 3 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h6" gutterBottom>
              Select a template and fill in variables
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 4, mt: 2 }}>
              <InputLabel id="template-select-label">Excel Template</InputLabel>
              <Select
                labelId="template-select-label"
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                label="Excel Template"
                disabled={loading || processing}
              >
                {templates.map(template => (
                  <MenuItem key={template.id} value={template.id.toString()}>
                    {template.name} ({template.originalFilename})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </motion.div>
          
          <Divider sx={{ mb: 3 }} />
          
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Template Variables</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddVariable}
                variant="outlined"
                size="small"
                disabled={processing}
              >
                Add Variable
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add variables in the format ${VARIABLE_NAME} to match placeholders in your Excel template.
            </Typography>
            
            {templateVariables.map((variable, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Variable Name"
                      placeholder="${VARIABLE_NAME}"
                      value={variable.key}
                      onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                      disabled={processing}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Value"
                      value={variable.value}
                      onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                      disabled={processing}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveVariable(index)}
                      disabled={processing || templateVariables.length <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div variants={itemVariants} sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
                  onClick={handleGenerateExcel}
                  disabled={processing || !selectedTemplateId}
                >
                  {processing ? 'Generating...' : 'Generate Excel'}
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default TemplateProcessor;