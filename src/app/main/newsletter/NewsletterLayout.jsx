// src/app/modules/newsletter/NewsletterLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function NewsletterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define all possible tab routes
  const tabs = [
    {
      label: 'داشبورد',
      icon: 'heroicons-outline:chart-bar',
      path: '/newsletters/dashboard'
    },
    {
      label: 'همه خبرنامه‌ها',
      icon: 'heroicons-outline:mail',
      path: '/newsletters'
    },
    // {
    //   label: 'در انتظار',
    //   icon: 'heroicons-outline:clock',
    //   path: '/newsletters/pending'
    // },
    {
      label: 'مشترکین',
      icon: 'heroicons-outline:users',
      path: '/newsletters/subscribers'
    }
  ];
  
  // Find the current active tab based on location.pathname
  const getCurrentTab = () => {
    // For edit/new/detail pages, we should still highlight the All Newsletters tab
    if (location.pathname.includes('/newsletters/edit/') || 
        location.pathname.includes('/newsletters/detail/') ||
        location.pathname === '/newsletters/new') {
      return 1; // Index of All Newsletters tab
    }
    
    const currentTab = tabs.findIndex(tab => tab.path === location.pathname);
    return currentTab !== -1 ? currentTab : 0;
  };
  
  const [value, setValue] = useState(getCurrentTab());

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(tabs[newValue].path);
  };

  return (
    <div className="flex flex-col flex-1">
      <Paper className="sticky top-0 z-10 shadow-sm">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className="border-b-1 border-b-gray-200 dark:border-b-gray-700"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={<FuseSvgIcon>{tab.icon}</FuseSvgIcon>}
              iconPosition="start"
              className="min-w-160 min-h-64"
            />
          ))}
        </Tabs>
      </Paper>
      
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default NewsletterLayout;