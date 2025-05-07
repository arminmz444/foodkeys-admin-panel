// // import { useState } from "react"
// // import { Typography, TextField, Button, IconButton, Paper, Box } from "@mui/material"
// // import { Fullscreen } from "@mui/icons-material"

// // function TestEmailPanel() {
// //   const [email, setEmail] = useState("")

// //   const handleSendTest = () => {
// //     // TODO: Send Email Here
// //     alert(`Test email would be sent to: ${email}`)
// //   }

// //   return (
// //     <Paper
// //       elevation={3}
// //       sx={{
// //         width: 280,
// //         m: 3,
// //         p: 2,
// //         display: "flex",
// //         flexDirection: "column",
// //         height: "fit-content",
// //       }}
// //     >
// //       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
// //         <Typography variant="h6">Send Test Email</Typography>
// //         <IconButton size="small">
// //           <Fullscreen fontSize="small" />
// //         </IconButton>
// //       </Box>

// //       <Typography variant="body2" sx={{ mb: 1 }}>
// //         Email Address:
// //       </Typography>

// //       <TextField
// //         fullWidth
// //         variant="outlined"
// //         placeholder="Email"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //         sx={{ mb: 3 }}
// //       />

// //       <Button
// //         variant="contained"
// //         color="primary"
// //         fullWidth
// //         sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
// //         onClick={handleSendTest}
// //       >
// //         SEND TEST EMAIL
// //       </Button>
// //     </Paper>
// //   )
// // }

// // export default TestEmailPanel

// import { useState } from "react"
// import { Typography, TextField, Button, IconButton, Paper, Box } from "@mui/material"
// import { Fullscreen } from "@mui/icons-material"
// // import { useSendTestEmailMutation } from "../store/templatesApi"

// function TestEmailPanel() {
//   const [email, setEmail] = useState("")
//   // const [sendTestEmail, { isLoading }] = useSendTestEmailMutation()
  
//   const handleSendTest = async () => {
//     if (!email) {
//       alert("لطفاً آدرس ایمیل را وارد کنید")
//       return
//     }
    
//     try {
//       // const result = await sendTestEmail({
//       // //   email,
//       // //   templateId: "active" // assuming we're using the active template
//       // // }).unwrap()
      
//       alert(result.message || "ایمیل تست با موفقیت ارسال شد")
//     } catch (error) {
//       alert("خطا در ارسال ایمیل تست: " + (error.data?.message || error.message || "خطای نامشخص"))
//     }
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
//         <Typography variant="h6">ارسال ایمیل آزمایشی</Typography>
//         <IconButton size="small">
//           <Fullscreen fontSize="small" />
//         </IconButton>
//       </Box>
      
//       <Typography variant="body2" sx={{ mb: 1 }}>
//         آدرس ایمیل:
//       </Typography>
      
//       <TextField
//         fullWidth
//         variant="outlined"
//         placeholder="ایمیل"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         sx={{ mb: 3 }}
//       />
      
//       <Button
//         variant="contained"
//         color="primary"
//         fullWidth
//         // disabled={isLoading}
//         sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
//         onClick={handleSendTest}
//       >
//         ارسال ایمیل آزمایشی
//       </Button>
//     </Paper>
//   )
// }

// export default TestEmailPanel
import { useState } from "react";
import { 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Paper, 
  Box,
  CircularProgress,
  Alert,
  Collapse,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { Fullscreen, Close } from "@mui/icons-material";
import { useTestSendEmailMutation, useGetRecipientsQuery } from "../store/templatesApi";

function TestEmailPanel({ selectedTemplate = null }) {
  const [email, setEmail] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [testVariables, setTestVariables] = useState({
    user_name: "کاربر تست",
    app_name: "فود کیز",
    confirmation_url: "https://example.com/confirm",
    reset_url: "https://example.com/reset",
    verification_url: "https://example.com/verify",
    expiry_hours: "24"
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  
  // API hooks
  const [testSendEmail, { isLoading }] = useTestSendEmailMutation();
  const { data: recipients = [], isLoading: isLoadingRecipients } = useGetRecipientsQuery("EMAIL");
  
  // Extract possible variables from template body
  const extractVariables = () => {
    if (!selectedTemplate?.body) return [];
    
    const regex = /\{([^{}]+)\}/g;
    const matches = selectedTemplate.body.match(regex) || [];
    return matches.map(match => match.replace(/[{}]/g, ''));
  };
  
  const variables = extractVariables();
  
  const handleSendTest = async () => {
    // Validation
    if (!selectedTemplate) {
      showAlertMessage("لطفاً ابتدا یک قالب را انتخاب کنید", "error");
      return;
    }
    
    // Check if we have an email (either direct or from recipient)
    const recipientEmail = selectedRecipient ? 
      recipients.find(r => r.id === selectedRecipient)?.email : 
      email;
      
    if (!recipientEmail) {
      showAlertMessage("لطفاً آدرس ایمیل را وارد کنید یا یک گیرنده انتخاب کنید", "error");
      return;
    }
    
    try {
      const result = await testSendEmail({
        templateId: selectedTemplate.id,
        recipient: recipientEmail,
        variables: testVariables
      }).unwrap();
      
      showAlertMessage(result.message || "ایمیل تست با موفقیت ارسال شد", "success");
    } catch (error) {
      const errorMessage = error.data?.message || error.message || "خطای نامشخص";
      showAlertMessage(`خطا در ارسال ایمیل تست: ${errorMessage}`, "error");
    }
  };
  
  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };
  
  const handleRecipientChange = (event) => {
    const recipientId = event.target.value;
    setSelectedRecipient(recipientId);
    
    // Clear direct email when a recipient is selected
    if (recipientId) {
      setEmail("");
    }
  };
  
  const handleVariableChange = (variable, value) => {
    setTestVariables({
      ...testVariables,
      [variable]: value
    });
  };
  
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
      
      <Collapse in={showAlert}>
        <Alert 
          severity={alertType}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowAlert(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="recipient-select-label">انتخاب گیرنده</InputLabel>
        <Select
          labelId="recipient-select-label"
          id="recipient-select"
          value={selectedRecipient}
          label="انتخاب گیرنده"
          onChange={handleRecipientChange}
          disabled={isLoadingRecipients}
        >
          <MenuItem value="">
            <em>گیرنده جدید</em>
          </MenuItem>
          {recipients.map((recipient) => (
            <MenuItem key={recipient.id} value={recipient.id}>
              {recipient.name} ({recipient.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {!selectedRecipient && (
        <>
          <Typography variant="body2" sx={{ mb: 1 }}>
            آدرس ایمیل:
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
        </>
      )}
      
      {/* Variable inputs based on template */}
      {variables.length > 0 && (
        <>
          <Typography variant="body2" sx={{ mb: 1, mt: 1 }}>
            متغیرهای تست:
          </Typography>
          
          {variables.map(variable => (
            <TextField
              key={variable}
              fullWidth
              size="small"
              variant="outlined"
              label={variable}
              placeholder={variable}
              value={testVariables[variable] || ''}
              onChange={(e) => handleVariableChange(variable, e.target.value)}
              sx={{ mb: 1 }}
            />
          ))}
        </>
      )}
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" }, mt: 2 }}
        onClick={handleSendTest}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "ارسال ایمیل آزمایشی"}
      </Button>
    </Paper>
  );
}

export default TestEmailPanel;