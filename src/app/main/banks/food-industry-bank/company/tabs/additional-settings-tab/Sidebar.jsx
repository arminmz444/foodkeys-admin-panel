import React from 'react';
import { Notebook as Robot, Book, Key, FileText, LogIn as Login, Server as CloudServer, File as Profile, MessageCircleQuestion as QuestionCircle, Asterisk as Cluster, Mail, Table, File, Globe, AirVentIcon as Environment, Option as Partition, File as Mobile, Radiation as Notification, PocketKnife as Safety, Settings as Setting, Columns as BgColors, IceCream as Team, CheckCircle } from 'lucide-react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';

const menuItems = [
  { id: 'ai-integration', title: 'AI integration', icon: <Robot className="w-5 h-5" /> },
  { id: 'api-doc', title: 'API documentation', icon: <Book className="w-5 h-5" /> },
  { id: 'api-keys', title: 'API keys', icon: <Key className="w-5 h-5" /> },
  { id: 'audit-logger', title: 'Audit logs', icon: <FileText className="w-5 h-5" /> },
  { id: 'auth', title: 'Authentication', icon: <Login className="w-5 h-5" /> },
  { id: 'backups', title: 'Backup manager', icon: <CloudServer className="w-5 h-5" /> },
  { id: 'block-templates', title: 'Block templates', icon: <Profile className="w-5 h-5" /> },
  { id: 'custom-brand', title: 'Custom brand', icon: <QuestionCircle className="w-5 h-5" /> },
  { id: 'data-source-manager', title: 'Data sources', icon: <Cluster className="w-5 h-5" /> },
  { id: 'email-manager', title: 'Email settings', icon: <Mail className="w-5 h-5" /> },
  { id: 'environment', title: 'Variables and secrets', icon: <Table className="w-5 h-5" /> },
  { id: 'file-manager', title: 'File manager', icon: <File className="w-5 h-5" /> },
  { id: 'localization', title: 'Localization', icon: <Globe className="w-5 h-5" /> },
  { id: 'logger', title: 'Logger', icon: <FileText className="w-5 h-5" /> },
  { id: 'map', title: 'Map manager', icon: <Environment className="w-5 h-5" /> },
  { id: 'migration-manager', title: 'Migration manager', icon: <CloudServer className="w-5 h-5" /> },
  { id: 'mobile', title: 'Mobile', icon: <Mobile className="w-5 h-5" /> },
  { id: 'notification-manager', title: 'Notification manager', icon: <Notification className="w-5 h-5" /> },
  { id: 'public-forms', title: 'Public forms', icon: <Table className="w-5 h-5" /> },
  { id: 'routes', title: 'Routes', icon: <Partition className="w-5 h-5" /> },
  { id: 'security', title: 'Security', icon: <Safety className="w-5 h-5" /> },
  { id: 'system-settings', title: 'System settings', icon: <Setting className="w-5 h-5" /> },
  { id: 'theme-editor', title: 'Theme editor', icon: <BgColors className="w-5 h-5" /> },
  { id: 'users-permissions', title: 'Users & Permissions', icon: <Team className="w-5 h-5" /> },
  { id: 'verification', title: 'Verification', icon: <CheckCircle className="w-5 h-5" /> },
  { id: 'workflow', title: 'Workflow', icon: <Partition className="w-5 h-5" /> },
];

export default function Sidebar() {
  const [selectedItem, setSelectedItem] = React.useState('users-permissions');

  return (
    <Box sx={{ 
      width: '100%',
      bgcolor: 'background.paper',
      height: '100vh',
      overflowY: 'auto',
      borderRight: 1,
      borderColor: 'divider'
    }}>
      <Box sx={{ p: 2 }}>
        <List sx={{ width: '100%' }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedItem === item.id}
                onClick={() => setSelectedItem(item.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.lighter',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.lighter',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body2">
                      {item.title}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}