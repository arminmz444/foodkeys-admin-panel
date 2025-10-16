import Axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Configure Axios with the same settings as apiService
Axios.defaults.baseURL = API_BASE_URL;
if (!Axios.defaults.baseURL.includes('/api/v1')) {
	Axios.defaults.baseURL += '/api/v1';
}

Axios.defaults.withCredentials = true;
Axios.defaults.headers.get['Content-Type'] = 'application/json';
Axios.defaults.headers.delete['Content-Type'] = 'application/json';
Axios.defaults.headers.post['Content-Type'] = 'application/json';
Axios.defaults.headers.put['Content-Type'] = 'application/json';

// Request interceptor - same as apiService
Axios.interceptors.request.use(
	(config) => {
		if (!config.headers.Authorization) {
			config.headers.Authorization = `Bearer ${localStorage.getItem('jwt_access_token') || ''}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor - same as apiService
Axios.interceptors.response.use(
	(response) => {
		// Same response handling as apiService
		return response;
	},
	(error) => {
		// Same error handling as apiService
		const responseData = error?.response?.data || null;
		const statusCode = responseData?.statusCode || null;
		const apiError = responseData?.error || null;
		const defaultMessage = 'خطا در ارتباط با سرور';
		const apiMessage = responseData?.message || defaultMessage;
		const message = `خطا در انجام عملیات: ${apiMessage}`;
		
		enqueueSnackbar(message, {
			variant: 'error',
			style: { fontSize: 'medium' }
		});

		return Promise.reject(error);
	}
);

export default Axios;
