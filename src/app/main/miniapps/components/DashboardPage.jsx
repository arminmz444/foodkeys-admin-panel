// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Apps as AppsIcon,
  Description as FormIcon,
  Assignment as AssignmentIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useMiniapp } from '../context/MiniappContext';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getAccessibleMiniapps } = useMiniapp();
  
  const [recentForms, setRecentForms] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [miniapps, setMiniapps] = useState([]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch recent forms, activities, etc.
        const [formsRes, activitiesRes] = await Promise.all([
          axios.get('/api/forms/recent'),
          axios.get('/api/activities/recent')
        ]);
        
        setRecentForms(formsRes.data);
        setRecentActivities(activitiesRes.data);
        
        // Get accessible miniapps from context
        const accessibleMiniapps = getAccessibleMiniapps();
        setMiniapps(accessibleMiniapps);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load some dashboard content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [getAccessibleMiniapps]);
  
  // Show loading indicator
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Filter miniapps to standard and form types
  const standardMiniapps = miniapps.filter(app => app.type !== 'FORM');
  const formMiniapps = miniapps.filter(app => app.type === 'FORM');
  
  return (
    <Box>
      {/* Welcome section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.displayName || user?.username || 'User'}!
        </Typography>
        <Typography variant="body1">
          Use the dashboard to navigate your applications and recent activities.
        </Typography>
        
        {error && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
      
      <Grid container spacing={3}>
        {/* Miniapps section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AppsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Your Applications
                </Typography>
              </Box>
              
              {standardMiniapps.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No applications available. Contact your administrator for access.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {standardMiniapps.slice(0, 4).map((app) => (
                    <Grid item xs={6} key={app.id}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          {app.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ flexGrow: 1 }}>
                          {app.description || 'No description available'}
                        </Typography>
                        <Button 
                          component={Link} 
                          to={`/miniapp/${app.id}`}
                          variant="outlined" 
                          size="small" 
                          sx={{ mt: 1, alignSelf: 'flex-start' }}
                        >
                          Open
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
            
            {standardMiniapps.length > 4 && (
              <CardActions>
                <Button size="small" component={Link} to="/miniapps">
                  View All Applications
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
        
        {/* Forms section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <FormIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Forms
                </Typography>
              </Box>
              
              {formMiniapps.length === 0 && recentForms.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No forms available or recently used.
                </Typography>
              ) : (
                <List>
                  {/* Show form miniapps first */}
                  {formMiniapps.slice(0, 3).map((form) => (
                    <ListItem
                      key={form.id}
                      button
                      component={Link}
                      to={`/form/${form.name}`}
                      divider
                    >
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={form.name} 
                        secondary={form.description || 'Dynamic form'}
                      />
                    </ListItem>
                  ))}
                  
                  {/* Then show recent submissions */}
                  {recentForms.slice(0, 3).map((form) => (
                    <ListItem
                      key={form.id}
                      button
                      component={Link}
                      to={`/form/${form.formName}/${form.id}`}
                      divider
                    >
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={form.formName} 
                        secondary={`Last edited: ${new Date(form.updatedAt).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
            
            {(formMiniapps.length > 3 || recentForms.length > 3) && (
              <CardActions>
                <Button size="small" component={Link} to="/forms">
                  View All Forms
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
        
        {/* Recent Activities section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DashboardIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Recent Activities
                </Typography>
              </Box>
              
              {recentActivities.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No recent activities to display.
                </Typography>
              ) : (
                <List>
                  {recentActivities.map((activity) => (
                    <ListItem key={activity.id} divider>
                      <ListItemText 
                        primary={activity.action} 
                        secondary={`${activity.entityType}: ${activity.entityName} - ${new Date(activity.timestamp).toLocaleString()}`} 
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;