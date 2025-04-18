// src/context/MiniappContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import md5 from 'md5';

const MiniAppContext = createContext(null);

export const useMiniApp = () => useContext(MiniAppContext);

export const MiniAppProvider = ({ children }) => {
  const [miniapps, setMiniapps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, hasRole, hasCompany } = useAuth();

  // Fetch available miniapps from the server
  const fetchMiniapps = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/miniapps');
      setMiniapps(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch miniapps');
      console.error('Error fetching miniapps:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Filter miniapps based on user permissions
  const getAccessibleMiniapps = () => {
    if (!user) return [];
    
    return miniapps.filter(miniapp => {
      // Check role-based access
      const allowedRoles = miniapp.config?.access?.roles || [];
      const hasRoleAccess = allowedRoles.length === 0 || 
        allowedRoles.some(role => hasRole(role));
      
      // Check company-based access
      const allowedCompanies = miniapp.config?.access?.companies || [];
      const hasCompanyAccess = allowedCompanies.length === 0 || 
        (user.companyId && allowedCompanies.includes(user.companyId));
      
      return hasRoleAccess && hasCompanyAccess;
    });
  };

  // Get a specific miniapp by ID
  const getMiniapp = (id) => {
    return miniapps.find(app => app.id === id);
  };

  // Upload a new miniapp
  const uploadMiniapp = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/miniapps/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh the miniapps list
      await fetchMiniapps();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calculate the folder path for a miniapp (client-side)
  const calculateMiniappPath = (name, version) => {
    return md5(`${name}_${version}`);
  };

  // Initialize - fetch miniapps when auth is ready
  useEffect(() => {
    if (user) {
      fetchMiniapps();
    }
  }, [user]);

  const value = {
    miniapps,
    loading,
    error,
    fetchMiniapps,
    getAccessibleMiniapps,
    getMiniapp,
    uploadMiniapp,
    calculateMiniappPath,
  };

  return <MiniAppContext.Provider value={value}>{children}</MiniAppContext.Provider>;
};

export default MiniAppContext;