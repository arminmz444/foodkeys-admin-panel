"use client"
import { Tabs, Tab, Box, TextField, TextareaAutosize } from "@mui/material"
import { FileIcon, FolderIcon, AlertCircle, CheckCircle } from "lucide-react"

export const PreviewContent = ({ previewType, onTypeChange }) => {
  const handleChange = (event, newValue) => {
    onTypeChange(newValue)
  }

  return (
    <div className="space-y-4">
      <Tabs value={previewType} onChange={handleChange} className="w-full">
        <Tab label="Welcome" value="welcome" />
        <Tab label="Form" value="form" />
        <Tab label="Confirmation" value="confirmation" />
        <Tab label="Alert" value="alert" />
        <Tab label="Custom" value="custom" />
      </Tabs>

      <Box sx={{ pt: 2 }}>
        {previewType === "welcome" && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-medium">Welcome to Our Platform</h3>
            <p>Let's get you started with our amazing features.</p>
            <p className="text-sm opacity-70">Follow the simple steps to set up your account.</p>
          </div>
        )}

        {previewType === "form" && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Please Complete Your Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Full Name</label>
                <TextField placeholder="Enter your full name" fullWidth variant="outlined" size="small" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Email Address</label>
                <TextField placeholder="Enter your email" type="email" fullWidth variant="outlined" size="small" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Bio</label>
                <TextareaAutosize
                  placeholder="Tell us about yourself"
                  minRows={3}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        {previewType === "confirmation" && (
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="text-xl font-medium">Success!</h3>
            <p>Your changes have been saved successfully.</p>
            <p className="text-sm opacity-70">You can now continue with the next steps.</p>
          </div>
        )}

        {previewType === "alert" && (
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
            <h3 className="text-xl font-medium">Are you sure?</h3>
            <p>This action cannot be undone. Please confirm that you want to proceed.</p>
          </div>
        )}

        {previewType === "custom" && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Custom Content</h3>
            <p>This area will display your custom content.</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border border-gray-600 rounded-md p-4 text-center">
                <div className="bg-gray-700 h-20 mb-2 rounded flex items-center justify-center">
                  <FileIcon className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-sm">Component 1</p>
              </div>
              <div className="border border-gray-600 rounded-md p-4 text-center">
                <div className="bg-gray-700 h-20 mb-2 rounded flex items-center justify-center">
                  <FolderIcon className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-sm">Component 2</p>
              </div>
            </div>
          </div>
        )}
      </Box>
    </div>
  )
}

