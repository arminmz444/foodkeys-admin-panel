// // // /* -----------------------------------------
// // //  * MessageManagerApp.tsx
// // //  * -----------------------------------------
// // //  */
// // // import React, { useState, useEffect } from 'react';
// // // import { Box, Button, Typography, TextField } from '@mui/material';
// // // import MessageTable from './MessageManagerAppTable';
// // // import MessageCreateDialog from './MessageAppCreateDialog';


// // // function MessageManagerApp() {
// // //   const [messages, setMessages] = useState([]);
// // //   const [openDialog, setOpenDialog] = useState(false);
// // //   const [searchText, setSearchText] = useState('');

// // //   // Example: fetch messages from mock or real API
// // //   useEffect(() => {
// // //     // mock fetch
// // //     const fakeData = [
// // //       {
// // //         id: 1,
// // //         medium: 'SMS',
// // //         content: 'Hello, your request is approved.',
// // //         recipients: 'username:alice',
// // //         status: 'SENT',
// // //         createdAt: '2025-03-01 10:00',
// // //         createdBy: 'admin',
// // //       },
// // //       {
// // //         id: 2,
// // //         medium: 'Email',
// // //         content: 'Please review your submission details.',
// // //         recipients: 'role:EXPERT',
// // //         status: 'SENT',
// // //         createdAt: '2025-03-01 10:15',
// // //         createdBy: 'admin',
// // //       },
// // //     ];
// // //     setMessages(fakeData);
// // //   }, []);

// // //   const handleOpenDialog = () => setOpenDialog(true);
// // //   const handleCloseDialog = () => setOpenDialog(false);

// // //   // Example: add a newly created message
// // //   const handleMessageCreated = (newMessage) => {
// // //     setMessages((prev) => [...prev, newMessage]);
// // //   };

// // //   // Example: filter messages by search text
// // //   const filteredMessages = messages.filter((msg) =>
// // //     msg.content.toLowerCase().includes(searchText.toLowerCase())
// // //   );

// // //   return (
// // //     <Box className="w-full h-full flex flex-col p-4">
// // //       {/* Title and "New Message" button */}
// // //       <Box className="flex items-center justify-between mb-4">
// // //         <Typography variant="h6">Message Manager</Typography>
// // //         <Button variant="contained" onClick={handleOpenDialog}>
// // //           New Message
// // //         </Button>
// // //       </Box>

// // //       {/* Search bar */}
// // //       <Box className="mb-4 flex space-x-2">
// // //         <TextField
// // //           label="Search messages"
// // //           size="small"
// // //           value={searchText}
// // //           onChange={(e) => setSearchText(e.target.value)}
// // //         />
// // //       </Box>

// // //       {/* Table of messages */}
// // //       <MessageTable messages={filteredMessages} />

// // //       {/* Dialog for creating a new message */}
// // //       {openDialog && (
// // //         <MessageCreateDialog
// // //           open={openDialog}
// // //           onClose={handleCloseDialog}
// // //           onCreate={handleMessageCreated}
// // //         />
// // //       )}
// // //     </Box>
// // //   );
// // // }

// // // export default MessageManagerApp;


// // import { Box, Tabs, Tab } from '@mui/material';
// // import { useState } from 'react';
// // import EmailTemplates from './components/EmailTemplatesContent';
// // import SmsTemplates from './components/SmsTemplatesContent';

// // function CustomTabPanel(props) {
// //   const { children, value, index, ...other } = props;

// //   return (
// //     <div
// //       role="tabpanel"
// //       hidden={value !== index}
// //       id={`simple-tabpanel-${index}`}
// //       aria-labelledby={`simple-tab-${index}`}
// //       {...other}
// //     >
// //       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
// //     </div>
// //   );
// // }

// // function a11yProps(index) {
// //   return {
// //     id: `simple-tab-${index}`,
// //     'aria-controls': `simple-tabpanel-${index}`,
// //   };
// // }

// // export default function MessageManagerApp() {
// //   const [value, setValue] = useState(0);

