import { API_STATIC_FILES_BASE_URL } from 'app/store/apiService.js';
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export const getSafeString = (str) => {
	if (!str) return '';

	return String(str).trim();
};

export const getServerFile = (path, sub = '') => {
	const filePath = typeof path === 'object' && path?.length > 0 ? path[0] : !!path ? path : sub
	// if (typeof path === 'object' && path?.length > 0) 
	return API_STATIC_FILES_BASE_URL + filePath
	// path ? API_STATIC_FILES_BASE_URL + path : sub
}

export function cn(...classes) {
	return classes.filter(Boolean).join(" ")
  }
  

export function tn(...inputs) {
  return twMerge(clsx(inputs))
}


export const uploadFiles = async (files, fileServiceType = 'GENERAL') => {
  try {
    console.log('Files received:', files);
    console.log('FileServiceType:', fileServiceType);
    
    const formData = new FormData();
    
    // Add each file to the form data
    for (let i = 0; i < files.length; i++) {
      console.log('Adding file to FormData:', files[i]);
      formData.append('files', files[i]);
    }
    
	console.log(formData)
    // Add file service type
    formData.append('fileServiceType', fileServiceType);
    
    // Log FormData contents
    for (let pair of formData.entries()) {
		console.log("Here")
      console.log(pair[0] + ': ' + pair[1]);
    }
    const response = await axios.post(`/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    // Make the API request using axios
    // await axios.post('/file', formData);
    
    const result = response.data;
    
    // Check if the API response is successful
    if (result.status !== 'SUCCESS') {
      throw new Error(result.message || 'خطا در آپلود فایل‌ها');
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

/**
 * Format file object for form submission
 * @param {Object} fileInfo - File info returned from server
 * @returns {Object} Formatted file object
 */
export const formatFileForSubmission = (fileInfo) => {
  if (!fileInfo) return null;
  
  if (Array.isArray(fileInfo)) {
    return fileInfo.map(file => file.filePath);
  }
  
  return fileInfo.filePath;
};

/**
 * Format file response for display in form
 * @param {string|Array} filePath - File path or array of paths from API
 * @returns {Object|Array} Formatted file object(s)
 */
export const formatFileFromResponse = (filePath) => {
  if (!filePath) return null;
  
  if (Array.isArray(filePath)) {
    return filePath.map(path => ({
      filePath: path,
      fileName: path.split('/').pop(),
      // Generate a fake ID if needed
      id: `file-${Math.random().toString(36).substr(2, 9)}`
    }));
  }
  
  return {
    filePath,
    fileName: filePath.split('/').pop(),
    id: `file-${Math.random().toString(36).substr(2, 9)}`
  };
};

/**
 * Get file extension from file name
 * @param {string} fileName - File name
 * @returns {string} File extension
 */
export const getFileExtension = (fileName) => {
  return fileName.split('.').pop().toLowerCase();
};

/**
 * Check if file is an image
 * @param {string} fileName - File name
 * @returns {boolean} True if file is an image
 */
export const isImageFile = (fileName) => {
  const extension = getFileExtension(fileName);
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension);
};

/**
 * Get preview URL for a file
 * @param {File|Object} file - File object or file info from server
 * @returns {string} URL for preview
 */
export const getFilePreviewUrl = (file) => {
  // If it's a File object from input
  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
  
  // If it's a file info object from server
  if (file && file.filePath) {
    return getServerFile(file.filePath);
  }
  
  // If it's just a path string
  if (typeof file === 'string') {
    return getServerFile(file);
  }
  
  return '';
};



// export const getServerFile = (filePath) => {
// 	if (!filePath) return null;
	
// 	if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
// 	  return filePath;
// 	}
	
// 	if (filePath.startsWith('data:')) {
// 	  return filePath;
// 	}
	
// 	const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
	
// 	const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
	
// 	return `${apiBaseUrl}${normalizedPath}`;
//   };
  

  export const truncateText = (text, length = 100) => {
	if (!text) return '';
	if (text.length <= length) return text;
	return text.substring(0, length) + '...';
  };
  
  export const getPlainTextFromEditorJS = (content) => {
	if (typeof content === 'string') {
	  try {
		const parsed = JSON.parse(content);
		if (parsed.blocks && Array.isArray(parsed.blocks)) {
		  return parsed.blocks
			.map((block) => {
			  switch (block.type) {
				case 'paragraph':
				  return block.data.text || '';
				case 'header':
				  return block.data.text || '';
				case 'list':
				  return (block.data.items || []).join(' ');
				default:
				  return '';
			  }
			})
			.join(' ');
		}
		return content;
	  } catch (e) {
		return content;
	  }
	}
	
	if (content && content.blocks && Array.isArray(content.blocks)) {
	  return content.blocks
		.map((block) => {
		  switch (block.type) {
			case 'paragraph':
			  return block.data.text || '';
			case 'header':
			  return block.data.text || '';
			case 'list':
			  return (block.data.items || []).join(' ');
			default:
			  return '';
		  }
		})
		.join(' ');
	}
	return '';
  };
  