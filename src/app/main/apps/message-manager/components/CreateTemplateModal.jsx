// import { useState } from "react"
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from "@mui/material"

// function CreateTemplateModal({ open, onClose, onCreate, type = "Email" }) {
//   const [name, setName] = useState("")

//   const handleCreate = () => {
//     if (name.trim()) {
//       onCreate(name)
//       setName("")
//     }
//   }

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>Create New Template</DialogTitle>
//       <DialogContent sx={{ mt: 2 }}>
//         <TextField
//           autoFocus
//           fullWidth
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder={`Enter template name`}
//           variant="outlined"
//         />
//         <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//           Template name will be used to identify the template and to send out {type.toLowerCase()}s based on the
//           template using the API
//         </Typography>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           CLOSE
//         </Button>
//         <Button
//           onClick={handleCreate}
//           variant="contained"
//           color="primary"
//           sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
//         >
//           ایجاد
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default CreateTemplateModal

import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from "@mui/material"
import { useCreateEmailTemplateMutation, useCreateSmsTemplateMutation } from "../api/templatesApi"

function CreateTemplateModal({ open, onClose, onCreate, type = "Email" }) {
  const [name, setName] = useState("")
  const [createEmailTemplate] = useCreateEmailTemplateMutation()
  const [createSmsTemplate] = useCreateSmsTemplateMutation()
  
  const handleCreate = async () => {
    if (name.trim()) {
      try {
        // Create template based on type
        if (type === "Email") {
          const result = await createEmailTemplate({
            name: name.trim(),
            subject: name.trim(),
            body: "",
            isSystem: false,
            enabled: true
          }).unwrap()
          
          // Call parent handler
          onCreate(result)
        } else {
          const result = await createSmsTemplate({
            name: name.trim(),
            subject: name.trim(),
            body: "",
            isSystem: false,
            enabled: true
          }).unwrap()
          
          // Call parent handler
          onCreate(result)
        }
        
        setName("")
        onClose()
      } catch (error) {
        alert("خطا در ایجاد قالب: " + (error.data?.message || error.message || "خطای نامشخص"))
      }
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>ایجاد قالب جدید</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <TextField
          autoFocus
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`نام قالب را وارد کنید`}
          variant="outlined"
        />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          نام قالب برای شناسایی قالب و ارسال {type === "Email" ? "ایمیل‌ها" : "پیامک‌ها"} بر اساس قالب با استفاده از API استفاده می‌شود
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          انصراف
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
        >
          ایجاد
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateTemplateModal