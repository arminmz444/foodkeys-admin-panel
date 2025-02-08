import { API_BASE_URL } from 'app/store/apiService.js';

const jwtAuthConfig = {
	tokenStorageKey: 'jwt_access_token',
	userStorageKey: 'user_data',
	signInUrl: `${API_BASE_URL}/auth/login/`, //`${API_BASE_URL}/auth/login/`, // 'mock-api/auth/sign-in',
	// signUpUrl: 'mock-api/auth/sign-up', //`${API_BASE_URL}/auth/signup`, // 'mock-api/auth/sign-up',
	tokenRefreshUrl: `${API_BASE_URL}/auth/refresh`, //`${API_BASE_URL}/auth/refresh`, // 'mock-api/auth/refresh',
	getUserUrl: `${API_BASE_URL}/user/me`, //`${API_BASE_URL}/user/me`, // 'mock-api/auth/user',
	updateUserUrl: `${API_BASE_URL}/auth/profile`,
	updateTokenFromHeader: false
};
export default jwtAuthConfig;
