import { API_STATIC_FILES_BASE_URL } from 'app/store/apiService.js';

export const getSafeString = (str) => {
	if (!str) return '';

	return String(str).trim();
};

export const getServerFile = (path, sub = '') => path ? API_STATIC_FILES_BASE_URL + path : sub
