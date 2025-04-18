import React, { lazy, Suspense, useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';

/**
 * Loads a remote module using Module Federation
 */
const loadRemoteModule = async (miniapp) => {
  if (!miniapp) return null;
  
  try {
    // Create a unique scope name based on the miniapp name
    const scopeName = `miniapp_${miniapp.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    
    // Construct the remoteEntry URL
    const remoteEntryUrl = `/static/miniapps/${miniapp.name}/${miniapp.version}/remoteEntry.js`;
    
    // Check if the remote script is already loaded
    if (!window[scopeName]) {
      // Load the remote entry script
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = remoteEntryUrl;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    
    // Initialize sharing
    // @ts-ignore
    await __webpack_init_sharing__('default');
    
    // Get the container
    // @ts-ignore
    const container = window[scopeName];
    
    // Initialize the container
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
    
    // Get the factory function
    const factory = await container.get('./MiniApp');
    
    // Create the React component
    const MiniApp = factory();
    
    return MiniApp;
  } catch (error) {
    console.error(`Error loading remote module for ${miniapp.name}:`, error);
    throw error;
  }
};

/**
 * Federation MiniApp Loader
 * Component that dynamically loads a MiniApp using Module Federation
 */
function FederationMiniAppLoader({ miniappId, companyId }) {
  const [miniapp, setMiniapp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Component, setComponent] = useState(null);
  
  // Fetch miniapp data
  useEffect(() => {
    const fetchMiniapp = async () => {
      try {
        let response;
        if (miniappId) {
          response = await axios.get(`/api/miniapps/${miniappId}`);
        } else if (companyId) {
          const companiesResponse = await axios.get(`/api/miniapps/company/${companyId}`);
          if (companiesResponse.data && companiesResponse.data.length > 0) {
            // Use the first miniapp for this company
            const miniapps = companiesResponse.data.filter(m => 
              m.integrationType === 'moduleFederation' && 
              m.clientType === 'ADMIN_PANEL_CLIENT'
            );
            
            if (miniapps.length > 0) {
              response = { data: miniapps[0] };
            } else {
              throw new Error('No compatible MiniApp found for this company');
            }
          } else {
            throw new Error('No MiniApp found for this company');
          }
        } else {
          throw new Error('Either miniappId or companyId must be provided');
        }
        
        if (response && response.data) {
          setMiniapp(response.data);
        } else {
          throw new Error('Failed to load MiniApp data');
        }
      } catch (err) {
        console.error('Error fetching miniapp:', err);
        setError(err.message || 'Failed to load miniapp');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMiniapp();
  }, [miniappId, companyId]);
  
  // Load the federated component
  useEffect(() => {
    if (!miniapp || miniapp.integrationType !== 'moduleFederation') return;
    
    const loadComponent = async () => {
      try {
        setLoading(true);
        const RemoteComponent = await loadRemoteModule(miniapp);
        setComponent(() => RemoteComponent);
      } catch (err) {
        console.error('Error loading federated component:', err);
        setError(`Failed to load component: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadComponent();
  }, [miniapp]);
  
  if (loading) {
    return <FuseLoading />;
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!miniapp) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        MiniApp not found
      </Alert>
    );
  }
  
  if (miniapp.integrationType !== 'moduleFederation') {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        This MiniApp does not use Module Federation integration type.
      </Alert>
    );
  }
  
  if (!Component) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Failed to load MiniApp component
      </Alert>
    );
  }
  
  // Pass the required props to the component
  return (
    <Suspense fallback={<FuseLoading />}>
      <Component 
        companyId={companyId || miniapp.targetCompanyId} 
        miniappId={miniapp.id}
        {...miniapp.componentProps} 
      />
    </Suspense>
  );
}

export default FederationMiniAppLoader;