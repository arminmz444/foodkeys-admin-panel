import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  CircularProgress,
  Divider
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  useGetRolesListQuery,
  useGetAccessesListQuery,
  useGetUserRolesQuery,
  useGetUserAccessesQuery,
  useAddRoleToUserMutation,
  useRemoveRoleFromUserMutation,
  useAddAccessToUserMutation,
  useRemoveAccessFromUserMutation,
  useUpdateUserAccessesMutation
} from "./UserApi";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch } from "app/store/hooks";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-permissions-tabpanel-${index}`}
      aria-labelledby={`user-permissions-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `user-permissions-tab-${index}`,
    'aria-controls': `user-permissions-tabpanel-${index}`,
  };
}

/**
 * Component for managing user roles and accesses
 */
function RoleAccessManagement({ userId }) {
  const [tabValue, setTabValue] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedAccesses, setSelectedAccesses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const dispatch = useAppDispatch();

  // API queries
  const { data: rolesList = { data: [] }, isLoading: isLoadingRoles } = useGetRolesListQuery();
  const { data: accessesList = { data: [] }, isLoading: isLoadingAccesses } = useGetAccessesListQuery();
  const { data: userRoles = { data: [] }, isLoading: isLoadingUserRoles, refetch: refetchUserRoles } = useGetUserRolesQuery(userId);
  const { data: userAccesses = { data: [] }, isLoading: isLoadingUserAccesses, refetch: refetchUserAccesses } = useGetUserAccessesQuery(userId);

  // API mutations
  const [addRoleToUser] = useAddRoleToUserMutation();
  const [removeRoleFromUser] = useRemoveRoleFromUserMutation();
  const [addAccessToUser] = useAddAccessToUserMutation();
  const [removeAccessFromUser] = useRemoveAccessFromUserMutation();
  const [updateUserAccesses] = useUpdateUserAccessesMutation();

  // Set selected roles and accesses when data is loaded
  useEffect(() => {
    if (userRoles?.data) {
      const roleIds = rolesList?.data?.filter(role => 
        userRoles.data.includes(role.name)
      ).map(role => role.id);
      setSelectedRoles(roleIds || []);
    }
  }, [userRoles, rolesList]);

  useEffect(() => {
    if (userAccesses?.data) {
      const accessIds = accessesList?.data?.filter(access => 
        userAccesses.data.includes(access.name)
      ).map(access => access.id);
      setSelectedAccesses(accessIds || []);
    }
  }, [userAccesses, accessesList]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRoleToggle = (roleId) => {
    const currentIndex = selectedRoles.indexOf(roleId);
    const newSelectedRoles = [...selectedRoles];

    if (currentIndex === -1) {
      newSelectedRoles.push(roleId);
    } else {
      newSelectedRoles.splice(currentIndex, 1);
    }
    
    setSelectedRoles(newSelectedRoles);
  };

  const handleAccessToggle = (accessId) => {
    const currentIndex = selectedAccesses.indexOf(accessId);
    const newSelectedAccesses = [...selectedAccesses];

    if (currentIndex === -1) {
      newSelectedAccesses.push(accessId);
    } else {
      newSelectedAccesses.splice(currentIndex, 1);
    }
    
    setSelectedAccesses(newSelectedAccesses);
  };

  const openDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleSaveRoles = async () => {
    try {
      setConfirmLoading(true);
      
      // Get roles that need to be added and removed
      const currentRoleIds = rolesList?.data?.filter(role => 
        userRoles.data.includes(role.name)
      ).map(role => role.id) || [];
      
      const rolesToAdd = selectedRoles.filter(id => !currentRoleIds.includes(id));
      const rolesToRemove = currentRoleIds.filter(id => !selectedRoles.includes(id));
      
      // Add new roles
      for (const roleId of rolesToAdd) {
        await addRoleToUser({ userId, roleId }).unwrap();
      }
      
      // Remove roles
      for (const roleId of rolesToRemove) {
        await removeRoleFromUser({ userId, roleId }).unwrap();
      }
      
      await refetchUserRoles();
      dispatch(showMessage({ message: "نقش‌های کاربر با موفقیت بروزرسانی شد" }));
    } catch (error) {
      console.error(error);
      dispatch(showMessage({ 
        message: "خطا در بروزرسانی نقش‌های کاربر", 
        variant: "error" 
      }));
    } finally {
      setConfirmLoading(false);
      setDialogOpen(false);
    }
  };

  const handleSaveAccesses = async () => {
    try {
      setConfirmLoading(true);
      
      await updateUserAccesses({
        userId,
        accesses: selectedAccesses.map(id => ({ id }))
      }).unwrap();
      
      await refetchUserAccesses();
      dispatch(showMessage({ message: "دسترسی‌های کاربر با موفقیت بروزرسانی شد" }));
    } catch (error) {
      console.error(error);
      dispatch(showMessage({ 
        message: "خطا در بروزرسانی دسترسی‌های کاربر", 
        variant: "error" 
      }));
    } finally {
      setConfirmLoading(false);
      setDialogOpen(false);
    }
  };

  const isLoading = isLoadingRoles || isLoadingAccesses || isLoadingUserRoles || isLoadingUserAccesses;

  const filterItems = (items, searchText) => {
    if (!searchText) return items;
    return items.filter(item => 
      (item.name && item.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.displayName && item.displayName.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  const filteredRoles = filterItems(rolesList?.data || [], searchText);
  const filteredAccesses = filterItems(accessesList?.data || [], searchText);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="user permissions tabs"
            indicatorColor="secondary"
            textColor="secondary"
          >
            <Tab label="نقش‌های کاربر" {...a11yProps(0)} />
            <Tab label="دسترسی‌های کاربر" {...a11yProps(1)} />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="جستجو"
            placeholder="جستجو بر اساس نام یا عنوان نمایشی"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <FuseSvgIcon color="action" size={20}>
                  heroicons-outline:search
                </FuseSvgIcon>
              ),
            }}
          />
        </Box>

        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <List sx={{ width: '100%' }}>
                {filteredRoles.map((role) => {
                  const isSelected = selectedRoles.indexOf(role.id) !== -1;
                  const isAssigned = userRoles.data?.includes(role.name);
                  
                  return (
                    <ListItem 
                      key={role.id}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={() => handleRoleToggle(role.id)}
                          checked={isSelected}
                        />
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {role.displayName || role.name}
                            {isAssigned && (
                              <Chip 
                                size="small" 
                                label="فعال" 
                                color="success" 
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                        }
                        secondary={role.name}
                      />
                    </ListItem>
                  );
                })}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openDialog('roles')}
                >
                  ذخیره تغییرات نقش‌ها
                </Button>
              </Box>
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <List sx={{ width: '100%' }}>
                {filteredAccesses.map((access) => {
                  const isSelected = selectedAccesses.indexOf(access.id) !== -1;
                  const isAssigned = userAccesses.data?.includes(access.name);
                  
                  return (
                    <ListItem 
                      key={access.id}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={() => handleAccessToggle(access.id)}
                          checked={isSelected}
                        />
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {access.displayName || access.name}
                            {isAssigned && (
                              <Chip 
                                size="small" 
                                label="فعال" 
                                color="success" 
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                        }
                        secondary={access.name}
                      />
                    </ListItem>
                  );
                })}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openDialog('accesses')}
                >
                  ذخیره تغییرات دسترسی‌ها
                </Button>
              </Box>
            </>
          )}
        </TabPanel>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'roles' ? 'تأیید بروزرسانی نقش‌ها' : 'تأیید بروزرسانی دسترسی‌ها'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {dialogType === 'roles' 
              ? 'آیا از بروزرسانی نقش‌های کاربر اطمینان دارید؟' 
              : 'آیا از بروزرسانی دسترسی‌های کاربر اطمینان دارید؟'
            }
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {dialogType === 'roles' ? 'نقش‌های انتخاب شده:' : 'دسترسی‌های انتخاب شده:'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {dialogType === 'roles' 
                ? selectedRoles.map(id => {
                    const role = rolesList?.data?.find(r => r.id === id);
                    return role ? (
                      <Chip 
                        key={id} 
                        label={role.displayName || role.name} 
                        color="primary" 
                        variant="outlined" 
                      />
                    ) : null;
                  })
                : selectedAccesses.map(id => {
                    const access = accessesList?.data?.find(a => a.id === id);
                    return access ? (
                      <Chip 
                        key={id} 
                        label={access.displayName || access.name} 
                        color="secondary" 
                        variant="outlined" 
                      />
                    ) : null;
                  })
              }
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={confirmLoading}>
            انصراف
          </Button>
          <Button 
            onClick={dialogType === 'roles' ? handleSaveRoles : handleSaveAccesses} 
            color="secondary"
            variant="contained"
            disabled={confirmLoading}
          >
            {confirmLoading ? <CircularProgress size={24} /> : 'تأیید'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RoleAccessManagement;