// src/app/shared-components/form-builder/FileUpload.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  IconButton,
  Paper,
  Divider,
  FormHelperText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DocumentIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';

// Import your existing utility functions
import { uploadFiles, getServerFile, isImageFile, getFileExtension } from '../../../utils/string-utils';

const FileUpload = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  multiple = false,
  accept = "*",
  maxSize = 5 * 1024 * 1024, // 5MB default max size
  maxFiles = 1, // Default to single file upload
  label = "آپلود فایل",
  fileServiceType = "SERVICE_FILE",
  disabled = false
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Initialize files from value (when editing an existing form)
  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        // Convert array of paths to file objects
        const initialFiles = value.map((filePath, index) => ({
          id: `server-file-${index}`,
          fileName: filePath.split('/').pop(),
          filePath,
          isServerFile: true
        }));
        setFiles(initialFiles);
      } else if (typeof value === 'string' && value) {
        // Convert single path to file object
        setFiles([{
          id: 'server-file-0',
          fileName: value.split('/').pop(),
          filePath: value,
          isServerFile: true
        }]);
      } else if (typeof value === 'object' && value !== null) {
        // Handle file objects directly (from API)
        const fileArray = Array.isArray(value) ? value : [value];
        const initialFiles = fileArray.map((file, index) => ({
          id: file.id || `server-file-${index}`,
          fileName: file.fileName || file.filePath.split('/').pop(),
          filePath: file.filePath,
          isServerFile: true
        }));
        setFiles(initialFiles);
      }
    } else {
      setFiles([]);
    }
  }, []);
  
  // Update parent component when files change
  useEffect(() => {
    if (files.length === 0) {
      onChange(multiple ? [] : "");
    } else if (multiple) {
      // Return array of file paths for multiple files
      onChange(files.map(file => file.filePath));
    } else {
      // Return single file path for single file
      onChange(files[0].filePath);
    }
  }, [files, multiple, onChange]);
  
  // Handle file input change
  const handleFileChange = async (event) => {
    setUploadError('');
    const selectedFiles = Array.from(event.target.files);
    console.log('Selected files:', selectedFiles);
    
    // Check if maximum file count would be exceeded
    if (multiple && files.length + selectedFiles.length > maxFiles) {
      setUploadError(`حداکثر ${maxFiles} فایل مجاز است.`);
      return;
    }
    
    // Validate files
    const validFiles = selectedFiles.filter(file => {
      console.log('Validating file:', file);
      // Check file size
      if (file.size > maxSize) {
        setUploadError(`فایل ${file.name} بزرگتر از حد مجاز است (${Math.round(maxSize / 1024 / 1024)} مگابایت)`);
        return false;
      }
      return true;
    });
    
    console.log('Valid files:', validFiles);
    
    if (validFiles.length === 0) return;
    
    try {
      setUploading(true);
      
      // Upload files to server with the specific SERVICE_FILE service type
      console.log('Calling uploadFiles with:', validFiles, fileServiceType);
      const uploadedFiles = await uploadFiles(validFiles, fileServiceType);
      console.log('Upload response:', uploadedFiles);
      
      // Format uploaded files
      const newFiles = uploadedFiles.map(file => ({
        id: file.id,
        fileName: file.fileName,
        filePath: file.filePath,
        isServerFile: true
      }));
      
      // Update files state
      if (multiple) {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      } else {
        setFiles(newFiles);
      }
      
      // Trigger blur to validate
      if (onBlur) onBlur();
    } catch (error) {
      setUploadError('خطا در آپلود فایل: ' + (error.message || 'خطای نامشخص'));
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
    
    // Clear the input value so the same file can be uploaded again
    event.target.value = '';
  };
  
  // Handle file deletion
  const handleDelete = (fileToDelete) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileToDelete.id));
  };
  
  // Get file icon based on extension
  const getFileIcon = (fileName) => {
    if (!fileName) return <FileIcon />;
    
    const extension = getFileExtension(fileName);
    
    if (isImageFile(fileName)) {
      return <ImageIcon />;
    } else if (extension === 'pdf') {
      return <PictureAsPdfIcon />;
    } else if (['doc', 'docx', 'txt', 'xlsx', 'xls', 'csv'].includes(extension)) {
      return <DocumentIcon />;
    } 
    
    return <FileIcon />;
  };
  
  return (
    <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
        {error && <span style={{ color: 'red' }}> *</span>}
      </Typography>
      
      {/* File list */}
      {files.length > 0 && (
        <Paper variant="outlined" sx={{ mb: 2, maxHeight: '200px', overflow: 'auto' }}>
          <List dense>
            {files.map((file, index) => (
              <div key={file.id || index}>
                <ListItem
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleDelete(file)}
                      disabled={disabled}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {file.isServerFile && isImageFile(file.fileName) ? (
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        src={getServerFile(file.filePath)} 
                        alt={file.fileName}
                      />
                    </ListItemAvatar>
                  ) : (
                    <ListItemIcon>
                      {getFileIcon(file.fileName)}
                    </ListItemIcon>
                  )}
                  
                  <ListItemText
                    primary={file.fileName}
                    secondary={
                      file.isServerFile && (
                        <Button
                          href={getServerFile(file.filePath)}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={(e) => e.stopPropagation()}
                        >
                          دانلود
                        </Button>
                      )
                    }
                  />
                </ListItem>
                {index < files.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
      )}
      
      {/* Upload button */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Only show "Add file" button if we haven't reached the maxFiles limit */}
        {(!multiple || files.length < maxFiles) && (
          <Button
            component="label"
            variant="outlined"
            startIcon={!uploading && (multiple || files.length === 0) ? <CloudUploadIcon /> : <AddIcon />}
            disabled={uploading || disabled}
            sx={{ mr: 2 }}
          >
            {uploading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                در حال آپلود...
              </>
            ) : multiple ? (
              "افزودن فایل"
            ) : files.length === 0 ? (
              "انتخاب فایل"
            ) : (
              "تغییر فایل"
            )}
            <input
              hidden
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={handleFileChange}
              disabled={uploading || disabled}
            />
          </Button>
        )}
        
        {!multiple && files.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => setFiles([])}
            disabled={uploading || disabled}
          >
            حذف
          </Button>
        )}
      </Box>
      
      {/* File count display */}
      {multiple && maxFiles > 1 && (
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
          {files.length} از {maxFiles} فایل ({maxFiles - files.length} فایل باقیمانده)
        </Typography>
      )}
      
      {/* Error messages */}
      {(error || uploadError || helperText) && (
        <FormHelperText error={!!(error || uploadError)}>
          {error ? helperText : uploadError || helperText}
        </FormHelperText>
      )}
      
      {/* File format help text */}
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
        {multiple ? `می‌توانید تا ${maxFiles} فایل انتخاب کنید` : "تنها یک فایل می‌توانید انتخاب کنید"}
        {maxSize && ` - حداکثر حجم هر فایل: ${Math.round(maxSize / 1024 / 1024)} مگابایت`}
      </Typography>
    </Box>
  );
};

export default FileUpload;
