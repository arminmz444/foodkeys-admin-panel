/* -----------------------------------------
 * RightPreviewPanel.tsx
 * -----------------------------------------
 */
import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

function RightPreviewPanel() {
  return (
    <Box
      className="border-l border-gray-300 p-4"
      style={{ width: 300, minWidth: 300, overflowY: 'auto' }}
    >
      <Typography variant="h6" gutterBottom>
        Preview
      </Typography>
      {/* Example: A simple “Car Insurance” form preview */}
      <Typography variant="body1">Welcome to your Comprehensive Car Insurance quote.</Typography>

      <Box className="mt-4">
        <Typography variant="body2">Can we start with your first name?</Typography>
        <TextField size="small" fullWidth placeholder="First name" className="my-2" />
        <Button variant="contained" fullWidth>
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default RightPreviewPanel;