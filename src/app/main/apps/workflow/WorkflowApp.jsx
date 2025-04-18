/* -----------------------------------------
 * WorkflowBuilderApp.tsx
 * -----------------------------------------
 */
import React from 'react';
import { Box, Tabs, Tab, IconButton, Typography, Button } from '@mui/material';
import { useState } from 'react';
import TopBar from './TopBar';
import LeftSidebarTabs from './LeftSidebarTabs';
import RightPreviewPanel from './RightPreviewPanel';
import WorkflowCanvas from './WorkflowCanvas';
import LeftSidebarNavigation from './LeftSidebarNavigation';

function WorkflowApp() {
  // We store which left tab is selected: "forms", "logics", "data"
  const [sidebarTab, setSidebarTab] = useState('forms');

  return (
    <Box className="w-full h-full flex flex-col" /* tailwind utility classes */>
      {/* Top bar with headings */}
      <TopBar />

      {/* <div style={{ display: 'flex' }}>
        <LeftSidebarNavigation />
        </div> */}
      <Box className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebarNavigation />
        <LeftSidebarTabs
          selectedTab={sidebarTab}
          onTabChange={(tab) => setSidebarTab(tab)}
        />

        {/* Main workflow canvas */}
        <Box className="flex-1 relative overflow-hidden">
          <WorkflowCanvas />
        </Box>

        {/* Right preview panel */}
        <RightPreviewPanel />
      </Box>
    </Box>
  );
}

export default WorkflowApp;