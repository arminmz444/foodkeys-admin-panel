/* global FileReader */

/**
 * Utility functions for handling files in React
 */

/**
 * Convert file to base64
 * @param file File to convert
 * @returns Promise with base64 string
 */
export const fileToBase64 = (file) => {
    if (typeof window === 'undefined') {
      throw new Error('FileReader is only available in browser environments');
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  /**
   * Convert multiple files to base64
   * @param files Array of files to convert
   * @returns Promise with array of base64 strings
   */
  export const filesToBase64 = async (files) => {
    return Promise.all(files.map(file => fileToBase64(file)));
  };
  
  /**
   * Check if a string is base64 encoded
   * @param str String to check
   * @returns Boolean indicating if string is base64
   */
  export const isBase64 = (str) => {
    try {
      // Check if it's a data URL
      if (str.indexOf('data:') === 0 && str.indexOf('base64,') !== -1) {
        return true;
      }
      
      // Check if it's a raw base64 string
      const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
      return base64Regex.test(str);
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Check if a string is a file path
   * @param str String to check
   * @returns Boolean indicating if string is a file path
   */
  export const isFilePath = (str) => {
    // Simple check for file path format
    const filePathRegex = /^(\/|\.\/|\.\.\/|[A-Za-z]:\\|[A-Za-z]:\/|\\\\|https?:\/\/)/;
    return filePathRegex.test(str);
  };
  
  /**
   * Get file extension from content type
   * @param contentType Content type string
   * @returns File extension
   */
  export const getExtensionFromContentType = (contentType) => {
    const types = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'application/pdf': 'pdf',
      'text/plain': 'txt',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    };
    
    return types[contentType] || 'bin';
  };
  
  /**
   * Get file size in human-readable format
   * @param size File size in bytes
   * @returns Human-readable size string
   */
  export const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  };
  
  /**
   * Stream download a file
   * @param url URL to download file from
   * @param filename Name to save file as
   */
  export const streamDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  };