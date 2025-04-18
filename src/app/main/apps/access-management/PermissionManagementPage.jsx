// src/pages/users/PermissionManagementPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
// import { useNotification } from '../../context/NotificationContext';

const PermissionManagementPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [openRolePermissionsDialog, setOpenRolePermissionsDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  
  // const { showSuccess, handleApiError, showConfirmation } = useNotification();
  
  // New permission form state
  const [permissionForm, setPermissionForm] = useState({
    name: '',
    displayName: '',
    description: ''
  });
  
  // Fetch permissions and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch permissions
        const permissionsResponse = await fetch('/api/auth/permissions');
        const permissionsData = await permissionsResponse.json();
        setPermissions(permissionsData);
        
        // Fetch roles
        const rolesResponse = await fetch('/api/auth/roles');
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
      } catch (error) {
        enqueueSnackbar(`Failed to load permissions and roles`, {variant: 'error'});

        // handleApiError(error, { message: 'Failed to load permissions and roles' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter permissions based on search query
  const filteredPermissions = permissions.filter(permission => {
    const searchFields = [
      permission.name,
      permission.displayName,
      permission.description
    ].filter(Boolean).join(' ').toLowerCase();
    
    return searchFields.includes(searchQuery.toLowerCase());
  });
  
  // Group permissions by category (first part of the name before the dot)
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const category = permission.name.includes('.') 
      ? permission.name.split('.')[0] 
      : 'General';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(permission);
    return acc;
  }, {});
  
  // Handle opening the permission dialog
  const handleOpenPermissionDialog = (permission = null) => {
    if (permission) {
      setCurrentPermission(permission);
      setPermissionForm({
        name: permission.name,
        displayName: permission.displayName,
        description: permission.description || ''
      });
    } else {
      setCurrentPermission(null);
      setPermissionForm({
        name: '',
        displayName: '',
        description: ''
      });
    }
    setOpenPermissionDialog(true);
  };
  
  // Handle closing the permission dialog
  const handleClosePermissionDialog = () => {
    setOpenPermissionDialog(false);
    setCurrentPermission(null);
  };
  
  // Handle permission form input changes
  const handlePermissionFormChange = (e) => {
    const { name, value } = e.target;
    setPermissionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle saving a permission
  const handleSavePermission = async () => {
    try {
      // Validate form inputs
      if (!permissionForm.name || !permissionForm.displayName) {
        throw new Error('Name and Display Name are required');
      }
      
      // Prepare API endpoint and method
      const url = currentPermission 
        ? `/api/auth/permissions/${currentPermission.id}` 
        : '/api/auth/permissions';
      const method = currentPermission ? 'PUT' : 'POST';
      
      // Make API request
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(permissionForm)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${currentPermission ? 'update' : 'create'} permission`);
      }
      
      // Parse response
      const result = await response.json();
      
      // Update local state
      if (currentPermission) {
        setPermissions(prev => prev.map(p => p.id === currentPermission.id ? result : p));
      } else {
        setPermissions(prev => [...prev, result]);
      }
      
      // Show success message
      enqueueSnackbar(`Permission ${currentPermission ? 'updated' : 'created'} successfully`, {variant: 'success'});
      
      // Close dialog
      handleClosePermissionDialog();
    } catch (error) {
      console.error(error)
      enqueueSnackbar(`Failed to load permissions and roles: ` + error, {variant: 'error'});

      // handleApiError(error);
    }
  };
  
  // Handle deleting a permission
  const handleDeletePermission = async (permission) => {
    try {
      // Ask for confirmation
      const confirmed = await showConfirmation({
        title: 'Delete Permission',
        message: `Are you sure you want to delete the permission "${permission.displayName}"? This may affect roles that use this permission.`,
        confirmButton: 'Delete',
        cancelButton: 'Cancel',
        severity: 'error'
      });
      
      if (!confirmed) {
        return;
      }
      
      // Make delete request
      const response = await fetch(`/api/auth/permissions/${permission.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete permission');
      }
      
      // Update local state
      setPermissions(prev => prev.filter(p => p.id !== permission.id));
      
      // Show success message
      enqueueSnackbar('Permission deleted successfully', { variant: "success"});
    } catch (error) {
      console.error(error)
      enqueueSnackbar(`Failed to load permissions and roles: ` + error, {variant: 'error'});

      // handleApiError(error);
    }
  };
  
  // Handle opening the role permissions dialog
  const handleOpenRolePermissionsDialog = async (role) => {
    try {
      setCurrentRole(role);
      setLoading(true);
      
      // Fetch role permissions
      const response = await fetch(`/api/auth/roles/${role.id}/permissions`);
      
      if (!response.ok) {
        throw new Error('Failed to load role permissions');
      }
      
      const rolePermissions = await response.json();
      
      // Set selected permissions
      setSelectedPermissions(rolePermissions.map(p => p.id));
      
      // Open dialog
      setOpenRolePermissionsDialog(true);
    } catch (error) {
      enqueueSnackbar(`Failed to load permissions and roles: ` + error, {variant: 'error'});

      // handleApiError(error);
      console.error(error)
    } finally {
      setLoading(false);
    }
  };
  
  // Handle closing the role permissions dialog
  const handleCloseRolePermissionsDialog = () => {
    setOpenRolePermissionsDialog(false);
    setCurrentRole(null);
    setSelectedPermissions([]);
  };
  
  // Handle toggling a permission for a role
  const handleTogglePermission = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };
  
  // Handle saving role permissions
  const handleSaveRolePermissions = async () => {
    try {
      // Make API request to update role permissions
      const response = await fetch(`/api/auth/roles/${currentRole.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permissionIds: selectedPermissions })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update role permissions');
      }
      
      // Show success message
      enqueueSnackbar(`Permissions updated for role "${currentRole.displayName}"`, {variant: "success"});
      
      // Close dialog
      handleCloseRolePermissionsDialog();
    } catch (error) {
      console.error(error)
      enqueueSnackbar(`Failed to load permissions and roles: ` + error, {variant: 'error'});

      // handleApiError(error);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Permission Management
      </Typography>
      
      <Grid container spacing={3}>
        {/* Permissions Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Permissions</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenPermissionDialog()}
              >
                Add Permission
              </Button>
            </Box>
            
            <TextField
              fullWidth
              placeholder="Search permissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredPermissions.length === 0 ? (
              <Alert severity="info">No permissions found</Alert>
            ) : (
              <Box>
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <Box key={category} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">{category}</Typography>
                    </Box>
                    
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Display Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {categoryPermissions.map(permission => (
                            <TableRow key={permission.id}>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {permission.name}
                                </Typography>
                              </TableCell>
                              <TableCell>{permission.displayName}</TableCell>
                              <TableCell>{permission.description}</TableCell>
                              <TableCell align="right">
                                <Tooltip title="Edit">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleOpenPermissionDialog(permission)}
                                    color="primary"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeletePermission(permission)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Roles Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Roles</Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : roles.length === 0 ? (
              <Alert severity="info">No roles found</Alert>
            ) : (
              <List>
                {roles.map(role => (
                  <React.Fragment key={role.id}>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={role.displayName}
                        secondary={role.description}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Manage Permissions">
                          <IconButton
                            edge="end"
                            onClick={() => handleOpenRolePermissionsDialog(role)}
                          >
                            <LockOpenIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={() => navigate('/admin/roles')}
              >
                Manage Roles
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Permission Dialog */}
      <Dialog
        open={openPermissionDialog}
        onClose={handleClosePermissionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentPermission ? 'Edit Permission' : 'Create Permission'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={permissionForm.name}
            onChange={handlePermissionFormChange}
            margin="normal"
            required
            helperText="Unique identifier for this permission (e.g., entity.create)"
            disabled={!!currentPermission}
          />
          <TextField
            fullWidth
            label="Display Name"
            name="displayName"
            value={permissionForm.displayName}
            onChange={handlePermissionFormChange}
            margin="normal"
            required
            helperText="Human-readable name"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={permissionForm.description}
            onChange={handlePermissionFormChange}
            margin="normal"
            multiline
            rows={3}
            helperText="Optional description of what this permission allows"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermissionDialog}>Cancel</Button>
          <Button
            onClick={handleSavePermission}
            variant="contained"
            color="primary"
          >
            {currentPermission ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Role Permissions Dialog */}
      <Dialog
        open={openRolePermissionsDialog}
        onClose={handleCloseRolePermissionsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentRole && `Manage Permissions for ${currentRole.displayName}`}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <Grid item xs={12} key={category}>
                  <Card variant="outlined">
                    <CardHeader
                      title={category}
                      avatar={<CategoryIcon />}
                    />
                    <Divider />
                    <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
                      <List dense>
                        {categoryPermissions.map(permission => (
                          <ListItem key={permission.id}>
                            <ListItemIcon>
                              {selectedPermissions.includes(permission.id) ? (
                                <LockOpenIcon color="primary" />
                              ) : (
                                <LockIcon color="disabled" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={permission.displayName}
                              secondary={permission.description}
                            />
                            <ListItemSecondaryAction>
                              <Switch
                                edge="end"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => handleTogglePermission(permission.id)}
                                color="primary"
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRolePermissionsDialog}>Cancel</Button>
          <Button
            onClick={handleSaveRolePermissions}
            variant="contained"
            color="primary"
          >
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PermissionManagementPage;