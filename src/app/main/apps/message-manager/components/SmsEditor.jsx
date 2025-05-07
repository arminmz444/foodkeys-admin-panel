import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { Typography, TextField, Button, IconButton, Divider, Box, Paper } from "@mui/material"
import { Undo, Redo, MoreHoriz } from "@mui/icons-material"

const SmsEditor = forwardRef(({ template, onOpenSmartText, onCharCountChange, onContentChange }, ref) => {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const textFieldRef = useRef(null);
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    insertVariable: (variable) => {
      // Get references to the text field input element
      const input = textFieldRef.current?.querySelector('textarea');
      
      if (input) {
        // Get cursor position
        const startPos = input.selectionStart;
        const endPos = input.selectionEnd;
        
        // Create new text with variable inserted at cursor position
        const newBody = `${body.substring(0, startPos)}${variable}${body.substring(endPos)}`;
        
        // Update state
        setBody(newBody);
        onContentChange();
        
        // Count characters after insertion
        const charCount = newBody.length;
        onCharCountChange(charCount);
        
        // Set cursor position after the inserted variable
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(startPos + variable.length, startPos + variable.length);
        }, 0);
      }
    }
  }));

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
            ref={textFieldRef}
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
})

export default SmsEditor