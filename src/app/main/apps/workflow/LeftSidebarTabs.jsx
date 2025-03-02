/* -----------------------------------------
 * LeftSidebarTabs.tsx
 * -----------------------------------------
 */
import React from 'react';
import { Box, Tabs, Tab, Typography, List, ListItem, ListItemText } from '@mui/material';

function LeftSidebarTabs({ selectedTab, onTabChange }) {
  const handleChange = (_, newValue) => {
    onTabChange(newValue);
  };

  return (
    <Box
      className="border-r border-gray-300"
      style={{ width: 250, minWidth: 250, overflowY: 'auto' }}
    >
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Forms" value="forms" />
        <Tab label="Logics" value="logics" />
        <Tab label="Data" value="data" />
      </Tabs>

      <Box className="p-2">
        {selectedTab === 'forms' && (
          <List>
            {/* Example placeholders */}
            <ListItem button>
              <ListItemText primary="First Name Field" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Email Field" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="File Upload" />
            </ListItem>
            {/* ... */}
          </List>
        )}

        {selectedTab === 'logics' && (
          <List>
            <ListItem button>
              <ListItemText primary="Condition" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Confirmation" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Redirect" />
            </ListItem>
            {/* ... */}
          </List>
        )}

        {selectedTab === 'data' && (
          <List>
            <ListItem button>
              <ListItemText primary="Database Query" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="External API" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Custom Data Source" />
            </ListItem>
            {/* ... */}
          </List>
        )}
      </Box>
    </Box>
  );
}

export default LeftSidebarTabs;