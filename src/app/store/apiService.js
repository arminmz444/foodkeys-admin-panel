import { createApi } from '@reduxjs/toolkit/query/react';
import Axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const axiosBaseQuery =
	() =>
		async ({ url, method, data, params }) => {
			try {
				Axios.defaults.baseURL = API_BASE_URL; // + "/api/v1";
				// if (!Axios.defaults.baseURL.includes("/api/v1")) Axios.defaults.baseURL += "/api/v1";
				Axios.defaults.withCredentials = true;
				Axios.defaults.headers.get['Content-Type'] = 'application/json';
				Axios.defaults.headers.delete['Content-Type'] = 'application/json';
				Axios.defaults.headers.post['Content-Type'] = 'application/json';
				Axios.defaults.headers.put['Content-Type'] = 'application/json';
				const requestIntercept = Axios.interceptors.request.use(
					(config) => {
						if (!config.headers.Authorization) {
							config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwOTE0NDIyNjEzOSIsInNlc3Npb25JZCI6ImtvZWMzNjExOWlrbjhnanFnYjFhMjFjczVmIiwiaWF0IjoxNzM4MTE0NDU3LCJleHAiOjIwOTgxMTQ0NTd9.sHfseOxhnyI52VCw8zGxeAAd5grorzX5TpKwZ5X9PfY`;
						}
						return config;
					},
					(error) => Promise.reject(error)
				);
				// Axios.interceptors.requestheaders.post["Authorization"] = "";
				const result = await Axios({
					url,
					method,
					data,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					params
				});
				return { data: result.data };
			} catch (axiosError) {
				const error = axiosError;
				return {
					error
				};
			}
		};
export const apiService = createApi({
	baseQuery: axiosBaseQuery(),
	endpoints: () => ({}),
	reducerPath: 'apiService'
});
export default apiService;
