// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Apps as AppsIcon,
  Description as FormIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';
import { useMiniapp } from '../context/MiniappContext';

const drawerWidth = 240;

const Layout = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { getAccessibleMiniapps } = useMiniapp();
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [miniapps, setMiniapps] = useState([]);
  const [dynamicForms, setDynamicForms] = useState([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Set accessible miniapps
  useEffect(() => {
    if (isAuthenticated) {
      const apps = getAccessibleMiniapps();
      // Separate standard miniapps from form-type miniapps
      setMiniapps(apps.filter(app => app.type !== 'FORM'));
      setDynamicForms(apps.filter(app => app.type === 'FORM'));
    }
  }, [isAuthenticated, getAccessibleMiniapps]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          App Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding component={Link} to="/dashboard">
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        
        {/* Miniapps List */}
        {miniapps.length > 0 && (
          <>
            <Divider />
            <ListItem>
              <ListItemText primary="Applications" />
            </ListItem>
            {miniapps.map((app) => (
              <ListItem key={app.id} disablePadding component={Link} to={`/miniapp/${app.id}`}>
                <ListItemButton>
                  <ListItemIcon>
                    <AppsIcon />
                  </ListItemIcon>
                  <ListItemText primary={app.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
        
        {/* Dynamic Forms List */}
        {dynamicForms.length > 0 && (
          <>
            <Divider />
            <ListItem>
              <ListItemText primary="Forms" />
            </ListItem>
            {dynamicForms.map((form) => (
              <ListItem key={form.id} disablePadding component={Link} to={`/form/${form.name}`}>
                <ListItemButton>
                  <ListItemIcon>
                    <FormIcon />
                  </ListItemIcon>
                  <ListItemText primary={form.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
        
        {/* Admin Section */}
        {hasRole('ADMIN') && (
          <>
            <Divider />
            <ListItem>
              <ListItemText primary="Administration" />
            </ListItem>
            <ListItem disablePadding component={Link} to="/admin/miniapps">
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Miniapps" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  if (!isAuthenticated) {
    return null; // Don't render layout when not authenticated
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Super App
          </Typography>
          
          {/* User Menu */}
          {user && (
            <>
              <Button color="inherit" onClick={handleUserMenuOpen}>
                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                  {user.username ? user.username[0].toUpperCase() : 'U'}
                </Avatar>
                {user.username}
              </Button>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={handleUserMenuClose}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px', // AppBar height
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;