import Axios from 'axios';
import { enqueueSnackbar } from 'notistack';

Axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

if (!Axios.defaults.baseURL.includes('/api/v1')) Axios.defaults.baseURL += '/api/v1';

Axios.defaults.withCredentials = true;
Axios.defaults.headers.get['Content-Type'] = 'application/json';
Axios.defaults.headers.delete['Content-Type'] = 'application/json';
Axios.defaults.headers.post['Content-Type'] = 'application/json';
Axios.defaults.headers.put['Content-Type'] = 'application/json';

Axios.interceptors.request.use(
	(config) => {
		if (!config.headers.Authorization) {
			config.headers.Authorization = `Bearer ${localStorage.getItem('jwt_access_token') || ''}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

Axios.interceptors.response.use(
	(response) => {
		console.log(response.data)
		if (response.data && response.data.statusCode !== 200) {
			enqueueSnackbar(response.data.message || 'خطا در ارتباط با سرور', { className: 'bg-red' });
			return Promise.reject(response);
		}

		return response;
	},
	(error) => {
		// toast.error(
		// 	error.response?.data?.message ||
		// 	'خطا در ارتباط با سرور'
		// );
		return Promise.reject(error);
	}
);

export default Axios;
