// import { useState, useEffect } from "react"
// import { Typography, TextField, Button, IconButton, Divider, Box, Paper } from "@mui/material"
// import { Undo, Redo, MoreHoriz } from "@mui/icons-material"

// function SmsEditor({ template, onOpenSmartText, onCharCountChange, onContentChange }) {
//   const [subject, setSubject] = useState("")
//   const [body, setBody] = useState("")

//   useEffect(() => {
//     if (template) {
//       setSubject(template.subject || "")
//       setBody(template.body || "")

//       // Count characters
//       const charCount = template.body ? template.body.length : 0
//       onCharCountChange(charCount)
//     }
//   }, [template, onCharCountChange])

//   const handleBodyChange = (e) => {
//     setBody(e.target.value)
//     onContentChange()

//     // Count characters
//     const charCount = e.target.value.length
//     onCharCountChange(charCount)
//   }

//   const handleSubjectChange = (e) => {
//     setSubject(e.target.value)
//     onContentChange()
//   }

//   return (
//     <Box>
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="h6" sx={{ mb: 1 }}>
//           SMS Subject
//         </Typography>
//         <Box sx={{ display: "flex" }}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             value={subject}
//             onChange={handleSubjectChange}
//             placeholder="Enter SMS subject"
//           />
//           <Button variant="text" color="primary" sx={{ ml: 1 }} onClick={onOpenSmartText}>
//             add smart text
//           </Button>
//         </Box>
//       </Box>

//       <Box>
//         <Typography variant="h6" sx={{ mb: 1 }}>
//           SMS Body
//         </Typography>

//         <Paper variant="outlined" sx={{ borderRadius: 1 }}>
//           <Box sx={{ display: "flex", alignItems: "center", p: 1, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
//             <IconButton size="small">
//               <Undo fontSize="small" />
//             </IconButton>
//             <IconButton size="small">
//               <Redo fontSize="small" />
//             </IconButton>
//             <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
//             <Button variant="text" color="primary" endIcon={<MoreHoriz />} onClick={onOpenSmartText}>
//               Insert Variable
//             </Button>
//           </Box>

//           <TextField
//             fullWidth
//             multiline
//             rows={6}
//             variant="outlined"
//             value={body}
//             onChange={handleBodyChange}
//             placeholder="Enter SMS body"
//             InputProps={{
//               sx: {
//                 border: "none",
//                 borderRadius: 0,
//                 "& fieldset": { border: "none" },
//               },
//             }}
//           />

//           <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
//             <Typography variant="body2" color="textSecondary">
//               {body.length} characters
//             </Typography>
//           </Box>
//         </Paper>
//       </Box>
//     </Box>
//   )
// }

// export default SmsEditor

import { useState, useEffect } from "react"
import { Typography, TextField, Button, IconButton, Divider, Box, Paper } from "@mui/material"
import { Undo, Redo, MoreHoriz } from "@mui/icons-material"

function SmsEditor({ template, onOpenSmartText, onCharCountChange, onContentChange }) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    if (template) {
      setSubject(template.subject || "")
      setBody(template.body || "")

      // Count characters
      const charCount = template.body ? template.body.length : 0
      onCharCountChange(charCount)
    }
  }, [template, onCharCountChange])

  const handleBodyChange = (e) => {
    setBody(e.target.value)
    onContentChange()

    // Count characters
    const charCount = e.target.value.length
    onCharCountChange(charCount)
  }

  const handleSubjectChange = (e) => {
    setSubject(e.target.value)
    onContentChange()
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          موضوع پیامک
        </Typography>
        <Box sx={{ display: "flex" }}>
          <TextField
            fullWidth
            variant="outlined"
            value={subject}
            onChange={handleSubjectChange}
            placeholder="موضوع پیامک را وارد کنید"
          />
          <Button variant="text" color="primary" sx={{ ml: 1 }} onClick={onOpenSmartText}>
            افزودن متن هوشمند
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          متن پیامک
        </Typography>

        <Paper variant="outlined" sx={{ borderRadius: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", p: 1, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
            <IconButton size="small">
              <Undo fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <Redo fontSize="small" />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Button variant="text" color="primary" endIcon={<MoreHoriz />} onClick={onOpenSmartText}>
              درج متغیر
            </Button>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={body}
            onChange={handleBodyChange}
            placeholder="متن پیامک را وارد کنید"
            InputProps={{
              sx: {
                border: "none",
                borderRadius: 0,
                "& fieldset": { border: "none" },
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
            <Typography variant="body2" color="textSecondary">
              {body.length} کاراکتر
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default SmsEditor