import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { selectCompany } from '../store/companySlice';

// This component demonstrates how to create a custom tab for the Company form
// that communicates with the parent application

function CompanyCustomTab() {
  const company = useSelector(selectCompany);
  const [formData, setFormData] = useState({
    additionalName: '',
    additionalDescription: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Verify the origin for security
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'FORM_SUBMIT') {
        // Handle form submission from iframe
        console.log('Received form data:', event.data.data);
        
        // Simulate saving the data
        setSaving(true);
        setTimeout(() => {
          setSaving(false);
          setSuccess(true);
          
          // Reset success message after 3 seconds
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        }, 1500);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
      
      // If we have data for this company, populate the form
      if (company?.additionalInfo) {
        setFormData(company.additionalInfo);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [company]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate saving the data
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        اطلاعات تکمیلی شرکت {company?.name}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          اطلاعات با موفقیت ذخیره شد.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          خطا در ذخیره اطلاعات: {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="نام تکمیلی"
              name="additionalName"
              value={formData.additionalName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="شخص رابط"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="ایمیل رابط"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="تلفن رابط"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="توضیحات تکمیلی"
              name="additionalDescription"
              value={formData.additionalDescription}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
              >
                {saving ? 'در حال ذخیره...' : 'ذخیره'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default CompanyCustomTab;
