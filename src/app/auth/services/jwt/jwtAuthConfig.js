import { API_BASE_URL } from 'app/store/apiService.js';

const jwtAuthConfig = {
	tokenStorageKey: 'jwt_access_token',
	userStorageKey: 'user_data',
	signInUrl: 'mock-api/auth/sign-in', //`${API_BASE_URL}/auth/login/`, // 'mock-api/auth/sign-in',
	signUpUrl: 'mock-api/auth/sign-up', //`${API_BASE_URL}/auth/signup`, // 'mock-api/auth/sign-up',
	tokenRefreshUrl: 'mock-api/auth/refresh', //`${API_BASE_URL}/auth/refresh`, // 'mock-api/auth/refresh',
	getUserUrl: 'mock-api/auth/user', //`${API_BASE_URL}/user/me`, // 'mock-api/auth/user',
	updateUserUrl: 'mock-api/auth/user',
	updateTokenFromHeader: true
};
export default jwtAuthConfig;
