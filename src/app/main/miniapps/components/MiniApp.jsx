// src/pages/MiniappPage.js
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useMiniapp } from '../context/MiniappContext';
import { useAuth } from '../context/AuthContext';
import { createFederatedComponent } from '../utils/federationLoader';
import ErrorBoundary from '../components/ErrorBoundary';

const MiniApp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMiniapp } = useMiniapp();
  const { hasRole, hasCompany } = useAuth();
  
  const [miniapp, setMiniapp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [MiniappComponent, setMiniappComponent] = useState(null);
  
  // Fetch miniapp data
  useEffect(() => {
    const fetchMiniapp = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const miniappData = getMiniapp(id);
        if (!miniappData) {
          throw new Error('Miniapp not found');
        }
        
        setMiniapp(miniappData);
        
        // Check access permissions
        const allowedRoles = miniappData.config?.access?.roles || [];
        const hasRoleAccess = allowedRoles.length === 0 || 
          allowedRoles.some(role => hasRole(role));
        
        const allowedCompanies = miniappData.config?.access?.companies || [];
        const hasCompanyAccess = allowedCompanies.length === 0 || 
          allowedCompanies.some(company => hasCompany(company));
        
        if (!hasRoleAccess || !hasCompanyAccess) {
          throw new Error('You do not have permission to access this application');
        }
        
        // Create the dynamic component
        const DynamicComponent = createFederatedComponent(miniappData);
        setMiniappComponent(() => DynamicComponent);
        
      } catch (err) {
        console.error('Error loading miniapp:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMiniapp();
  }, [id, getMiniapp, hasRole, hasCompany]);
  
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
            Unable to load the requested application. Please try again later or contact support.
          </Typography>
        </Box>
      </Box>
    );
  }
  
  // Show miniapp
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {miniapp?.name} {miniapp?.version && `(v${miniapp.version})`}
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mt: 2, 
          minHeight: '70vh',
          position: 'relative'
        }}
      >
        <ErrorBoundary
          fallback={
            <Alert severity="error">
              The application encountered an error while loading.
            </Alert>
          }
        >
          <Suspense 
            fallback={
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height="100%"
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
              >
                <CircularProgress />
              </Box>
            }
          >
            {MiniappComponent && <MiniappComponent />}
          </Suspense>
        </ErrorBoundary>
      </Paper>
    </Box>
  );
};

export default MiniApp;