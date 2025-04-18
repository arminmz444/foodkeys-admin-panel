import { useState } from 'react';
import { 
  Typography, 
  Card, 
  Alert 
} from '@mui/material';
import ReactJson from 'react-json-view';

function ArchivePreview({ archive }) {
  const hasContent = archive && (archive.content || archive.base64Data);
  
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
  
  // Try to get content as JSON for preview
  const content = getRawContent();
  
  if (!hasContent) {
    return (
      <Alert severity="info">
        این آرشیو محتوایی برای نمایش ندارد.
      </Alert>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <ReactJson
        src={content}
        theme="rjv-default"
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={true}
        style={{ padding: 16, fontFamily: 'Vazirmatn, sans-serif' }}
        name={false}
        collapseStringsAfterLength={50}
      />
    </Card>
  );
}

export default ArchivePreview;