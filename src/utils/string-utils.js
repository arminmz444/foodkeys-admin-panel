export const getSafeString = (str) => {
	if (!str) return '';

	return String(str).trim();
};
