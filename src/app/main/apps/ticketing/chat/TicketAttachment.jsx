import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { 
  Box, 
  CircularProgress, 
  IconButton, 
  Paper, 
  Tooltip, 
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getServerFile } from 'src/utils/string-utils.js';

const StyledAttachment = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: 8,
  maxWidth: 200,
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  '&:hover .attachment-actions': {
    opacity: 1
  }
}));

function TicketAttachment({ attachment, onPreview }) {
  const [loading, setLoading] = useState(false);
  
  const handleDownload = async () => {
    setLoading(true);
    
    try {
      // Fetch the file with proper headers
      const response = await fetch(getServerFile(attachment.filePath), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_access_token') || ''}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handlePreview = () => {
    if (onPreview && isPreviewableFile()) {
      onPreview(attachment);
    }
  };

  const isImageFile = () => {
    return attachment.contentType?.startsWith('image/') || 
           ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(attachment.fileExtension?.toLowerCase());
  };

  const isVideoFile = () => {
    return attachment.contentType?.startsWith('video/') || 
           ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(attachment.fileExtension?.toLowerCase());
  };

  const isPreviewableFile = () => {
    return isImageFile() || isVideoFile();
  };
  
  const getFileIcon = () => {
    const extension = attachment.fileExtension?.toLowerCase();
    
    if (attachment.contentType?.startsWith('image/')) {
      return 'heroicons-outline:photograph';
    } else if (extension === 'pdf') {
      return 'heroicons-outline:document-text';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'heroicons-outline:document';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return 'heroicons-outline:table';
    } else if (['zip', 'rar', '7z'].includes(extension)) {
      return 'heroicons-outline:archive';
    } else {
      return 'heroicons-outline:paper-clip';
    }
  };
  
  return (
    <StyledAttachment className="relative">
      {isImageFile() ? (
        // Show image preview for images
        <Box className="flex items-center gap-8">
          <Box 
            className="w-48 h-48 rounded cursor-pointer overflow-hidden border-1 border-gray-300"
            onClick={handlePreview}
          >
            <img 
              src={getServerFile(attachment.filePath)} 
              alt={attachment.fileName}
              className="w-full h-full object-cover"
              style={{ 
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
              }}
            />
          </Box>
          <Box className="flex-1 overflow-hidden">
            <Tooltip title={attachment.fileName}>
              <Typography variant="body2" className="truncate max-w-128">
                {attachment.fileName}
              </Typography>
            </Tooltip>
            <Typography variant="caption" color="text.secondary">
              {(attachment.fileSize / 1024).toFixed(1)} KB
            </Typography>
          </Box>
        </Box>
      ) : (
        // Show icon for non-image files
        <>
          <FuseSvgIcon size={20} className="mr-8">
            {getFileIcon()}
          </FuseSvgIcon>
          
          <Box className="overflow-hidden flex-1">
            <Tooltip title={attachment.fileName}>
              <Typography variant="body2" className="truncate max-w-128">
                {attachment.fileName}
              </Typography>
            </Tooltip>
            <Typography variant="caption" color="text.secondary">
              {(attachment.fileSize / 1024).toFixed(1)} KB
            </Typography>
          </Box>
        </>
      )}
      
      <div className="attachment-actions absolute right-4 opacity-0 transition-opacity duration-200 flex gap-1">
        {isPreviewableFile() && (
          <Tooltip title="پیش نمایش">
            <IconButton size="small" onClick={handlePreview}>
              <FuseSvgIcon size={18} color="white">
                {isVideoFile() ? 'heroicons-outline:play' : 'heroicons-outline:eye'}
              </FuseSvgIcon>
            </IconButton>
          </Tooltip>
        )}
        {loading ? (
          <CircularProgress size={20} sx={{ color: 'white' }} />
        ) : (
          <Tooltip title="دانلود">
            <IconButton size="small" onClick={handleDownload}>
              <FuseSvgIcon size={18} color="white">
                heroicons-outline:download
              </FuseSvgIcon>
            </IconButton>
          </Tooltip>
        )}
      </div>
    </StyledAttachment>
  );
}

export default TicketAttachment;