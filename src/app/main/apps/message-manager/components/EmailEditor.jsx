import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { Typography, TextField, Button, IconButton, Divider, Box, Paper } from "@mui/material"
import { FormatBold, FormatItalic, FormatUnderlined, StrikethroughS, Undo, Redo, MoreHoriz } from "@mui/icons-material"

const EmailEditor = forwardRef(({ template, onOpenSmartText, onWordCountChange, onContentChange }, ref) => {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const textFieldRef = useRef(null);
  const subjectFieldRef = useRef(null);
  const [focusedField, setFocusedField] = useState("body"); // Track which field is focused: "subject" or "body"
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    insertVariable: (variable) => {
      // Determine which field to insert the variable based on the last focused field
      if (focusedField === "subject") {
        // Handle insertion into subject field
        const input = subjectFieldRef.current?.querySelector('input');
        
        if (input) {
          // Get cursor position
          const startPos = input.selectionStart;
          const endPos = input.selectionEnd;
          
          // Create new text with variable inserted at cursor position
          const newSubject = `${subject.substring(0, startPos)}${variable}${subject.substring(endPos)}`;
          
          // Update state
          setSubject(newSubject);
          
          // Safely call the callback if it exists
          if (typeof onContentChange === 'function') {
            onContentChange({ subject: newSubject, body });
          }
          
          // Set cursor position after the inserted variable
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(startPos + variable.length, startPos + variable.length);
          }, 0);
        }
      } else {
        // Handle insertion into body field
        const input = textFieldRef.current?.querySelector('textarea');
        
        if (input) {
          // Get cursor position
          const startPos = input.selectionStart;
          const endPos = input.selectionEnd;
          
          // Create new text with variable inserted at cursor position
          const newBody = `${body.substring(0, startPos)}${variable}${body.substring(endPos)}`;
          
          // Update state
          setBody(newBody);
          
          // Safely call the callback if it exists
          if (typeof onContentChange === 'function') {
            onContentChange({ subject, body: newBody });
          }
          
          // Count words after insertion
          const wordCount = newBody.trim().split(/\s+/).filter(Boolean).length;
          
          // Safely call the word count callback if it exists
          if (typeof onWordCountChange === 'function') {
            onWordCountChange(wordCount);
          }
          
          // Set cursor position after the inserted variable
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(startPos + variable.length, startPos + variable.length);
          }, 0);
        }
      }
    },
    // Add method to get current content
    getContent: () => {
      return {
        subject,
        body
      };
    }
  }));

  useEffect(() => {
    if (template) {
      setSubject(template.subject || "")
      setBody(template.body || "")
      
      // Count words
      const wordCount = template.body ? template.body.trim().split(/\s+/).filter(Boolean).length : 0
      
      if (typeof onWordCountChange === 'function') {
        onWordCountChange(wordCount);
      }
    }
  }, [template, onWordCountChange])

  const handleBodyChange = (e) => {
    const newBody = e.target.value;
    setBody(newBody);
    
    // Call the onContentChange handler with both subject and body
    if (typeof onContentChange === 'function') {
      onContentChange({ subject, body: newBody });
    }
    
    // Count words
    const wordCount = newBody.trim().split(/\s+/).filter(Boolean).length;
    
    if (typeof onWordCountChange === 'function') {
      onWordCountChange(wordCount);
    }
  }

  const handleSubjectChange = (e) => {
    const newSubject = e.target.value;
    setSubject(newSubject);
    
    // Call the onContentChange handler with both subject and body
    if (typeof onContentChange === 'function') {
      onContentChange({ subject: newSubject, body });
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          موضوع ایمیل
        </Typography>
        <Box sx={{ display: "flex" }}>
          <TextField
            ref={subjectFieldRef}
            fullWidth
            variant="outlined"
            value={subject}
            onChange={handleSubjectChange}
            placeholder="موضوع ایمیل را وارد کنید"
            onFocus={() => setFocusedField("subject")}
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
            ref={textFieldRef}
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={body}
            onChange={handleBodyChange}
            onFocus={() => setFocusedField("body")}
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
})

export default EmailEditor