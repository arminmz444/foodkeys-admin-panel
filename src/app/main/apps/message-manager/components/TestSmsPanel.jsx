// // import { useState } from "react"
// // import { Typography, TextField, Button, IconButton, Paper, Box } from "@mui/material"
// // import { Fullscreen, AttachFile } from "@mui/icons-material"

// // function TestSmsPanel() {
// //   const [phoneNumber, setPhoneNumber] = useState("")

// //   const handleSendTest = () => {
// //     // TODO: Send SMS Here
// //     alert(`Test SMS would be sent to: ${phoneNumber}`)
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
// //         <Typography variant="h6">Send Test SMS</Typography>
// //         <IconButton size="small">
// //           <Fullscreen fontSize="small" />
// //         </IconButton>
// //       </Box>

// //       <Typography variant="body2" sx={{ mb: 1 }}>
// //         Phone Number:
// //       </Typography>

// //       <TextField
// //         fullWidth
// //         variant="outlined"
// //         placeholder="Phone Number"
// //         value={phoneNumber}
// //         onChange={(e) => setPhoneNumber(e.target.value)}
// //         sx={{ mb: 2 }}
// //       />

// //       <Box sx={{ mb: 2 }}>
// //         <Button variant="outlined" startIcon={<AttachFile />} fullWidth sx={{ mb: 1 }}>
// //           ADD ATTACHMENTS
// //         </Button>
// //       </Box>

// //       <Button
// //         variant="contained"
// //         color="primary"
// //         fullWidth
// //         sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
// //         onClick={handleSendTest}
// //       >
// //         SEND TEST SMS
// //       </Button>
// //     </Paper>
// //   )
// // }

// // export default TestSmsPanel

// import { useState } from "react"
// import { Typography, TextField, Button, IconButton, Paper, Box } from "@mui/material"
// import { Fullscreen, AttachFile } from "@mui/icons-material"
// // import { useSendTestSmsMutation } from "../store/templatesApi"

// function TestSmsPanel() {
//   const [phoneNumber, setPhoneNumber] = useState("")
//   // const [sendTestSms, { isLoading }] = useSendTestSmsMutation()
  
//   const handleSendTest = async () => {
//     if (!phoneNumber) {
//       alert("لطفاً شماره تلفن را وارد کنید")
//       return
//     }
    
//     try {
//       // const result = await sendTestSms({
//       //   phoneNumber,
//       //   templateId: "active" // assuming we're using the active template
//       // }).unwrap()
      
//       alert(result.message || "پیامک تست با موفقیت ارسال شد")
//     } catch (error) {
//       alert("خطا در ارسال پیامک تست: " + (error.data?.message || error.message || "خطای نامشخص"))
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
//         <Typography variant="h6">ارسال پیامک آزمایشی</Typography>
//         <IconButton size="small">
//           <Fullscreen fontSize="small" />
//         </IconButton>
//       </Box>
      
//       <Typography variant="body2" sx={{ mb: 1 }}>
//         شماره تلفن:
//       </Typography>
      
//       <TextField
//         fullWidth
//         variant="outlined"
//         placeholder="شماره تلفن"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//         sx={{ mb: 2 }}
//       />
      
//       <Box sx={{ mb: 2 }}>
//         <Button variant="outlined" startIcon={<AttachFile />} fullWidth sx={{ mb: 1 }}>
//           افزودن پیوست
//         </Button>
//       </Box>
      
//       <Button
//         variant="contained"
//         color="primary"
//         fullWidth
//         // disabled={isLoading}
//         sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
//         onClick={handleSendTest}
//       >
//         ارسال پیامک آزمایشی
//       </Button>
//     </Paper>
//   )
// }

// export default TestSmsPanel

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
import { Fullscreen, AttachFile, Close } from "@mui/icons-material";
import { useTestSendSmsMutation, useGetRecipientsQuery } from "../store/templatesApi";

function TestSmsPanel({ selectedTemplate = null }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [testVariables, setTestVariables] = useState({
    otp_code: "123456",
    company_name: "آرمکو",
    app_name: "فود کیز",
    user_name: "کاربر تست"
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  
  // API hooks
  const [testSendSms, { isLoading }] = useTestSendSmsMutation();
  const { data: recipients = [], isLoading: isLoadingRecipients } = useGetRecipientsQuery("SMS");
  
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
    
    // Check if we have a phone number (either direct or from recipient)
    const recipientPhone = selectedRecipient ? 
      recipients.find(r => r.id === selectedRecipient)?.phone : 
      phoneNumber;
      
    if (!recipientPhone) {
      showAlertMessage("لطفاً شماره تلفن را وارد کنید یا یک گیرنده انتخاب کنید", "error");
      return;
    }
    
    try {
      const result = await testSendSms({
        templateId: selectedTemplate.id,
        recipient: recipientPhone,
        variables: testVariables
      }).unwrap();
      
      showAlertMessage(result.message || "پیامک تست با موفقیت ارسال شد", "success");
    } catch (error) {
      const errorMessage = error.data?.message || error.message || "خطای نامشخص";
      showAlertMessage(`خطا در ارسال پیامک تست: ${errorMessage}`, "error");
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
    
    // Clear direct phone number when a recipient is selected
    if (recipientId) {
      setPhoneNumber("");
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
        <Typography variant="h6">ارسال پیامک آزمایشی</Typography>
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
              {recipient.name} ({recipient.phone})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {!selectedRecipient && (
        <>
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
      
      <Box sx={{ mb: 2, mt: 1 }}>
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
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "ارسال پیامک آزمایشی"}
      </Button>
    </Paper>
  );
}

export default TestSmsPanel;