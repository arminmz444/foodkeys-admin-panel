/* -----------------------------------------
 * TopBar.tsx
 * -----------------------------------------
 */
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

function TopBar() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar className="flex justify-between">
        <Box className="flex items-center space-x-4">
          <Typography variant="h6" noWrap>
            Workflow Builder
          </Typography>
          {/* Example: top-level items from the screenshot */}
          <Button>Design</Button>
          <Button>Variables</Button>
          <Button>Submissions</Button>
          <Button>Analytics</Button>
          <Button>Preview</Button>
        </Box>

        {/* Right side actions */}
        <Box>
          <Button variant="contained" color="primary">
            Publish
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;