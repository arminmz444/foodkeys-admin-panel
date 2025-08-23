import { useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded/index.js';
import { useDeepCompareEffect } from '@fuse/hooks/index.js';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/index.js';
import HomePageTab from './tabs/HomePageTab';
import CareerPageTab from './tabs/CareerPageTab';
import FAQPageTab from './tabs/FAQPageTab';
import GuidePageTab from './tabs/GuidePageTab';
import ContactPageTab from './tabs/ContactPageTab';

function WebsiteConfig() {
  const [selectedTab, setSelectedTab] = useState(0);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  const tabs = [
    {
      id: 'homepage',
      label: 'صفحه اول',
      icon: 'heroicons-outline:home',
      component: <HomePageTab />
    },
    {
      id: 'career',
      label: 'مسیرهای شغلی',
      icon: 'heroicons-outline:briefcase',
      component: <CareerPageTab />
    },
    {
      id: 'faq',
      label: 'سوالات متداول',
      icon: 'heroicons-outline:question-mark-circle',
      component: <FAQPageTab />
    },
    {
      id: 'guide',
      label: 'راهنما و درباره ما',
      icon: 'heroicons-outline:book-open',
      component: <GuidePageTab />
    },
    {
      id: 'contact',
      label: 'تماس با ما',
      icon: 'heroicons-outline:phone',
      component: <ContactPageTab />
    }
  ];

  return (
    <FusePageCarded
      header={
        <div className="flex flex-col sm:flex-row flex-0 sm:items-center sm:justify-between p-24 sm:py-32">
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                تنظیمات سایت
              </Typography>
              <Typography
                variant="caption"
                className="font-medium"
              >
                مدیریت محتوای صفحات مختلف سایت
              </Typography>
            </motion.div>
          </div>
        </div>
      }
      content={
        <div className="w-full px-24 md:px-32">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons="auto"
            className="w-full h-64 border-b-1"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.id}
                className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                disableRipple
                label={
                  <div className="flex items-center space-x-6 space-x-reverse">
                    <FuseSvgIcon size={16}>{tab.icon}</FuseSvgIcon>
                    <span>{tab.label}</span>
                  </div>
                }
              />
            ))}
          </Tabs>

          <div className="p-16 sm:p-24 max-w-2xl w-full mx-auto">
            {tabs[selectedTab]?.component}
          </div>
        </div>
      }
      scroll="content"
    />
  );
}

export default WebsiteConfig;