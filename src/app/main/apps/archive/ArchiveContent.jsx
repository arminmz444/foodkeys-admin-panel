import { useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Alert,
  TextField,
  Tab,
  Tabs,
  Paper
} from '@mui/material';

function ArchiveContent({ archive }) {
  const [viewType, setViewType] = useState('formatted');
  const hasContent = archive && (archive.content || archive.base64Data);
  
  // Get raw content as string
  const getRawContentAsString = () => {
    if (!archive) return '';
    
    if (archive.content) {
      return typeof archive.content === 'object'
        ? JSON.stringify(archive.content, null, 2)
        : String(archive.content);
    }
    
    if (archive.base64Data) {
      try {
        return atob(archive.base64Data);
      } catch (e) {
        return 'Error: Unable to decode base64 data';
      }
    }
    
    return '';
  };
  
  // Get raw content
  const getRawContent = () => {
    if (!archive) return null;
    
    if (archive.content) {
      return archive.content;
    }
    
    if (archive.base64Data) {
      try {
        return JSON.parse(atob(archive.base64Data));
      } catch (e) {
        return { error: 'غیرقابل تفسیر', rawData: atob(archive.base64Data) };
      }
    }
    
    return null;
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setViewType(newValue);
  };
  
  if (!hasContent) {
    return (
      <Alert severity="info">
        این آرشیو داده‌ای برای نمایش ندارد.
      </Alert>
    );
  }
  
  return (
    <div>
      <Paper className="mb-24">
        <Tabs
          value={viewType}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="نمایش فرمت شده" value="formatted" />
          <Tab label="نمایش خام" value="raw" />
        </Tabs>
      </Paper>
      
      {viewType === 'formatted' ? (
        <pre className="bg-gray-100 p-16 rounded overflow-auto">
          {JSON.stringify(getRawContent(), null, 2)}
        </pre>
      ) : (
        <TextField
          multiline
          fullWidth
          variant="outlined"
          value={getRawContentAsString()}
          inputProps={{
            readOnly: true,
            style: { fontFamily: 'monospace' }
          }}
          minRows={10}
          maxRows={20}
        />
      )}
    </div>
  );
}

export default ArchiveContent;