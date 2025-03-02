import { API_STATIC_FILES_BASE_URL } from 'app/store/apiService.js';

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