// //   const handleChange = (event, newValue) => {
// //     setValue(newValue);
// //   };
// //   return (
// //     <main className="min-h-screen">
// //       <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
// //         <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
// //           <Tab label="Item One" {...a11yProps(0)} />
// //           <Tab label="Item Two" {...a11yProps(1)} />
// //           <Tab label="Item Three" {...a11yProps(2)} />
// //         </Tabs>
// //       </Box>
// //       <CustomTabPanel value={value} index={0}>
// //         <EmailTemplates />
// //       </CustomTabPanel>
// //       <CustomTabPanel value={value} index={1}>
// //         <SmsTemplates />
// //       </CustomTabPanel>
// //       <CustomTabPanel value={value} index={2}>
// //         Item Three
// //       </CustomTabPanel>
// //     </main>
// //   )
// // }


// import { useState } from "react"
// import { styled } from "@mui/material/styles"
// import { Tabs, Tab, Box } from "@mui/material"
// import EmailTemplatesContent from "./EmailTemplatesContent"
// import SmsTemplatesContent from "./SmsTemplatesContent"
// import withReducer from "app/store/withReducer"
// import reducer from "./store"

// const Root = styled("div")(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   flex: "1 1 auto",
//   width: "100%",
//   height: "100%",
//   backgroundColor: theme.palette.background.default,
// }))

// const TabPanel = (props) => {
//   const { children, value, index, ...other } = props

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`messaging-tabpanel-${index}`}
//       aria-labelledby={`messaging-tab-${index}`}
//       {...other}
//       style={{ flex: 1, display: "flex", flexDirection: "column" }}
//     >
//       {value === index && <Box sx={{ flex: 1, display: "flex" }}>{children}</Box>}
//     </div>
//   )
// }

// function MessagingApp() {
//   const [tabValue, setTabValue] = useState(0)

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue)
//   }

//   return (
//     <Root>
//       <Tabs
//         value={tabValue}
//         onChange={handleTabChange}
//         indicatorColor="primary"
//         textColor="primary"
//         variant="fullWidth"
//         aria-label="messaging tabs"
//         sx={{ borderBottom: 1, borderColor: "divider" }}
//       >
//         <Tab label="قالب ایمیل" />
//         <Tab label="قالب پیام کوتاه" />
//         <Tab label="قالب‌های تلگرام" />
//         <Tab label="قالب‌ پیام‌های واتس‌اپ" />
//       </Tabs>
//       <TabPanel value={tabValue} index={0}>
//         <SmsTemplatesContent />
//       </TabPanel>
//       <TabPanel value={tabValue} index={1}>
//         <EmailTemplatesContent />
//       </TabPanel>

      
//     </Root>
//   )
// }

// export default withReducer("messagingApp", reducer)(MessagingApp)

import { useState } from "react"
import { styled } from "@mui/material/styles"
import { Tabs, Tab, Box } from "@mui/material"
import EmailTemplatesContent from "./EmailTemplatesContent"
import SmsTemplatesContent from "./SmsTemplatesContent"
import withReducer from "app/store/withReducer"
import reducer from "./store"
import FuseLoading from "@fuse/core/FuseLoading"

const Root = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: "1 1 auto",
  width: "100%",
  height: "100%",
  backgroundColor: theme.palette.background.default,
}))

const TabPanel = (props) => {
  const { children, value, index, ...other } = props
const [smsTemplatesLoading, setSmsTemplatesLoading] = useState(false)
const [emailTemplatesLoading, setEmailTemplatesLoading] = useState(true)
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`messaging-tabpanel-${index}`}
      aria-labelledby={`messaging-tab-${index}`}
      {...other}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      {value === index && <Box sx={{ flex: 1, display: "flex" }}>{children}</Box>}
    </div>
  )
}

function MessagingApp() {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Root>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="messaging tabs"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="قالب‌های ایمیل" />
        <Tab label="قالب‌های پیامک" />
      </Tabs>

      {tabValue === 0 && <TabPanel value={tabValue} index={0}>
        <EmailTemplatesContent setEmailTemplatesLoading={setLoading} />
      </TabPanel>}

      {tabValue === 1 && <TabPanel value={tabValue} index={1}>
        <SmsTemplatesContent setSmsTemplatesLoading={setLoading}/>
      </TabPanel>}
    </Root>
  )
}

export default withReducer("messagingApp", reducer)(MessagingApp)

