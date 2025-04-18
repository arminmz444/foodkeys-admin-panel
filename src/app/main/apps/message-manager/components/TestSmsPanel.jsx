// import { useState } from "react"
// import { Typography, TextField, Button, IconButton, Paper, Box } from "@mui/material"
// import { Fullscreen, AttachFile } from "@mui/icons-material"

// function TestSmsPanel() {
//   const [phoneNumber, setPhoneNumber] = useState("")

//   const handleSendTest = () => {
//     // TODO: Send SMS Here
//     alert(`Test SMS would be sent to: ${phoneNumber}`)
//   }

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         width: 280,
//         m: 3,
//         p: 2,
//         display: "flex",
//         flexDirection: "column",
//         height: "fit-content",
//       }}
//     >
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//         <Typography variant="h6">Send Test SMS</Typography>
//         <IconButton size="small">
//           <Fullscreen fontSize="small" />
//         </IconButton>
//       </Box>

//       <Typography variant="body2" sx={{ mb: 1 }}>
//         Phone Number:
//       </Typography>

//       <TextField
//         fullWidth
//         variant="outlined"
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       <Box sx={{ mb: 2 }}>
//         <Button variant="outlined" startIcon={<AttachFile />} fullWidth sx={{ mb: 1 }}>
//           ADD ATTACHMENTS
//         </Button>
//       </Box>

//       <Button
//         variant="contained"
//         color="primary"
//         fullWidth
//         sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
//         onClick={handleSendTest}
//       >
//         SEND TEST SMS
//       </Button>
//     </Paper>
//   )
// }

// export default TestSmsPanel

import { useState } from "react"
import { Typography, TextField, Button, IconButton, Paper, Box } from "@mui/material"
import { Fullscreen, AttachFile } from "@mui/icons-material"
import { useSendTestSmsMutation } from "../api/templatesApi"

function TestSmsPanel() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [sendTestSms, { isLoading }] = useSendTestSmsMutation()
  
  const handleSendTest = async () => {
    if (!phoneNumber) {
      alert("لطفاً شماره تلفن را وارد کنید")
      return
    }
    
    try {
      const result = await sendTestSms({
        phoneNumber,
        templateId: "active" // assuming we're using the active template
      }).unwrap()
      
      alert(result.message || "پیامک تست با موفقیت ارسال شد")
    } catch (error) {
      alert("خطا در ارسال پیامک تست: " + (error.data?.message || error.message || "خطای نامشخص"))
    }
  }
  
  return (
    <Paper
      elevation={3}
      sx={{
        width: 280,
        m: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">ارسال پیامک آزمایشی</Typography>
        <IconButton size="small">
          <Fullscreen fontSize="small" />
        </IconButton>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        شماره تلفن:
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="شماره تلفن"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<AttachFile />} fullWidth sx={{ mb: 1 }}>
          افزودن پیوست
        </Button>
      </Box>
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
        onClick={handleSendTest}
      >
        ارسال پیامک آزمایشی
      </Button>
    </Paper>
  )
}

export default TestSmsPanel