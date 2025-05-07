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

function TicketAttachment({ attachment }) {
  const [loading, setLoading] = useState(false);
  
  const handleDownload = () => {
    setLoading(true);
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = attachment.filePath;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setLoading(false), 1000);
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
      <FuseSvgIcon size={20} className="mr-8">
        {getFileIcon()}
      </FuseSvgIcon>
      
      <Box className="overflow-hidden">
        <Tooltip title={attachment.fileName}>
          <Typography variant="body2" className="truncate max-w-128">
            {attachment.fileName}
          </Typography>
        </Tooltip>
        <Typography variant="caption" color="text.secondary">
          {(attachment.fileSize / 1024).toFixed(1)} KB
        </Typography>
      </Box>
      
      <div className="attachment-actions absolute right-4 opacity-0 transition-opacity duration-200">
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Tooltip title="Download">
            <IconButton size="small" onClick={handleDownload}>
              <FuseSvgIcon size={18}>
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