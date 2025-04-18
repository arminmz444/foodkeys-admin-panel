// LeftSidebarNavigation.tsx
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ActivityIcon from '@mui/icons-material/EventNote';
import ArchiveIcon from '@mui/icons-material/Archive';
import ApiIcon from '@mui/icons-material/Http';

function LeftSidebarNavigation() {
  const navigate = useNavigate();

  return (
    <List style={{ maxWidth: '250px' }}>
      <ListItem button onClick={() => navigate('/apps/activity-log-manager')}>
        <ListItemIcon><ActivityIcon /></ListItemIcon>
        <ListItemText primary="Activity Log Manager" />
      </ListItem>
      <ListItem button onClick={() => navigate('/apps/archive-manager')}>
        <ListItemIcon><ArchiveIcon /></ListItemIcon>
        <ListItemText primary="Archive Manager" />
      </ListItem>
      <ListItem button onClick={() => navigate('/apps/service-api-generator')}>
        <ListItemIcon><ApiIcon /></ListItemIcon>
        <ListItemText primary="Service API Generator" />
      </ListItem>
      <Divider />
      {/* Other navigation items can be added here */}
    </List>
  );
}

export default LeftSidebarNavigation