// import { useState, useEffect } from "react"
// import { Typography, TextField, Button, IconButton, Divider, Box, Paper } from "@mui/material"
// import { FormatBold, FormatItalic, FormatUnderlined, StrikethroughS, Undo, Redo, MoreHoriz } from "@mui/icons-material"

// function EmailEditor({ template, onOpenSmartText, onWordCountChange, onContentChange }) {
//   const [subject, setSubject] = useState("")
//   const [body, setBody] = useState("")

//   useEffect(() => {
//     if (template) {
//       setSubject(template.subject || "")
//       setBody(template.body || "")

//       // Count words
//       const wordCount = template.body ? template.body.trim().split(/\s+/).filter(Boolean).length : 0
//       onWordCountChange(wordCount)
//     }
//   }, [template, onWordCountChange])

//   const handleBodyChange = (e) => {
//     setBody(e.target.value)
//     onContentChange()

//     // Count words
//     const wordCount = e.target.value.trim().split(/\s+/).filter(Boolean).length
//     onWordCountChange(wordCount)
//   }

//   const handleSubjectChange = (e) => {
//     setSubject(e.target.value)
//     onContentChange()
//   }

//   return (
//     <Box>
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="h6" sx={{ mb: 1 }}>
//           Email Subject
//         </Typography>
//         <Box sx={{ display: "flex" }}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             value={subject}
//             onChange={handleSubjectChange}
//             placeholder="Enter email subject"
//           />
//           <Button variant="text" color="primary" sx={{ ml: 1 }} onClick={onOpenSmartText}>
//             add smart text
//           </Button>
//         </Box>
//       </Box>

//       <Box>
//         <Typography variant="h6" sx={{ mb: 1 }}>
//           Email Body
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
//             <IconButton size="small">
//               <FormatBold fontSize="small" />
//             </IconButton>
//             <IconButton size="small">
//               <FormatItalic fontSize="small" />
//             </IconButton>
//             <IconButton size="small">
//               <FormatUnderlined fontSize="small" />
//             </IconButton>
//             <IconButton size="small">
//               <StrikethroughS fontSize="small" />
//             </IconButton>
//             <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
//             <Button variant="text" color="primary" endIcon={<MoreHoriz />} onClick={onOpenSmartText}>
//               Insert Variable
//             </Button>
//           </Box>

//           <TextField
//             fullWidth
//             multiline
//             rows={10}
//             variant="outlined"
//             value={body}
//             onChange={handleBodyChange}
//             placeholder="Enter email body"
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
//               {body.trim().split(/\s+/).filter(Boolean).length} words
//             </Typography>
//           </Box>
//         </Paper>
//       </Box>
//     </Box>
//   )
// }

// export default EmailEditor

import { useState, useEffect } from "react"
import { Typography, TextField, Button, IconButton, Divider, Box, Paper } from "@mui/material"
import { FormatBold, FormatItalic, FormatUnderlined, StrikethroughS, Undo, Redo, MoreHoriz } from "@mui/icons-material"

function EmailEditor({ template, onOpenSmartText, onWordCountChange, onContentChange }) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    if (template) {
      setSubject(template.subject || "")
      setBody(template.body || "")
      
      // Count words
      const wordCount = template.body ? template.body.trim().split(/\s+/).filter(Boolean).length : 0
      onWordCountChange(wordCount)
    }
  }, [template, onWordCountChange])

  const handleBodyChange = (e) => {
    setBody(e.target.value)
    onContentChange()
    
    // Count words
    const wordCount = e.target.value.trim().split(/\s+/).filter(Boolean).length
    onWordCountChange(wordCount)
  }

  const handleSubjectChange = (e) => {
    setSubject(e.target.value)
    onContentChange()
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          موضوع ایمیل
        </Typography>
        <Box sx={{ display: "flex" }}>
          <TextField
            fullWidth
            variant="outlined"
            value={subject}
            onChange={handleSubjectChange}
            placeholder="موضوع ایمیل را وارد کنید"
          />
          <Button variant="text" color="primary" sx={{ ml: 1 }} onClick={onOpenSmartText}>
            افزودن متن هوشمند
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          متن ایمیل
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
            <IconButton size="small">
              <FormatBold fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <FormatItalic fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <FormatUnderlined fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <StrikethroughS fontSize="small" />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Button variant="text" color="primary" endIcon={<MoreHoriz />} onClick={onOpenSmartText}>
              درج متغیر
            </Button>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={body}
            onChange={handleBodyChange}
            placeholder="متن ایمیل را وارد کنید"
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
              {body.trim().split(/\s+/).filter(Boolean).length} کلمه
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default EmailEditor