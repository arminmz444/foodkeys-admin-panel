import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  Drawer,
  TextField,
  Typography,
} from '@mui/material';
import {
  Users,
  Building2,
  Shield,
  RefreshCw,
  Plus,
  MoreVertical,
  ShieldCheck,
  Users2,
  X
} from 'lucide-react';



function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState(2);
  const [roleType, setRoleType] = useState('Independent roles');
  const [permissionTab, setPermissionTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleDisplayName, setRoleDisplayName] = useState('');
  const [roleUID, setRoleUID] = useState('r_sl8vlo4ca9e');
  const [isDefaultRole, setIsDefaultRole] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    // Reset form
    setRoleDisplayName('');
    setIsDefaultRole(false);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      roleDisplayName,
      roleUID,
      isDefaultRole
    });
    handleDrawerClose();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Users & Permissions</h1>
        
        <div className="bg-white rounded-lg shadow">
          {/* Main Tabs */}
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            className="border-b"
          >
            <Tab
              icon={<Users className="w-4 h-4 mr-2" />}
              label="Users"
              iconPosition="start"
            />
            <Tab
              icon={<Building2 className="w-4 h-4 mr-2" />}
              label="Departments"
              iconPosition="start"
            />
            <Tab
              icon={<Shield className="w-4 h-4 mr-2" />}
              label="Roles & Permissions"
              iconPosition="start"
            />
            <Tab
              icon={<RefreshCw className="w-4 h-4 mr-2" />}
              label="Synchronize"
              iconPosition="start"
            />
          </Tabs>

          {/* Roles & Permissions Content */}
          <TabPanel value={selectedTab} index={2}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="contained"
                  startIcon={<Plus className="w-4 h-4" />}
                  className="bg-blue-500"
                  onClick={handleDrawerOpen}
                >
                  New role
                </Button>
                <Select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className="w-48"
                >
                  <MenuItem value="Independent roles">Independent roles</MenuItem>
                  <MenuItem value="Hierarchical roles">Hierarchical roles</MenuItem>
                </Select>
              </div>

              <div className="flex gap-6">
                {/* Roles List */}
                <div className="w-1/4">
                  <div className="bg-blue-50 p-4 rounded-lg mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Admin</span>
                    </div>
                    <IconButton size="small" onClick={handleMenuClick}>
                      <MoreVertical className="w-4 h-4" />
                    </IconButton>
                  </div>
                  <div className="p-4 rounded-lg flex items-center justify-between border">
                    <div className="flex items-center">
                      <Users2 className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Member</span>
                    </div>
                    <span className="text-green-500 text-sm">Default</span>
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="w-3/4">
                  <Tabs
                    value={permissionTab}
                    onChange={(_, newValue) => setPermissionTab(newValue)}
                    className="mb-6"
                  >
                    <Tab label="Permissions" />
                    <Tab label="Users" />
                    <Tab label="Departments" />
                  </Tabs>

                  <div className="bg-white rounded-lg">
                    <Tabs
                      value={0}
                      className="border-b"
                    >
                      <Tab label="System" />
                      <Tab label="Data sources" />
                      <Tab label="Desktop routes" />
                      <Tab label="Mobile routes" />
                    </Tabs>

                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-4">Configure permissions:</h3>
                      <div className="space-y-3">
                        <FormControlLabel
                          control={<Checkbox defaultChecked />}
                          label="Allows to configure interface"
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Allows to install, activate, disable plugins"
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Allows to configure plugins"
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Allows to clear cache, reboot application"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </div>
      </div>

      {/* Role Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>

      {/* New Role Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: '500px' }
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Typography variant="h6" component="h2">
              New role
            </Typography>
            <IconButton onClick={handleDrawerClose} size="small">
              <X className="w-5 h-5" />
            </IconButton>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2">
                <span className="text-gray-700">Role display name</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <TextField
                fullWidth
                value={roleDisplayName}
                onChange={(e) => setRoleDisplayName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">Role UID</label>
              <TextField
                fullWidth
                value={roleUID}
                onChange={(e) => setRoleUID(e.target.value)}
                helperText="Randomly generated and can be modified. Support letters, numbers and underscores, must start with a letter."
              />
            </div>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isDefaultRole}
                  onChange={(e) => setIsDefaultRole(e.target.checked)}
                />
              }
              label="Default role"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t flex justify-end space-x-3">
            <Button
              variant="outlined"
              onClick={handleDrawerClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              className="bg-blue-500"
              disabled={!roleDisplayName}
            >
              Submit
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}