// src/app/excel-templates/components/CustomTemplateContent.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CircularProgress
} from '@mui/material';
import { 
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  FileCopy as FileCopyIcon,
  FileDownload as FileDownloadIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
// import { toast } from 'react-toastify';
import { useGenerateExcelMutation } from '../store/ExcelTemplateApi';

function CustomTemplateContent({ template }) {
  const { templateId } = useParams();
  
  const [templateVariables, setTemplateVariables] = useState([
    { key: '', value: '' }
  ]);
  
  // Generate Excel mutation
  const [generateExcel, { isLoading: isGenerating }] = useGenerateExcelMutation();
  
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
        templateId,
        data
      }).unwrap();
      
      // Download the generated file
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      
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
  
  if (!template) {
    return (
      <Box className="flex items-center justify-center h-full">
        <Typography>Template data not available</Typography>
      </Box>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
      className="w-full"
    >
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <Card component={motion.div} 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="w-full mb-32 rounded-16 shadow"
          >
            <CardHeader title="Template Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box className="flex items-center mb-16">
                    <DescriptionIcon className="text-20 mr-8" color="action" />
                    <Typography variant="subtitle1" className="font-medium">Description</Typography>
                  </Box>
                  <Typography variant="body1">
                    {template.description || 'No description provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className="flex items-center mb-16">
                    <FileCopyIcon className="text-20 mr-8" color="action" />
                    <Typography variant="subtitle1" className="font-medium">File Information</Typography>
                  </Box>
                  <Typography variant="body2" className="mb-8">
                    <strong>Type:</strong> {template.contentType}
                  </Typography>
                  <Typography variant="body2" className="mb-8">
                    <strong>Created:</strong> {format(new Date(template.createdAt), 'MMM d, yyyy HH:mm')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last Updated:</strong> {format(new Date(template.updatedAt), 'MMM d, yyyy HH:mm')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
            className="w-full rounded-16 shadow"
          >
            <CardHeader 
              title="Generate Excel File" 
              subheader="Fill in variables to generate a new Excel file from this template"
              action={
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  onClick={handleAddVariable}
                  disabled={isGenerating}
                  startIcon={<AddIcon />}
                >
                  Add Variable
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-16">
                Add variables in the format <code>${'{VARIABLE_NAME}'}</code> to match placeholders in your Excel template.
              </Typography>
              
              {templateVariables.map((variable, index) => (
                <Grid 
                  container 
                  spacing={2} 
                  key={index} 
                  className="mb-16" 
                  alignItems="center"
                  component={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Variable Name"
                      placeholder="${VARIABLE_NAME}"
                      value={variable.key}
                      onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                      disabled={isGenerating}
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
                      disabled={isGenerating}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      color="error"
                      onClick={() => handleRemoveVariable(index)}
                      disabled={isGenerating || templateVariables.length <= 1}
                      variant="text"
                      startIcon={<RemoveIcon />}
                      size="small"
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              ))}
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGenerateExcel}
                  disabled={isGenerating}
                  startIcon={isGenerating ? 
                    <CircularProgress size={20} color="inherit" /> : 
                    <FileDownloadIcon />
                  }
                >
                  {isGenerating ? 'Generating...' : 'Generate Excel'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default CustomTemplateContent;