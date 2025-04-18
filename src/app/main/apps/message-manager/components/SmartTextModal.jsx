// import { useState } from "react"
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   Box,
//   Paper,
// } from "@mui/material"

// function SmartTextModal({ open, onClose, onAddSmartText, type = "Email" }) {
//   const [selectedProperty, setSelectedProperty] = useState("")
//   const [defaultValue, setDefaultValue] = useState("")

//   const properties =
//     type === "Email"
//       ? [
//           { value: "accountType", label: "accountType" },
//           { value: "blUserLocale", label: "blUserLocale" },
//           { value: "created", label: "created" },
//           { value: "email", label: "email" },
//           { value: "lastLogin", label: "lastLogin" },
//           { value: "name", label: "name" },
//           { value: "oAuthIdentities", label: "oAuthIdentities" },
//           { value: "objectId", label: "objectId" },
//           { value: "ownerId", label: "ownerId" },
//           { value: "socialAccount", label: "socialAccount" },
//           { value: "updated", label: "updated" },
//           { value: "userStatus", label: "userStatus" },
//         ]
//       : [
//           { value: "phone", label: "phone" },
//           { value: "otp", label: "otp" },
//           { value: "created", label: "created" },
//           { value: "name", label: "name" },
//           { value: "objectId", label: "objectId" },
//           { value: "companyName", label: "companyName" },
//           { value: "userStatus", label: "userStatus" },
//         ]

//   const handleInsert = () => {
//     onAddSmartText(selectedProperty, defaultValue)
//     setSelectedProperty("")
//     setDefaultValue("")
//   }

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>Smart Text for {type} Subject</DialogTitle>
//       <DialogContent>
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="body1" sx={{ mb: 1 }}>
//             Add smart text:
//           </Typography>
//           <TextField fullWidth value={`fnfgn`} variant="outlined" sx={{ mb: 3 }} />

//           <Paper
//             variant="outlined"
//             sx={{
//               p: 2,
//               bgcolor: "#f0f8ff",
//               borderRadius: 1,
//             }}
//           >
//             <Typography variant="body1" sx={{ mb: 1 }}>
//               User property:
//             </Typography>
//             <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
//               <Select
//                 value={selectedProperty}
//                 onChange={(e) => setSelectedProperty(e.target.value)}
//                 displayEmpty
//                 renderValue={(selected) => {
//                   if (!selected) {
//                     return <em>-- select a property --</em>
//                   }
//                   return selected
//                 }}
//               >
//                 <MenuItem disabled value="">
//                   <em>-- select a property --</em>
//                 </MenuItem>
//                 {properties.map((prop) => (
//                   <MenuItem key={prop.value} value={prop.value}>
//                     {prop.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <Typography variant="body1" sx={{ mb: 1 }}>
//               Default Value
//             </Typography>
//             <TextField
//               fullWidth
//               placeholder="optional"
//               value={defaultValue}
//               onChange={(e) => setDefaultValue(e.target.value)}
//               variant="outlined"
//               sx={{ mb: 3 }}
//             />

//             <Button variant="outlined" color="primary" onClick={handleInsert}>
//               INSERT
//             </Button>
//           </Paper>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           CANCEL
//         </Button>
//         <Button onClick={onClose} variant="contained" color="primary" sx={{ bgcolor: "#4a90e2" }}>
//           SAVE
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default SmartTextModal


import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Box,
  Paper,
} from "@mui/material"
import { useGetSmartTextVariablesQuery } from "../api/templatesApi"

function SmartTextModal({ open, onClose, onAddSmartText, type = "Email" }) {
  const [selectedProperty, setSelectedProperty] = useState("")
  const [defaultValue, setDefaultValue] = useState("")
  
  // Fetch smart text variables from API
  const { data: smartTextVariablesData, isLoading } = useGetSmartTextVariablesQuery()
  
  const properties = smartTextVariablesData || (
    type === "Email"
      ? [
          { key: "accountType", value: "{{DS.MAIN_DS.USER.ACCOUNT_TYPE}}", description: "نوع حساب" },
          { key: "blUserLocale", value: "{{DS.MAIN_DS.USER.BL_USER_LOCALE}}", description: "منطقه زمانی کاربر" },
          { key: "created", value: "{{DS.MAIN_DS.USER.BL_USER_LOCALE}}", description: "تاریخ ایجاد" },
          { key: "email", value: "{{DS.MAIN_DS.USER.BL_USER_LOCALE}}", description: "ایمیل" },
          { key: "lastLogin", description: "آخرین ورود" },
          { key: "name", description: "نام" },
          { key: "objectId", description: "شناسه شیء" },
          { key: "ownerId", description: "شناسه مالک" },
          { key: "updated", description: "به‌روزرسانی شده" },
          { key: "userStatus", description: "وضعیت کاربر" },
        ]
      : [
          { key: "phone", description: "تلفن" },
          { key: "otp", description: "رمز یکبار مصرف" },
          { key: "created", description: "تاریخ ایجاد" },
          { key: "name", description: "نام" },
          { key: "objectId", description: "شناسه شیء" },
          { key: "companyName", description: "نام شرکت" },
          { key: "userStatus", description: "وضعیت کاربر" },
        ]
  )

  const handleInsert = () => {
    onAddSmartText(selectedProperty, defaultValue)
    setSelectedProperty("")
    setDefaultValue("")
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>
        {type === "Email" ? "متن هوشمند برای موضوع ایمیل" : "متن هوشمند برای موضوع پیامک"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            افزودن متن هوشمند:
          </Typography>
          <TextField fullWidth value={`قالب سفارشی`} variant="outlined" sx={{ mb: 3 }} />

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: "#f0f8ff",
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" sx={{ mb: 1 }}>
              ویژگی کاربر:
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <Select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>-- یک ویژگی انتخاب کنید --</em>
                  }
                  return selected
                }}
              >
                <MenuItem disabled value="">
                  <em>-- یک ویژگی انتخاب کنید --</em>
                </MenuItem>
                {properties.map((prop) => (
                  <MenuItem key={prop.key} value={prop.key}>
                    {prop.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="body1" sx={{ mb: 1 }}>
              مقدار پیش‌فرض
            </Typography>
            <TextField
              fullWidth
              placeholder="اختیاری"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Button variant="outlined" color="primary" onClick={handleInsert}>
              درج
            </Button>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          انصراف
        </Button>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ bgcolor: "#4a90e2" }}>
          ذخیره
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SmartTextModal