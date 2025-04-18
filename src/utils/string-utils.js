import { API_STATIC_FILES_BASE_URL } from 'app/store/apiService.js';
import { twMerge } from "tailwind-merge"

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
  