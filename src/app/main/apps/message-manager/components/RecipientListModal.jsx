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

import { useState, useEffect } from "react"
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
  CircularProgress
} from "@mui/material"
import { Delete, Add } from "@mui/icons-material"
import { useGetRecipientsQuery, useAddRecipientMutation, useDeleteRecipientMutation } from "../api/templatesApi"

function RecipientListModal({ open, onClose, type = "Email" }) {
  const [newRecipient, setNewRecipient] = useState("")
  
  // API integration
  const { data: recipientsData, isLoading: isLoadingRecipients } = useGetRecipientsQuery()
  const [addRecipient, { isLoading: isAddingRecipient }] = useAddRecipientMutation()
  const [deleteRecipient, { isLoading: isDeletingRecipient }] = useDeleteRecipientMutation()
  
  // Local state to store the recipients data
  const [recipients, setRecipients] = useState([])
  
  // Update local state when API data changes
  useEffect(() => {
    if (recipientsData) {
      setRecipients(recipientsData)
    }
  }, [recipientsData])

  const handleAddRecipient = async () => {
    if (newRecipient.trim()) {
      try {
        // API call to add a new recipient
        await addRecipient({
          value: newRecipient,
          type: type.toLowerCase() // email or sms
        }).unwrap()
        
        setNewRecipient("")
      } catch (error) {
        alert("خطا در افزودن گیرنده: " + (error.data?.message || error.message || "خطای نامشخص"))
      }
    }
  }

  const handleDeleteRecipient = async (id) => {
    try {
      // API call to delete a recipient
      await deleteRecipient(id).unwrap()
    } catch (error) {
      alert("خطا در حذف گیرنده: " + (error.data?.message || error.message || "خطای نامشخص"))
    }
  }

  const isLoading = isLoadingRecipients || isAddingRecipient || isDeletingRecipient

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>
        {type === "Email" ? "مدیریت گیرندگان ایمیل" : "مدیریت گیرندگان پیامک"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            افزودن گیرنده جدید
          </Typography>
          <Box sx={{ display: "flex", mb: 3 }}>
            <TextField
              fullWidth
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              placeholder={type === "Email" ? "آدرس ایمیل را وارد کنید" : "شماره تلفن را وارد کنید"}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ ml: 1, bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
              onClick={handleAddRecipient}
              startIcon={<Add />}
            >
              افزودن
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            لیست گیرندگان
          </Typography>
          <Paper variant="outlined" sx={{ borderRadius: 1 }}>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <List>
                {recipients.length === 0 ? (
                  <ListItem>
                    <ListItemText primary={type === "Email" ? "هیچ گیرنده ایمیلی هنوز اضافه نشده است." : "هیچ گیرنده پیامکی هنوز اضافه نشده است."} />
                  </ListItem>
                ) : (
                  recipients.map((recipient, index) => (
                    <Box key={recipient.id}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText 
                          primary={type === "Email" ? recipient.email : recipient.phone} 
                          secondary={recipient.name} 
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleDeleteRecipient(recipient.id)}>
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
        <Button variant="contained" color="primary" sx={{ bgcolor: "#4a90e2" }} onClick={onClose}>
          ذخیره گیرندگان
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RecipientListModal