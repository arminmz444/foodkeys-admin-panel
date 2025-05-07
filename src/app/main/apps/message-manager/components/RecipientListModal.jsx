// import { useState } from "react"
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   IconButton,
//   Divider,
//   Box,
//   Paper,
// } from "@mui/material"
// import { Delete, Add } from "@mui/icons-material"

// function RecipientListModal({ open, onClose, type = "Email" }) {
//   const [newRecipient, setNewRecipient] = useState("")
//   const [recipients, setRecipients] = useState([
//     { id: "1", value: "user1@example.com" },
//     { id: "2", value: "user2@example.com" },
//     { id: "3", value: "user3@example.com" },
//   ])

//   const handleAddRecipient = () => {
//     if (newRecipient.trim()) {
//       setRecipients([...recipients, { id: Date.now().toString(), value: newRecipient }])
//       setNewRecipient("")
//     }
//   }

//   const handleDeleteRecipient = (id) => {
//     setRecipients(recipients.filter((recipient) => recipient.id !== id))
//   }

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>Manage {type} Recipients</DialogTitle>
//       <DialogContent>
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="h6" sx={{ mb: 1 }}>
//             Add New Recipient
//           </Typography>
//           <Box sx={{ display: "flex", mb: 3 }}>
//             <TextField
//               fullWidth
//               value={newRecipient}
//               onChange={(e) => setNewRecipient(e.target.value)}
//               placeholder={type === "Email" ? "Enter email address" : "Enter phone number"}
//               variant="outlined"
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               sx={{ ml: 1, bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
//               onClick={handleAddRecipient}
//               startIcon={<Add />}
//             >
//               Add
//             </Button>
//           </Box>

//           <Typography variant="h6" sx={{ mb: 1 }}>
//             Recipient List
//           </Typography>
//           <Paper variant="outlined" sx={{ borderRadius: 1 }}>
//             <List>
//               {recipients.length === 0 ? (
//                 <ListItem>
//                   <ListItemText primary={`No ${type.toLowerCase()} recipients added yet.`} />
//                 </ListItem>
//               ) : (
//                 recipients.map((recipient, index) => (
//                   <Box key={recipient.id}>
//                     {index > 0 && <Divider />}
//                     <ListItem>
//                       <ListItemText primary={recipient.value} />
//                       <ListItemSecondaryAction>
//                         <IconButton edge="end" onClick={() => handleDeleteRecipient(recipient.id)}>
//                           <Delete />
//                         </IconButton>
//                       </ListItemSecondaryAction>
//                     </ListItem>
//                   </Box>
//                 ))
//               )}
//             </List>
//           </Paper>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Close
//         </Button>
//         <Button variant="contained" color="primary" sx={{ bgcolor: "#4a90e2" }} onClick={onClose}>
//           Save Recipients
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default RecipientListModal

// import { useState, useEffect } from "react"
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   IconButton,
//   Divider,
//   Box,
//   Paper,
//   CircularProgress
// } from "@mui/material"
// import { Delete, Add } from "@mui/icons-material"
// // import { useGetRecipientsQuery, useAddRecipientMutation, useDeleteRecipientMutation } from "../store/templatesApi"

// function RecipientListModal({ open, onClose, type = "Email" }) {
//   const [newRecipient, setNewRecipient] = useState("")
  
//   // API integration
//   // const { data: recipientsData, isLoading: isLoadingRecipients } = useGetRecipientsQuery()
//   // const [addRecipient, { isLoading: isAddingRecipient }] = useAddRecipientMutation()
//   // const [deleteRecipient, { isLoading: isDeletingRecipient }] = useDeleteRecipientMutation()
//   const recipientsData = []
//   // Local state to store the recipients data
//   const [recipients, setRecipients] = useState([])
  
//   // Update local state when API data changes
//   useEffect(() => {
//     if (recipientsData) {
//       setRecipients(recipientsData)
//     }
//   }, [recipientsData])

//   const handleAddRecipient = async () => {
//     if (newRecipient.trim()) {
//       try {
//         // API call to add a new recipient
//         // await addRecipient({
//         //   value: newRecipient,
//         //   type: type.toLowerCase() // email or sms
//         // }).unwrap()
        
//         setNewRecipient("")
//       } catch (error) {
//         alert("خطا در افزودن گیرنده: " + (error.data?.message || error.message || "خطای نامشخص"))
//       }
//     }
//   }

//   const handleDeleteRecipient = async (id) => {
//     try {
//       // API call to delete a recipient
//       // await deleteRecipient(id).unwrap()
//     } catch (error) {
//       alert("خطا در حذف گیرنده: " + (error.data?.message || error.message || "خطای نامشخص"))
//     }
//   }

//   // const isLoading = isLoadingRecipients || isAddingRecipient || isDeletingRecipient
//   const isLoading = false

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>
//         {type === "Email" ? "مدیریت گیرندگان ایمیل" : "مدیریت گیرندگان پیامک"}
//       </DialogTitle>
//       <DialogContent>
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="h6" sx={{ mb: 1 }}>
//             افزودن گیرنده جدید
//           </Typography>
//           <Box sx={{ display: "flex", mb: 3 }}>
//             <TextField
//               fullWidth
//               value={newRecipient}
//               onChange={(e) => setNewRecipient(e.target.value)}
//               placeholder={type === "Email" ? "آدرس ایمیل را وارد کنید" : "شماره تلفن را وارد کنید"}
//               variant="outlined"
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               disabled={isLoading}
//               sx={{ ml: 1, bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
//               onClick={handleAddRecipient}
//               startIcon={<Add />}
//             >
//               افزودن
//             </Button>
//           </Box>
//           <Typography variant="h6" sx={{ mb: 1 }}>
//             لیست گیرندگان
//           </Typography>
//           <Paper variant="outlined" sx={{ borderRadius: 1 }}>
//             {isLoading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
//                 <CircularProgress size={30} />
//               </Box>
//             ) : (
//               <List>
//                 {recipients.length === 0 ? (
//                   <ListItem>
//                     <ListItemText primary={type === "Email" ? "هیچ گیرنده ایمیلی هنوز اضافه نشده است." : "هیچ گیرنده پیامکی هنوز اضافه نشده است."} />
//                   </ListItem>
//                 ) : (
//                   recipients.map((recipient, index) => (
//                     <Box key={recipient.id}>
//                       {index > 0 && <Divider />}
//                       <ListItem>
//                         <ListItemText 
//                           primary={type === "Email" ? recipient.email : recipient.phone} 
//                           secondary={recipient.name} 
//                         />
//                         <ListItemSecondaryAction>
//                           <IconButton edge="end" onClick={() => handleDeleteRecipient(recipient.id)}>
//                             <Delete />
//                           </IconButton>
//                         </ListItemSecondaryAction>
//                       </ListItem>
//                     </Box>
//                   ))
//                 )}
//               </List>
//             )}
//           </Paper>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           بستن
//         </Button>
//         <Button variant="contained" color="primary" sx={{ bgcolor: "#4a90e2" }} onClick={onClose}>
//           ذخیره گیرندگان
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default RecipientListModal

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Delete, Add, Close } from "@mui/icons-material";
import { 
  useGetRecipientsQuery, 
  useAddRecipientMutation, 
  useDeleteRecipientMutation,
  useSendBulkEmailMutation,
  useSendBulkSmsMutation
} from "../store/templatesApi";

function RecipientListModal({ open, onClose, type = "Email", selectedTemplate = null }) {
  // Form inputs
  const [newRecipient, setNewRecipient] = useState("");
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientGroup, setNewRecipientGroup] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  
  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  
  // API hooks
  const { 
    data: recipientsData = [], 
    isLoading: isLoadingRecipients,
    refetch: refetchRecipients
  } = useGetRecipientsQuery(type.toUpperCase());
  
  const [addRecipient, { isLoading: isAddingRecipient }] = useAddRecipientMutation();
  const [deleteRecipient, { isLoading: isDeletingRecipient }] = useDeleteRecipientMutation();
  const [sendBulkEmail, { isLoading: isSendingBulkEmail }] = useSendBulkEmailMutation();
  const [sendBulkSms, { isLoading: isSendingBulkSms }] = useSendBulkSmsMutation();
  
  const isLoading = isLoadingRecipients || isAddingRecipient || isDeletingRecipient || 
                    isSendingBulkEmail || isSendingBulkSms;
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      refetchRecipients();
    } else {
      setNewRecipient("");
      setNewRecipientName("");
      setNewRecipientGroup("");
      setSearchTerm("");
      setSelectedGroup("");
    }
  }, [open, refetchRecipients]);
  
  // Extract unique groups from recipients
  const groups = [...new Set(recipientsData.map(recipient => recipient.group).filter(Boolean))];
  
  // Filter recipients based on search and group
  const filteredRecipients = recipientsData.filter(recipient => {
    const matchesSearch = searchTerm === "" || 
      recipient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (type === "Email" ? 
        recipient.email?.toLowerCase().includes(searchTerm.toLowerCase()) : 
        recipient.phone?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGroup = selectedGroup === "" || recipient.group === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });

  const handleAddRecipient = async () => {
    // Form validation
    if (!newRecipient.trim()) {
      showAlertMessage(`لطفاً ${type === "Email" ? "آدرس ایمیل" : "شماره تلفن"} را وارد کنید`, "error");
      return;
    }
    
    try {
      // Prepare data based on recipient type
      const data = {
        name: newRecipientName.trim() || `گیرنده ${recipientsData.length + 1}`,
        group: newRecipientGroup.trim() || undefined,
        medium: type.toUpperCase()
      };
      
      if (type === "Email") {
        data.email = newRecipient.trim();
      } else {
        data.phone = newRecipient.trim();
      }
      
      // API call to add a new recipient
      await addRecipient(data).unwrap();
      
      // Clear form
      setNewRecipient("");
      setNewRecipientName("");
      
      // Show success message
      showAlertMessage("گیرنده با موفقیت اضافه شد", "success");
      
      // Refresh recipients list
      refetchRecipients();
    } catch (error) {
      const errorMessage = error.data?.message || error.message || "خطای نامشخص";
      showAlertMessage(`خطا در افزودن گیرنده: ${errorMessage}`, "error");
    }
  };

  const handleDeleteRecipient = async (id) => {
    if (window.confirm("آیا از حذف این گیرنده اطمینان دارید؟")) {
      try {
        // API call to delete a recipient
        await deleteRecipient(id).unwrap();
        
        // Show success message
        showAlertMessage("گیرنده با موفقیت حذف شد", "success");
        
        // Refresh recipients list
        refetchRecipients();
      } catch (error) {
        const errorMessage = error.data?.message || error.message || "خطای نامشخص";
        showAlertMessage(`خطا در حذف گیرنده: ${errorMessage}`, "error");
      }
    }
  };
  
  const handleSendBulk = async () => {
    if (!selectedTemplate) {
      showAlertMessage("ابتدا یک قالب را انتخاب کنید", "error");
      return;
    }
    
    if (filteredRecipients.length === 0) {
      showAlertMessage("هیچ گیرنده‌ای برای ارسال وجود ندارد", "error");
      return;
    }
    
    if (!window.confirm(`آیا مطمئن هستید که می‌خواهید برای ${filteredRecipients.length} گیرنده پیام ارسال کنید؟`)) {
      return;
    }
    
    try {
      const recipientIds = filteredRecipients.map(recipient => recipient.id);
      
      const data = {
        templateId: selectedTemplate.id,
        recipientIds: recipientIds,
        variables: {
          user_name: "کاربر گرامی",
          app_name: "فود کیز",
          company_name: "آرمکو",
          // Add other default variables as needed
        }
      };
      
      // Send bulk message based on type
      if (type === "Email") {
        await sendBulkEmail(data).unwrap();
      } else {
        await sendBulkSms(data).unwrap();
      }
      
      showAlertMessage(`${type === "Email" ? "ایمیل" : "پیامک"} با موفقیت برای ${filteredRecipients.length} گیرنده ارسال شد`, "success");
    } catch (error) {
      const errorMessage = error.data?.message || error.message || "خطای نامشخص";
      showAlertMessage(`خطا در ارسال گروهی: ${errorMessage}`, "error");
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>
        {type === "Email" ? "مدیریت گیرندگان ایمیل" : "مدیریت گیرندگان پیامک"}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
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
          
          <Typography variant="h6" sx={{ mb: 1 }}>
            افزودن گیرنده جدید
          </Typography>
          
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <TextField
              label={type === "Email" ? "آدرس ایمیل" : "شماره تلفن"}
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              placeholder={type === "Email" ? "آدرس ایمیل را وارد کنید" : "شماره تلفن را وارد کنید"}
              variant="outlined"
              sx={{ flexGrow: 1, minWidth: "200px" }}
            />
            
            <TextField
              label="نام (اختیاری)"
              value={newRecipientName}
              onChange={(e) => setNewRecipientName(e.target.value)}
              placeholder="نام گیرنده را وارد کنید"
              variant="outlined"
              sx={{ flexGrow: 1, minWidth: "200px" }}
            />
            
            <TextField
              label="گروه (اختیاری)"
              value={newRecipientGroup}
              onChange={(e) => setNewRecipientGroup(e.target.value)}
              placeholder="گروه گیرنده را وارد کنید"
              variant="outlined"
              sx={{ flexGrow: 1, minWidth: "200px" }}
            />
            
            <Button
              variant="contained"
              color="primary"
              disabled={isAddingRecipient}
              sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
              onClick={handleAddRecipient}
              startIcon={<Add />}
            >
              {isAddingRecipient ? <CircularProgress size={24} color="inherit" /> : "افزودن"}
            </Button>
          </Box>
          
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">
              لیست گیرندگان
            </Typography>
            
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                label="جستجو"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="group-filter-label">فیلتر گروه</InputLabel>
                <Select
                  labelId="group-filter-label"
                  value={selectedGroup}
                  label="فیلتر گروه"
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <MenuItem value="">همه</MenuItem>
                  {groups.map(group => (
                    <MenuItem key={group} value={group}>{group}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                color="primary"
                disabled={isLoading || !selectedTemplate}
                onClick={handleSendBulk}
              >
                ارسال به همه
              </Button>
            </Box>
          </Box>
          
          <Paper variant="outlined" sx={{ borderRadius: 1 }}>
            {isLoadingRecipients ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <List>
                {filteredRecipients.length === 0 ? (
                  <ListItem>
                    <ListItemText primary={`هیچ گیرنده ${type === "Email" ? "ایمیلی" : "پیامکی"} یافت نشد.`} />
                  </ListItem>
                ) : (
                  filteredRecipients.map((recipient, index) => (
                    <Box key={recipient.id}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText 
                          primary={type === "Email" ? recipient.email : recipient.phone} 
                          secondary={
                            <>
                              <span>{recipient.name}</span>
                              {recipient.group && <span> | گروه: {recipient.group}</span>}
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleDeleteRecipient(recipient.id)}
                            disabled={isDeletingRecipient}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Box>
                  ))
                )}
              </List>
            )}
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          بستن
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ bgcolor: "#4a90e2" }} 
          onClick={onClose}
        >
          تایید
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RecipientListModal;