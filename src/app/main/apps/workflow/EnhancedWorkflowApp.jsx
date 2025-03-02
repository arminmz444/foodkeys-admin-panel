// EnhancedWorkflowBuilderApp.tsx
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import TopBar from './TopBar';
import LeftSidebarTabs from './LeftSidebarTabs';
import WorkflowCanvas from '../workflow-builder/WorkflowCanvas';
import WorkflowSettingsPage from './WorkflowSettingsPage';

function EnhancedWorkflowBuilderApp() {
  // sidebarTab: "forms", "logics", "data", etc.
  const [sidebarTab, setSidebarTab] = useState<'forms' | 'logics' | 'data'>('forms');
  // Toggle for settings view (when settings button is clicked in TopBar)
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Box className="w-full h-full flex flex-col">
      <TopBar onSettingsClick={() => setShowSettings(true)} />
      {showSettings ? (
        // Full–width settings view replaces left/right panels when active
        <WorkflowSettingsPage onClose={() => setShowSettings(false)} />
      ) : (
        <Box className="flex flex-1 overflow-hidden">
          <LeftSidebarTabs selectedTab={sidebarTab} onTabChange={setSidebarTab} />
          <Box className="flex-1 relative overflow-hidden">
            <WorkflowCanvas />
          </Box>
          {/* You might still want a preview/property panel on the right */}
          {/* <RightPreviewPanel /> */}
        </Box>
      )}
    </Box>
  );
}

export default EnhancedWorkflowBuilderApp;