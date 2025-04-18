// src/pages/DynamicFormPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

import DynamicFormRenderer from '../components/DynamicForm/DynamicFormRenderer';
import { useAuth } from '../context/AuthContext';

const DynamicFormPage = () => {
  const { formName } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  const [formSchema, setFormSchema] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  
  // Fetch form schema
  useEffect(() => {
    const fetchFormSchema = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch form schema from backend
        const response = await axios.get(`/api/forms/${formName}`);
        
        const { schema, data, access } = response.data;
        
        // Check access permissions
        if (access && access.roles && access.roles.length > 0) {
          const hasAccess = access.roles.some(role => hasRole(role));
          if (!hasAccess) {
            throw new Error('You do not have permission to access this form');
          }
        }
        
        setFormSchema(schema);
        setInitialValues(data || {});
        
      } catch (err) {
        console.error('Error loading form schema:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };
    
    if (formName) {
      fetchFormSchema();
    }
  }, [formName, hasRole]);
  
  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setSubmitResult(null);
      
      // Submit form data to backend
      const response = await axios.post(`/api/forms/${formName}/submit`, formData);
      
      setSubmitResult({
        type: 'success',
        message: response.data.message || 'Form submitted successfully!',
        data: response.data
      });
      
      // If form has a redirect specified, navigate there
      if (response.data.redirect) {
        setTimeout(() => {
          navigate(response.data.redirect);
        }, 1500);
      }
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitResult({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit form'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Box my={4}>
        <Alert severity="error">
          {error}
        </Alert>
        <Box mt={2} textAlign="center">
          <Typography variant="body1">
            Unable to load the requested form. Please try again later or contact support.
          </Typography>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Form title from routing info */}
      <Typography variant="h4" component="h1" gutterBottom>
        {formSchema?.title || formName}
      </Typography>
      
      {/* Show submission result if any */}
      {submitResult && (
        <Alert 
          severity={submitResult.type} 
          sx={{ mb: 3 }}
        >
          {submitResult.message}
        </Alert>
      )}
      
      {/* Render the dynamic form */}
      {formSchema && (
        <DynamicFormRenderer
          schema={formSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      )}
    </Box>
  );
};

export default DynamicFormPage;