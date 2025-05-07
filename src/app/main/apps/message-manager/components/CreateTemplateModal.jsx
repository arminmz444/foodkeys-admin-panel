// import { useState } from "react"
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from "@mui/material"
// import { useCreateEmailTemplateMutation, useCreateSmsTemplateMutation } from "../store/templatesApi"

// function CreateTemplateModal({ open, onClose, onCreate, type = "Email" }) {
//   const [name, setName] = useState("")
//   const [createEmailTemplate] = useCreateEmailTemplateMutation()
//   const [createSmsTemplate] = useCreateSmsTemplateMutation()
  
//   const handleCreate = async () => {
//     if (name.trim()) {
//       try {
//         if (type === "Email") {
//           const result = await createEmailTemplate({
//             name: name.trim(),
//             subject: name.trim(),
//             body: "",
//             isSystem: false,
//             enabled: true
//           }).unwrap()
          
//           onCreate(result)
//         } else {
//           const result = await createSmsTemplate({
//             name: name.trim(),
//             subject: name.trim(),
//             body: "",
//             isSystem: false,
//             enabled: true
//           }).unwrap()
          
//           // Call parent handler
//           onCreate(result)
//         }
        
//         setName("")
//         onClose()
//       } catch (error) {
//         alert("خطا در ایجاد قالب: " + (error.data?.message || error.message || "خطای نامشخص"))
//       }
//     }
//   }

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>ایجاد قالب جدید</DialogTitle>
//       <DialogContent sx={{ mt: 2 }}>
//         <TextField
//           autoFocus
//           fullWidth
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder={`نام قالب را وارد کنید`}
//           variant="outlined"
//         />
//         <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//           نام قالب برای شناسایی قالب و ارسال {type === "Email" ? "ایمیل‌ها" : "پیامک‌ها"} بر اساس قالب با استفاده از API استفاده می‌شود
//         </Typography>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           انصراف
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

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from "@mui/material";
import { 
  useCreateEmailTemplateMutation, 
  useCreateSmsTemplateMutation,
  useGetTemplateTypesQuery
} from "../store/templatesApi";

function CreateTemplateModal({ open, onClose, onCreate, type = "Email" }) {
  const [name, setName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [error, setError] = useState("");
  
  // Fetch template types based on medium
  const { 
    data: templateTypes = [], 
    isLoading: isLoadingTypes 
  } = useGetTemplateTypesQuery(type.toUpperCase(), {
    skip: !open // Only fetch when modal is open
  });
  // API mutations
  const [createEmailTemplate, { isLoading: isCreatingEmail }] = useCreateEmailTemplateMutation();
  const [createSmsTemplate, { isLoading: isCreatingSms }] = useCreateSmsTemplateMutation();
  
  const isLoading = isLoadingTypes || isCreatingEmail || isCreatingSms;
  
  useEffect(() => {
    if (open) {
      setError("");
    } else {
      setName("");
      setTemplateType("");
    }
  }, [open]);
  
  const filteredTemplateTypes = templateTypes.filter(
    template => template.medium === type.toUpperCase()
  );
  
  const handleCreate = async () => {
    // Form validation
    if (!name.trim()) {
      setError("نام قالب الزامی است");
      return;
    }
    
    if (!templateType) {
      setError("نوع قالب الزامی است");
      return;
    }
    
    try {
      // Create template based on type
      if (type === "Email") {
        const result = await createEmailTemplate({
          name: name.trim(),
          subject: name.trim(),
          body: "",
          templateType: templateType,
          isSystem: false,
          enabled: true
        }).unwrap();
        
        // Call parent handler
        onCreate(result);
      } else {
        const result = await createSmsTemplate({
          name: name.trim(),
          subject: name.trim(),
          body: "",
          templateType: templateType,
          isSystem: false,
          enabled: true
        }).unwrap();
        
        // Call parent handler
        onCreate(result);
      }
      
      setName("");
      setTemplateType("");
      onClose();
    } catch (error) {
      setError(error.data?.message || error.message || "خطای نامشخص در ایجاد قالب");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>
        ایجاد قالب {type === "Email" ? "ایمیل" : "پیامک"} جدید
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, pb: 3 }}>
        <TextField
          autoFocus
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`نام قالب را وارد کنید`}
          variant="outlined"
          margin="normal"
          error={!!error && !name.trim()}
          helperText={!name.trim() && error ? "نام قالب الزامی است" : ""}
        />
        
        <FormControl 
          fullWidth 
          margin="normal" 
          error={!!error && !templateType}
        >
          <InputLabel id="template-type-label">نوع قالب</InputLabel>
          <Select
            labelId="template-type-label"
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            label="نوع قالب"
            disabled={isLoadingTypes}
          >
            {isLoadingTypes ? (
              <MenuItem value="">
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              filteredTemplateTypes.length > 0 ? (
                [
                  <MenuItem key="placeholder" value="" disabled>انتخاب کنید</MenuItem>,
                  ...filteredTemplateTypes.map((template) => (
                    <MenuItem key={template.code} value={template.code}>
                      {template.displayName}
                    </MenuItem>
                  ))
                ]
              ) : (
                <MenuItem value="" disabled>هیچ نوع قالبی موجود نیست</MenuItem>
              )
            )}
          </Select>
          {!!error && !templateType && <FormHelperText>نوع قالب الزامی است</FormHelperText>}
        </FormControl>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          نام قالب برای شناسایی قالب و ارسال {type === "Email" ? "ایمیل‌ها" : "پیامک‌ها"} بر اساس قالب با استفاده از API استفاده می‌شود
        </Typography>
        
        {error && error !== "نام قالب الزامی است" && error !== "نوع قالب الزامی است" && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          انصراف
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "ایجاد"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTemplateModal;