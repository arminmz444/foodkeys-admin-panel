// MiniappManagementPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, Paper } from '@mui/material';
import MiniappTable from './MiniappsTable';
import UploadMiniappDialog from './UploadMiniappDialog';

function MiniappsManagerApp() {
  const [miniapps, setMiniapps] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Placeholder: fetch miniapps from backend API
    const fakeMiniapps = [
      {
        id: 1,
        name: 'Miniapp A',
        version: '1.0.0',
        status: 'Active',
        forcedVersion: '',
        updatedAt: '2025-03-01 12:00',
      },
      {
        id: 2,
        name: 'Miniapp B',
        version: '2.1.0',
        status: 'Under Construction',
        forcedVersion: '2.0.0',
        updatedAt: '2025-03-02 09:30',
      },
    ];
    setMiniapps(fakeMiniapps);
  }, []);

  const handleUploadCreated = (newMiniapp) => {
    setMiniapps((prev) => [...prev, newMiniapp]);
  };

  const filteredMiniapps = miniapps.filter(app =>
    app.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box className="p-4">
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h6">Miniapp Management</Typography>
        <Button variant="contained" onClick={() => setOpenUploadDialog(true)}>
          Upload Miniapp
        </Button>
      </Box>
      <Box className="mb-4">
        <TextField
          label="Search Miniapps"
          fullWidth
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>
      <Paper>
        <MiniappTable miniapps={filteredMiniapps} />
      </Paper>
      {openUploadDialog && (
        <UploadMiniappDialog
          open={openUploadDialog}
          onClose={() => setOpenUploadDialog(false)}
          onUpload={handleUploadCreated}
        />
      )}
    </Box>
  );
}

export default MiniappsManagerApp;