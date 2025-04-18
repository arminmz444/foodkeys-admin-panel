// import { useState } from "react"
// import { Typography, TextField, Button, IconButton, Paper, Box } from "@mui/material"
// import { Fullscreen } from "@mui/icons-material"

// function TestEmailPanel() {
//   const [email, setEmail] = useState("")

//   const handleSendTest = () => {
//     // TODO: Send Email Here
//     alert(`Test email would be sent to: ${email}`)
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
//         <Typography variant="h6">Send Test Email</Typography>
//         <IconButton size="small">
//           <Fullscreen fontSize="small" />
//         </IconButton>
//       </Box>

//       <Typography variant="body2" sx={{ mb: 1 }}>
//         Email Address:
//       </Typography>

//       <TextField
//         fullWidth
//         variant="outlined"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         sx={{ mb: 3 }}
//       />

//       <Button
//         variant="contained"
//         color="primary"
//         fullWidth
//         sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
//         onClick={handleSendTest}
//       >
//         SEND TEST EMAIL
//       </Button>
//     </Paper>
//   )
// }

// export default TestEmailPanel

import { useState } from "react"
import { Typography, TextField, Button, IconButton, Paper, Box } from "@mui/material"
import { Fullscreen } from "@mui/icons-material"
import { useSendTestEmailMutation } from "../api/templatesApi"

function TestEmailPanel() {
  const [email, setEmail] = useState("")
  const [sendTestEmail, { isLoading }] = useSendTestEmailMutation()
  
  const handleSendTest = async () => {
    if (!email) {
      alert("لطفاً آدرس ایمیل را وارد کنید")
      return
    }
    
    try {
      const result = await sendTestEmail({
        email,
        templateId: "active" // assuming we're using the active template
      }).unwrap()
      
      alert(result.message || "ایمیل تست با موفقیت ارسال شد")
    } catch (error) {
      alert("خطا در ارسال ایمیل تست: " + (error.data?.message || error.message || "خطای نامشخص"))
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
        <Typography variant="h6">ارسال ایمیل آزمایشی</Typography>
        <IconButton size="small">
          <Fullscreen fontSize="small" />
        </IconButton>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        آدرس ایمیل:
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="ایمیل"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
      />
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
        onClick={handleSendTest}
      >
        ارسال ایمیل آزمایشی
      </Button>
    </Paper>
  )
}

export default TestEmailPanel