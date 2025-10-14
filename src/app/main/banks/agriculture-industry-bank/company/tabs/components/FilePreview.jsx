import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Button, IconButton, CircularProgress } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactPlayer from 'react-player';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getServerFile } from '@/utils/string-utils';
import { isDocumentFile, isVideoFile, isImageFile } from '../utils/fileUtils';
import { Typography } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function FilePreview({ file, open, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  // Reset state when file changes
  useEffect(() => {
    if (file) {
      setPageNumber(1);
      setNumPages(null);
      setPdfError(null);
      setPdfData(null);
      
      // Fetch PDF data if it's a PDF file
      if (isDocumentFile(file.contentType) && file.contentType === 'application/pdf') {
        fetchPdfData();
      }
    }
  }, [file]);

  // Function to fetch PDF data as binary data
  const fetchPdfData = async () => {
    if (!file) return;
    
    const fileUrl = getFileUrl();
    if (!fileUrl) return;
    
    setIsLoading(true);
    
    try {
      // Fetch the PDF file
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      
      // Get the file as an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      setPdfData(arrayBuffer);
      setPdfError(null);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      setPdfError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const previousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const nextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  };

  const getFileUrl = () => {
    if (!file) return null;
    return file.filePath ? getServerFile(file.filePath) : file.previewUrl;
  };

  const renderPreview = () => {
    if (!file) return null;

    if (isDocumentFile(file.contentType) && file.contentType === 'application/pdf') {
      if (isLoading) {
        return (
          <Box className="flex justify-center items-center p-16">
            <CircularProgress />
            <Typography className="ml-2">در حال بارگذاری PDF...</Typography>
          </Box>
        );
      }
      
      if (pdfError) {
        return (
          <Box className="p-8 text-red-500">
            خطا در بارگذاری سند: {pdfError}
          </Box>
        );
      }
      
      const fileUrl = getFileUrl();
      
      return (
        <Box className="flex flex-col items-center">
          <Document 
            file={fileUrl}
            onLoadSuccess={handleDocumentLoadSuccess}
            error={<Box className="p-8 text-red-500">خطا در بارگذاری سند. لطفاً دوباره تلاش کنید.</Box>}
            loading={<CircularProgress />}
            options={{ 
              cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
              cMapPacked: true,
              standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/standard_fonts/'
            }}
          >
            <Page 
              pageNumber={pageNumber} 
              width={550}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              error={<Box className="p-8 text-red-500">خطا در نمایش صفحه</Box>}
              loading={<CircularProgress />}
            />
          </Document>
          
          {numPages > 1 && (
            <Box className="flex justify-between items-center mt-4 w-full">
              <Button
                onClick={previousPage}
                disabled={pageNumber <= 1}
                startIcon={<FuseSvgIcon>heroicons-outline:chevron-right</FuseSvgIcon>}
                variant="outlined"
              >
                صفحه قبل
              </Button>
              <Box>
                صفحه {pageNumber} از {numPages}
              </Box>
              <Button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                endIcon={<FuseSvgIcon>heroicons-outline:chevron-left</FuseSvgIcon>}
                variant="outlined"
              >
                صفحه بعد
              </Button>
            </Box>
          )}
        </Box>
      );
    } else if (isVideoFile(file.contentType)) {
      return (
        <Box className="w-full" sx={{ aspectRatio: '16/9' }}>
          <ReactPlayer
            url={getFileUrl()}
            controls
            width="100%"
            height="100%"
            style={{ maxHeight: '70vh' }}
            config={{ file: { forceVideo: true } }}
          />
        </Box>
      );
    } else if (isImageFile(file.contentType)) {
      return (
        <Box 
          className="flex justify-center"
          sx={{ maxHeight: '70vh', overflow: 'auto' }}
        >
          <img
            src={getFileUrl()}
            alt={file.metadata?.altText || file.fileName}
            className="max-w-full h-auto"
          />
        </Box>
      );
    } else {
      return (
        <Box className="p-8 flex flex-col items-center justify-center">
          <FuseSvgIcon className="text-gray-300" size={64}>heroicons-outline:document</FuseSvgIcon>
          <div className="mt-4 text-center">این نوع فایل قابل پیش‌نمایش نیست</div>
        </Box>
      );
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ 
        sx: { 
          maxHeight: '90vh',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column'
        } 
      }}
    >
      <DialogTitle className="flex justify-between items-center">
        <div className="flex items-center">
          <FuseSvgIcon className="mr-2">
            {isImageFile(file?.contentType) 
              ? 'heroicons-outline:photograph' 
              : isVideoFile(file?.contentType) 
                ? 'heroicons-outline:film' 
                : 'heroicons-outline:document-text'
            }
          </FuseSvgIcon>
          <span className="truncate max-w-sm">{file?.fileName}</span>
        </div>
        <IconButton onClick={onClose} size="small">
          <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="flex-1 overflow-auto">
        {file && renderPreview()}
      </DialogContent>
    </Dialog>
  );
}

export default FilePreview;