// ActivityLogManagerPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


function ActivityLogManagerApp() {
  const [logs, setLogs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Placeholder: fetch activity logs from API
    const fakeLogs = [
      { id: 1, activity: 'Login', user: 'alice', date: '2025-03-01', details: 'User logged in' },
      { id: 2, activity: 'Data Update', user: 'bob', date: '2025-03-02', details: 'Updated record #42' },
    ];
    setLogs(fakeLogs);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.activity.toLowerCase().includes(searchText.toLowerCase()) &&
    (selectedDate ? log.date === selectedDate : true)
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'activity', headerName: 'Activity', width: 150 },
    { field: 'user', headerName: 'User', width: 130 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'details', headerName: 'Details', width: 300 },
  ];

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Activity Log Manager</Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField 
          label="Search Activity" 
          variant="outlined" 
          size="small" 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginRight: 16 }}
        />
        <TextField 
          label="Select Date" 
          type="date"
          variant="outlined" 
          size="small"
          InputLabelProps={{ shrink: true }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ marginRight: 16 }}
        />
        <Button variant="contained" color="primary">Configure</Button>
      </Box>
      <Paper style={{ height: 400, width: '100%' }}>
        <DataGrid rows={filteredLogs} columns={columns} pageSize={5} />
      </Paper>
    </Box>
  );
}

export default ActivityLogManagerApp;