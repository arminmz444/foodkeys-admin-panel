// ArchiveManagerPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


function ArchiveManagerApp() {
  const [archives, setArchives] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Placeholder: fetch archives from API
    const fakeArchives = [
      { id: 1, entityName: 'Order', connectorFieldValue: '12345', details: 'Archived order details', archivedAt: '2025-03-01 12:00' },
      { id: 2, entityName: 'Invoice', connectorFieldValue: '67890', details: 'Archived invoice details', archivedAt: '2025-03-02 09:30' },
    ];
    setArchives(fakeArchives);
  }, []);

  const filteredArchives = archives.filter(a => 
    a.entityName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'entityName', headerName: 'Entity', width: 150 },
    { field: 'connectorFieldValue', headerName: 'Connector Value', width: 150 },
    { field: 'details', headerName: 'Details', width: 300 },
    { field: 'archivedAt', headerName: 'Archived At', width: 150 },
  ];

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Archive Manager</Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField 
          label="Search Archives" 
          variant="outlined" 
          size="small" 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginRight: 16 }}
        />
        <Button variant="contained" color="primary">Configure Archives</Button>
      </Box>
      <Paper style={{ height: 400, width: '100%' }}>
        <DataGrid rows={filteredArchives} columns={columns} pageSize={5} />
      </Paper>
    </Box>
  );
}

export default ArchiveManagerApp;