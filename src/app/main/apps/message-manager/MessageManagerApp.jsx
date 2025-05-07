// import { useState } from "react"
// import { styled } from "@mui/material/styles"
// import { Tabs, Tab, Box } from "@mui/material"
// import EmailTemplatesContent from "./EmailTemplatesContent"
// import SmsTemplatesContent from "./SmsTemplatesContent"
// import withReducer from "app/store/withReducer"
// import reducer from "./store"
// import FuseLoading from "@fuse/core/FuseLoading"

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
// const [smsTemplatesLoading, setSmsTemplatesLoading] = useState(false)
// const [emailTemplatesLoading, setEmailTemplatesLoading] = useState(true)
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
//   const [loading, setLoading] = useState(true)

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
//         <Tab label="قالب‌های ایمیل" />
//         <Tab label="قالب‌های پیامک" />
//       </Tabs>

//       {tabValue === 0 && <TabPanel value={tabValue} index={0}>
//         <EmailTemplatesContent setEmailTemplatesLoading={setLoading} />
//       </TabPanel>}

//       {tabValue === 1 && <TabPanel value={tabValue} index={1}>
//         <SmsTemplatesContent setSmsTemplatesLoading={setLoading}/>
//       </TabPanel>}
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

      {/* Pre-render both tabs to avoid loading delay when switching */}
      <TabPanel value={tabValue} index={0}>
        <EmailTemplatesContent />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <SmsTemplatesContent />
      </TabPanel>
    </Root>
  )
}

export default withReducer("messagingApp", reducer)(MessagingApp)