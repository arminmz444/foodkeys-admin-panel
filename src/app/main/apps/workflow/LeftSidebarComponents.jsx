// LeftSidebarComponents.tsx
import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';

function LeftSidebarComponents() {
  const components = [
    { type: 'logicNode', label: 'Logic Node' },
    { type: 'formNode', label: 'Form Node' },
    { type: 'serviceNode', label: 'Service API Generator' },
    { type: 'activityLogNode', label: 'Activity Log Manager' },
    { type: 'archiveNode', label: 'Archive Manager' },
    // Add more draggable items as needed.
  ];

  const handleDragStart = (event, type) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box p={2}>
      <List>
        {components.map(comp => (
          <ListItem
            key={comp.type}
            button
            draggable
            onDragStart={(e) => handleDragStart(e, comp.type)}
          >
            <ListItemText primary={comp.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default LeftSidebarComponents;